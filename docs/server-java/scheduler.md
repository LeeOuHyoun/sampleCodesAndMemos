# 스케줄러 <Badge type="info" text="원본 분석" />

정해진 시각마다 JPO 를 실행하는 방법입니다. 프로젝트는 [Quartz](https://www.quartz-scheduler.org/) 를 웹앱 안에서 띄우고, 외부 시스템이 인터페이스 테이블에 넣어 둔 데이터를 몇 분마다 읽어 오는 데 씁니다.

| class | 역할 |
| --- | --- |
| 스케줄러 서블릿 | 서버가 뜰 때 Quartz 를 시작하고 Job 과 실행 시각을 등록 |
| Job | 실행 시각이 되면 불림. Context 를 만들어 JPO 를 부름 |
| 인터페이스 JPO | 실제 업무 처리 ([외부 DB](/server-java/external-db#한-줄씩-처리하고-상태-남기기)) |

::: info 근거
프로젝트 `src/` 의 scheduler 패키지 (스케줄러 서블릿 1 개, Job 7 개) 와 cron 식이 적힌 StringResource properties. 분석한 `web.xml` 과 `WEB-INF/lib` 에는 이 서블릿의 등록과 Quartz jar 가 없어서 서버에 넣는 부분은 확인하지 못했습니다
:::

## 스케줄러 서블릿

`HttpServlet` 을 상속한 class 의 생성자에서 Quartz 를 시작합니다. 요청을 처리하는 서블릿이 아니고, 서버가 뜰 때 한 번 실행되게 하려고 서블릿 형태를 빌린 것입니다.

```java
package com.example.scheduler.job;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

public class MyInterfaceScheduler extends HttpServlet {

    private static final String RESOURCE = "emxMyAppStringResource";

    public MyInterfaceScheduler() {
        try {
            Context context = MyDomainUtil.getContext();
            Scheduler scheduler = new StdSchedulerFactory().getScheduler();

            JobDetail customerJob = newJob(MyCustomerInterfaceJob.class).withIdentity("jobCustomer", "groupCustomer").build();
            String customerCron = EnoviaResourceBundle.getProperty(context, RESOURCE, context.getLocale(), "emxMyApp.Interface.CronSchedule.Customer");
            CronTrigger customerTrigger = newTrigger().withIdentity("triggerCustomer", "groupCustomer").withSchedule(cronSchedule(customerCron)).build();
            scheduler.scheduleJob(customerJob, customerTrigger);

            scheduler.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

| 호출 | 내용 |
| --- | --- |
| `new StdSchedulerFactory().getScheduler()` | 스케줄러 얻기 |
| `newJob(Job.class).withIdentity(이름, 그룹).build()` | 실행할 Job 정의. 이름과 그룹의 조합은 Job 마다 달라야 함 |
| `EnoviaResourceBundle.getProperty(context, 리소스, locale, 키)` | properties 에서 cron 식 읽기 |
| `newTrigger().withIdentity(이름, 그룹).withSchedule(cronSchedule(식)).build()` | 실행 시각 정의 |
| `scheduler.scheduleJob(job, trigger)` | Job 과 실행 시각 연결 |
| `scheduler.start()` | 시작. 모든 Job 을 등록한 뒤 한 번 |

Job 하나에 네 줄(Job 정의, cron 읽기, 트리거 정의, 등록)이 한 묶음입니다. Job 을 늘릴 때는 이 묶음을 추가합니다.

## 실행 시각 (cron)

cron 식은 코드가 아니라 StringResource properties 에 둡니다. 서버마다 주기를 다르게 줄 수 있습니다.

```properties
emxMyApp.Interface.CronSchedule.Customer = 1 0/5 * * * ?
emxMyApp.Interface.CronSchedule.Product = 2 0/5 * * * ?
emxMyApp.Interface.CronSchedule.ExchangeRate = 0 0 10 * * ?
```

Quartz 의 cron 식은 **초부터 시작하는 6 칸** 입니다. 리눅스 crontab 의 5 칸과 다릅니다.

| 칸 | 값 | 예 |
| --- | --- | --- |
| 초 | 0 ~ 59 | `1` |
| 분 | 0 ~ 59 | `0/5` (0 분부터 5 분마다) |
| 시 | 0 ~ 23 | `10`, `6-23` |
| 일 | 1 ~ 31 | `*` |
| 월 | 1 ~ 12 | `*` |
| 요일 | 1 ~ 7 (일 ~ 토) | `?` |

- `일` 과 `요일` 중 하나는 `?` 로 둡니다. 둘 다 `*` 이면 식이 틀렸다는 예외가 납니다.
- 원본은 같은 5 분 주기의 Job 들에 초를 1, 2, 3, 4 로 다르게 줘서 같은 순간에 한꺼번에 시작하지 않게 했습니다.
- cron 식은 서블릿 생성자에서 한 번 읽습니다. 값을 고치면 서버를 다시 시작해야 합니다 ([properties 반영](/properties/#고친-뒤-반영)).

## Job

```java
package com.example.scheduler.job;

public class MyCustomerInterfaceJob implements Job {

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        try {
            String user = MyConfig.values.get("ENCRYPTED_IF_USERNAME");
            String password = MyConfig.values.get("ENCRYPTED_IF_PASSWORD");
            Context context = MyDomainUtil.getContext(user, password, "ctx::VPLMProjectAdministrator.MyCompany.MySpace");
            JPO.invoke(context, "MyCustomerInterfaceJob", null, "transferCustomer", JPO.packArgs(new HashMap<>()));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

- Job 에는 업무 로직이 없습니다. [Context 를 만들고](/server-java/#서버에서-context-만들기) `JPO.invoke` 를 부르는 것이 전부입니다. 처리 내용을 고칠 때는 JPO 만 다시 컴파일하면 됩니다.
- **보안 컨텍스트를 명시합니다.** 배치가 만드는 객체의 소유 조직과 협업공간이 여기서 정해집니다. 원본은 일부 Job 에서 기본값으로 만들던 것을 명시하는 방식으로 고쳐 두었습니다.
- 예외를 밖으로 던지지 않고 모두 잡습니다. 한 번 실패해도 다음 주기에 다시 실행됩니다.
- 원본 Job 은 만든 Context 를 닫지 않습니다. 몇 분마다 도는 Job 이므로 `finally` 에서 닫는 편이 안전한 것으로 보입니다. <Badge type="danger" text="검증 필요" />
- 앞 실행이 끝나기 전에 다음 주기가 오면 같은 Job 이 겹쳐 실행됩니다. 겹치면 안 되는 Job 은 class 에 Quartz 의 `@DisallowConcurrentExecution` 을 붙입니다. 원본에는 붙어 있지 않습니다. <Badge type="danger" text="검증 필요" />

## 서버에 넣기

| 항목 | 내용 |
| --- | --- |
| class | `WEB-INF/classes` 에 넣고 재시작 ([서버 반영 절차](/deploy/#커스텀-java-src)) |
| jar | Quartz jar 를 `WEB-INF/lib` 에 추가 |
| 서블릿 등록 | `web.xml` 에 `<servlet>` 과 `<load-on-startup>` |

```xml
<servlet>
    <servlet-name>MyInterfaceScheduler</servlet-name>
    <servlet-class>com.example.scheduler.job.MyInterfaceScheduler</servlet-class>
    <load-on-startup>1</load-on-startup>
</servlet>
```

`<load-on-startup>` 이 있어야 서버가 뜰 때 생성자가 실행됩니다. 없으면 그 서블릿으로 요청이 올 때까지 스케줄러가 시작되지 않습니다. 분석한 `web.xml` 에는 이 등록이 없어서 위 형태는 서블릿 표준에 따른 추정입니다. <Badge type="danger" text="검증 필요" />

::: warning 서버가 여러 대면 대수만큼 실행됩니다
스케줄러는 웹앱마다 따로 뜹니다. 3DSpace 를 두 대로 운영하면 같은 Job 이 두 서버에서 동시에 돌아 같은 행을 두 번 처리할 수 있습니다. 한 대에만 서블릿을 등록하거나 Quartz 의 클러스터 설정을 써야 합니다. 원본에는 이에 대한 처리가 보이지 않습니다. <Badge type="danger" text="검증 필요" />
:::

## Job 켜고 끄기

원본은 쓰지 않는 Job 을 서블릿의 등록 묶음과 properties 의 cron 키 두 곳에서 모두 주석으로 막아 두었습니다.

| 하려는 일 | 고칠 곳 |
| --- | --- |
| Job 추가 | Job class 작성, 서블릿에 등록 묶음 추가, properties 에 cron 키 추가, JPO 에 메서드 추가 |
| Job 끄기 | 서블릿의 등록 묶음을 막음 (cron 키만 지우면 생성자에서 예외가 나 뒤의 Job 까지 등록되지 않음) |
| 주기 변경 | properties 의 cron 식 변경 후 재시작 |

::: tip 생성자 전체가 한 try 안에 있습니다
등록 도중 한 Job 에서 예외가 나면 그 뒤의 Job 과 `scheduler.start()` 가 실행되지 않습니다. 스케줄러가 하나도 돌지 않으면 서버 시작 로그에서 생성자의 예외부터 찾습니다.
:::

## OOTB 의 다른 방법

`web.xml` 에는 OOTB 가 주는 타이머 설정(`ematrix.timer.*` 파라미터와 타이머 서블릿)이 주석으로 남아 있습니다. 프로젝트는 이것을 쓰지 않고 Quartz 를 골랐습니다. OOTB 타이머의 사용법은 분석하지 않았습니다.
