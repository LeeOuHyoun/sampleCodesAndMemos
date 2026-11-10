# 외부 DB (MyBatis) <Badge type="info" text="원본 분석" />

ENOVIA 의 데이터는 `DomainObject` 와 MQL 로 다루고 DB 에 직접 SQL 을 보내지 않습니다. 직접 SQL 을 쓰는 곳은 **ENOVIA 스키마 밖의 테이블**, 곧 외부 시스템(ERP 등)과 데이터를 주고받는 인터페이스 테이블입니다. 프로젝트는 여기에 [MyBatis](https://mybatis.org/mybatis-3/) 를 씁니다.

| 구성 | 위치 | 역할 |
| --- | --- | --- |
| 설정 | `resources/custom/db/mybatis-config.xml` | 접속 정보, mapper 목록 |
| mapper | `src/com/example/mybatis/query_*.xml` | SQL |
| 관리 class | `MyBatisManager` | `SqlSession` 을 내줌 |
| DataSource 팩토리 | `EncryptedDataSourceFactory` | 암호화된 접속 정보를 복호화 |
| 테이블 DDL | `sql/*.sql` | 인터페이스 테이블과 DB 계정 생성문 |

::: info 근거
프로젝트 `src/` 의 mybatis 패키지 (class 3 개, mapper 10 개), `resources/custom/db/mybatis-config.xml`, `sql/` 폴더의 DDL, 이 mapper 를 쓰는 인터페이스 JPO. 테이블과 컬럼 이름은 일반적인 이름으로 바꿔 적었습니다
:::

## 인터페이스 테이블

외부 시스템과는 서로의 DB 를 직접 고치지 않고 중간 테이블을 사이에 둡니다. 보내는 쪽이 행을 넣고, 받는 쪽이 읽어 처리한 뒤 그 행에 결과를 적습니다.

```sql
CREATE TABLE MY_IF.PLM_RCV_SAMPLE (
    IF_SQ       VARCHAR2(20 CHAR)  NOT NULL,
    ITEM_CODE   VARCHAR2(10 CHAR)  NOT NULL,
    ITEM_NAME   VARCHAR2(35 CHAR)  NULL,
    INTF_TYPE   VARCHAR2(1 CHAR)   NULL,
    IN_STATUS   VARCHAR2(1 CHAR)   DEFAULT 'N' NULL,
    IN_DATE     DATE               NULL,
    IN_MSG      VARCHAR2(200)      NULL,
    INSERT_DATE DATE               DEFAULT SYSDATE
);
```

| 컬럼 | 적는 쪽 | 내용 |
| --- | --- | --- |
| `IF_SQ` | 보내는 쪽 | 순번. 같은 코드가 여러 번 오면 가장 큰 값이 최신 |
| 업무 컬럼 | 보내는 쪽 | 코드, 이름 등 |
| `INTF_TYPE` | 보내는 쪽 | `N` 신규, `U` 변경 |
| `IN_STATUS` | 받는 쪽 | `N` 미처리, `Y` 성공, `E` 실패 |
| `IN_DATE` | 받는 쪽 | 처리 시각 |
| `IN_MSG` | 받는 쪽 | `SUCCESS` 또는 실패 사유 (200 자) |
| `INSERT_DATE` | 보내는 쪽 | 행이 들어온 시각 |

- 테이블은 ENOVIA 스키마와 다른 DB 계정(스키마)에 만듭니다. `sql/` 폴더에 테이블마다 `.sql` 파일 하나와 계정 생성문이 있습니다.
- 방향은 테이블 이름으로 구분합니다. 원본은 받는 테이블에 `RCV`, 보내는 테이블에 `IFC` 를 넣었습니다.

## 설정 (mybatis-config.xml)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="com.example.mybatis.util.EncryptedDataSourceFactory">
        <property name="driver" value="oracle.jdbc.OracleDriver"/>
        <property name="encrypted_url" value="..."/>
        <property name="encrypted_username" value="..."/>
        <property name="encrypted_password" value="..."/>
      </dataSource>
    </environment>
  </environments>
  <mappers>
    <mapper resource="com/example/mybatis/query_PLM_RCV_SAMPLE.xml"/>
  </mappers>
</configuration>
```

| 요소 | 내용 |
| --- | --- |
| `<environment id>` | 서버 구분. [설정 로더](/server-java/#설정-로더) 의 `ENVIRONMENT` 값과 같은 id 를 씀 |
| `<transactionManager type="JDBC"/>` | 커밋과 롤백을 코드에서 직접 함 |
| `<dataSource type>` | 커넥션 풀을 만드는 팩토리 class |
| `encrypted_` 로 시작하는 property | 값이 암호문. 팩토리가 복호화 |
| `<mapper resource>` | 클래스패스 기준 mapper 경로. mapper 를 만들면 여기에 추가 |

이 접속은 ENOVIA 의 DB 접속과 별개입니다. ENOVIA 트랜잭션(`ContextUtil.startTransaction`)에 묶이지 않습니다.

### 접속 정보 암호화

MyBatis 의 `PooledDataSourceFactory` 를 상속해 `setProperties` 에서 `encrypted_` 접두어가 붙은 값만 복호화하고 접두어를 뗀 이름으로 넘깁니다.

```java
public class EncryptedDataSourceFactory extends PooledDataSourceFactory {

    private static final String PREFIX = "encrypted_";

    @Override
    public void setProperties(Properties properties) {
        Properties decrypted = new Properties();
        for (String name : properties.stringPropertyNames()) {
            String value = properties.getProperty(name);
            if (name.startsWith(PREFIX)) {
                decrypted.setProperty(name.substring(PREFIX.length()), MyEncryptUtil.decrypt(value));
            } else {
                decrypted.setProperty(name, value);
            }
        }
        super.setProperties(decrypted);
    }
}
```

`encrypted_url` 은 `url` 로, `encrypted_password` 는 `password` 로 바뀌어 부모 class 에 들어갑니다. 설정 파일에 평문 접속 정보를 두지 않기 위한 장치입니다.

## SqlSession 얻기

```java
public class MyBatisManager {

    private static final String CONFIG_PATH = "custom/db/mybatis-config.xml";
    private static volatile SqlSessionFactory sqlSessionFactory;

    private static SqlSessionFactory getSqlSessionFactory() {
        if (sqlSessionFactory == null) {
            synchronized (MyBatisManager.class) {
                if (sqlSessionFactory == null) {
                    sqlSessionFactory = createSqlSessionFactory();
                }
            }
        }
        return sqlSessionFactory;
    }

    private static SqlSessionFactory createSqlSessionFactory() {
        try {
            String environment = MyConfig.values.get("ENVIRONMENT");
            InputStream inputStream = Resources.getResourceAsStream(CONFIG_PATH);
            return new SqlSessionFactoryBuilder().build(inputStream, environment);
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize MyBatis", e);
        }
    }

    public static SqlSession getSqlSession() {
        return getSqlSessionFactory().openSession();
    }
}
```

- `SqlSessionFactory` 는 처음 쓸 때 한 번 만들어 계속 씁니다. 설정 파일이나 mapper 를 고치면 서버를 다시 시작해야 합니다.
- `build(inputStream, environment)` 의 두 번째 인자로 `<environment id>` 를 고릅니다. 같은 설정 파일을 개발, 운영 서버에 그대로 두고 properties 의 `ENVIRONMENT` 값만 다르게 줍니다.
- `openSession()` 은 자동 커밋이 꺼진 세션을 줍니다. `commit()` 을 부르지 않고 닫으면 변경이 버려집니다.
- 원본의 필드에는 `volatile` 이 없습니다. 위 예는 이중 확인 잠금이 바르게 동작하도록 `volatile` 을 붙인 형태입니다.

## mapper

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="query_PLM_RCV_SAMPLE">

    <select id="select_ITEM" parameterType="map" resultType="map">
        SELECT IF_SQ, ITEM_CODE, ITEM_NAME, INTF_TYPE, IN_STATUS
        FROM MY_IF.PLM_RCV_SAMPLE a
        WHERE a.IF_SQ = (
            SELECT MAX(b.IF_SQ)
            FROM MY_IF.PLM_RCV_SAMPLE b
            WHERE b.ITEM_CODE = a.ITEM_CODE
              AND NVL(b.INTF_TYPE, 'N') IN ('N', 'U')
              AND NVL(b.IN_STATUS, 'N') = 'N'
        )
    </select>

    <update id="update_ITEM" parameterType="map">
        UPDATE MY_IF.PLM_RCV_SAMPLE
        SET IN_STATUS = #{IN_STATUS}
          , IN_DATE = SYSDATE
          , IN_MSG = #{IN_MSG}
        WHERE ITEM_CODE = #{ITEM_CODE}
          AND NVL(IN_STATUS, 'N') = 'N'
    </update>
</mapper>
```

| 항목 | 내용 |
| --- | --- |
| 파일 이름 | `query_테이블이름.xml`. 테이블 하나에 mapper 하나 |
| `namespace` | 파일 이름과 같게 |
| 부르는 이름 | `namespace.id` (`query_PLM_RCV_SAMPLE.select_ITEM`). 상수 class 에 모아 둠 |
| `parameterType="map"` | `Map` 의 키를 `#{키}` 로 씀 |
| `resultType="map"` | 한 행이 `Map<String, Object>`. 키는 컬럼 이름 (Oracle 은 대문자) |

- **조회**: 같은 코드의 미처리 행이 여러 개 쌓여 있으면 `IF_SQ` 가 가장 큰 행 하나만 읽습니다. 그 사이의 변경은 건너뛰고 최신 값만 반영합니다.
- **갱신**: 순번이 아니라 코드로 갱신해서 그 코드의 미처리 행 전체에 같은 결과를 적습니다. 건너뛴 예전 행이 다음 주기에 다시 읽히지 않게 하려는 것입니다.
- 조회한 행의 `Map` 에 상태 값만 더 넣어 그대로 갱신의 인자로 씁니다. 그래서 조회 컬럼 이름과 `#{}` 이름이 같습니다.

## 한 줄씩 처리하고 상태 남기기

[스케줄러](/server-java/scheduler) 가 부르는 인터페이스 JPO 의 틀입니다.

```java
public void transferItem(Context context, String[] args) throws Exception {
    try (SqlSession session = MyBatisManager.getSqlSession()) {
        List<Map<String, Object>> rows = session.selectList("query_PLM_RCV_SAMPLE.select_ITEM");
        for (Map<String, Object> row : rows) {
            try {
                String code = Objects.toString(row.get("ITEM_CODE"), "");
                String name = Objects.toString(row.get("ITEM_NAME"), "");
                if (code.isEmpty() || name.isEmpty()) {
                    throw new Exception("Item code or name is empty.");
                }
                createOrUpdate(context, code, name);
                row.put("IN_STATUS", "Y");
                row.put("IN_MSG", "SUCCESS");
            } catch (Exception ex) {
                String message = "FAIL: " + ex.getMessage();
                row.put("IN_STATUS", "E");
                row.put("IN_MSG", message.length() > 200 ? message.substring(0, 200) : message);
            }
            session.update("query_PLM_RCV_SAMPLE.update_ITEM", row);
            session.commit();
        }
    }
}
```

| 규칙 | 이유 |
| --- | --- |
| `try (SqlSession ...)` | 끝나면 세션을 닫아 커넥션을 풀에 돌려줌 |
| 행마다 `try` | 한 행이 실패해도 나머지 행은 처리 |
| 행마다 `commit()` | 중간에 서버가 내려가도 처리한 행의 결과는 남음 |
| 실패하면 `E` 와 사유 | 다음 주기에 다시 읽지 않음. 사유를 보고 보내는 쪽이 고쳐서 새 행으로 다시 보냄 |
| 메시지를 200 자로 자름 | 컬럼 길이를 넘으면 갱신 자체가 실패해 그 행이 `N` 으로 남고 매 주기마다 다시 실패 |

`createOrUpdate` 자리에는 ENOVIA 쪽 처리가 들어갑니다. 원본의 흐름은 다음과 같습니다.

| 순서 | 호출 |
| --- | --- |
| 1 | `DomainObject.findObjects` 로 그 코드의 객체가 있는지 찾음 ([검색](/jpo/domain-object#검색-findobjects)) |
| 2 | 없으면 `FrameworkUtil.autoName` 으로 만들고 `setState`, `DomainRelationship.connect` ([연결](/jpo/domain-object#연결-끊기)) |
| 3 | 값이 달라졌을 때만 `setAttributeValues` ([쓰기](/jpo/domain-object#쓰기)) |

- 값이 같으면 수정하지 않습니다. 같은 데이터가 다시 와도 이력과 수정 시각이 바뀌지 않습니다.
- ENOVIA 쪽 처리와 인터페이스 테이블 갱신은 한 트랜잭션이 아닙니다. 객체는 만들어졌는데 상태 갱신 전에 서버가 내려가면 그 행은 `N` 으로 남아 다시 처리됩니다. "있으면 수정, 없으면 생성" 으로 짜 두면 다시 처리해도 결과가 같습니다.
- 원본은 메서드 전체의 처리 건수와 걸린 시간을 로그로 남기고, 5 분(스케줄 주기)을 넘으면 경고를 남깁니다.

## 서버에 넣기

| 항목 | 내용 |
| --- | --- |
| jar | MyBatis jar 와 JDBC 드라이버 jar 를 `WEB-INF/lib` 에 추가. 분석한 `WEB-INF/lib` 에는 없어서 실제 위치는 확인하지 못했습니다. <Badge type="danger" text="검증 필요" /> |
| 설정, mapper | `WEB-INF/classes` 아래 같은 경로로 복사 ([서버 반영 절차](/deploy/#커스텀-리소스-resources-custom)) |
| 테이블 | `sql/` 의 DDL 을 DB 관리 도구로 실행. MQL 로 만들지 않음 |
| 권한 | 인터페이스 계정에 그 테이블의 조회, 갱신 권한 |

JPO 에서 `MyBatisManager` 를 `import` 해서 쓰므로 JPO 를 컴파일하는 시점에 이 class 와 MyBatis jar 가 서버 클래스패스에 있어야 합니다.
