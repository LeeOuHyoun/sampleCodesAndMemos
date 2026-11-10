# MqlUtil <Badge type="info" text="원본 분석" />

`MqlUtil.mqlCommand` 는 JPO 안에서 MQL 명령을 그대로 실행합니다. `DomainObject` 에 없는 기능 (관계 정보, 정책, 역할 목록, 환경 변수, 트리거 끄기 ...) 이나 결과를 문자열 한 줄로 받고 싶을 때 씁니다.

::: info 근거
jpo 폴더 `MqlUtil.mqlCommand(` 2,365 건. 시그니처와 동작은 xerinfra.jar `com.matrixone.apps.domain.util.MqlUtil` class 파일 (오버로드 16 개) 의 바이트코드 기준
:::

샘플: [XX_MyPartAction_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/JPOSample/XX_MyPartAction_mxJPO.java) (mqlCommand 의 $1 인자, notice, print bus)

## 기본 형태

```java
String current = MqlUtil.mqlCommand(context, "print bus $1 select $2 dump", objectId, "current");
String relType = MqlUtil.mqlCommand(context, "print connection $1 select $2 dump", relId, "name");
MqlUtil.mqlCommand(context, "modify bus $1 owner $2", objectId, newOwner);
```

- 명령 안의 `$1`, `$2` ... 를 뒤의 인자로 채웁니다. 값에 공백이나 따옴표가 있어도 안전합니다.
- 결과는 `String` 입니다. 끝의 줄바꿈은 잘라서 돌려주는 것으로 보입니다.
- 명령이 실패하면 MQL 오류 문구를 담은 `FrameworkException` 을 던집니다.

::: warning 문자열을 이어 붙이지 않습니다
`"print bus " + id + " select name dump"` 처럼 값을 이어 붙이면 MQL 인젝션 위험이 있고, 이름에 공백이 있으면 깨집니다. OOTB 는 2011 년 무렵 `$1` 형태로 고쳤다는 주석 (`Mql Injection:parameterized Mql`) 을 곳곳에 남겼습니다. 새 코드는 항상 `$1` 을 씁니다.
:::

## 오버로드

| 시그니처 | 설명 |
| --- | --- |
| `mqlCommand(Context, String cmd)` | 인자 없는 명령 |
| `mqlCommand(Context, String cmd, String... args)` | `$1` 채우기. 가장 많이 씀 |
| `mqlCommand(Context, String cmd, List args)` | 인자를 List 로 |
| `mqlCommand(Context, String cmd, boolean push)` | 슈퍼유저로 실행 |
| `mqlCommand(Context, String cmd, boolean push, String... args)` | 슈퍼유저 + `$1` |
| `mqlCommand(Context, MQLCommand, String cmd)` | MQLCommand 객체 재사용 |
| `mqlCommandStream(Context, String cmd)` | 결과가 클 때 `Reader` 로 받음 |

### boolean 인자

`String` 바로 뒤의 `boolean` 은 **`ContextUtil.pushContext` 로 슈퍼유저가 되어 실행할지** 입니다. `true` 면 실행 전에 `pushContext(context)`, 끝나면 (예외가 나도) `popContext(context)` 합니다.

```java
MqlUtil.mqlCommand(context, "trigger off", true);
MqlUtil.mqlCommand(context, "list role $1", true, "*");
```

| 호출 | 실행 사용자 |
| --- | --- |
| `mqlCommand(context, cmd, args...)` | 현재 로그인 사용자 |
| `mqlCommand(context, cmd, true, args...)` | User Agent (슈퍼유저) |
| `mqlCommand(context, cmd, false, args...)` | 현재 로그인 사용자 |

::: warning true 를 습관처럼 넣지 않습니다
OOTB 에 `true` 형태가 465 건 있어 따라 쓰기 쉽습니다. `true` 는 그 명령 하나만 권한 검사를 건너뜁니다. 사용자 권한으로 해야 하는 수정 (`modify bus ...`) 에 넣으면 권한이 없는 사용자도 수정할 수 있게 됩니다.
:::

::: info 근거
xerinfra.jar `MqlUtil`: `mqlCommand(Context, String, boolean, String[])` → `mqlCommand(Context, false, String, boolean, String[])` → `mqlCommand(Context, String, boolean, boolean, boolean, String[])`. 마지막 메서드가 첫 boolean 이 참이면 `ContextUtil.pushContext` 를 부르고 finally 에서 `ContextUtil.popContext`. `mqlCommand(Context, String, boolean)` 도 같은 방식. 오류 시 `MQLCommand.getError()` 로 `FrameworkException` 생성
:::

## 많이 쓰는 명령

| 명령 | 건수 | 용도 |
| --- | --- | --- |
| `print bus $1 select $2 dump` | 209 | 객체 값 하나 |
| `notice $1` | 148 | 사용자에게 알림 |
| `get env $1` | 74 | 환경 변수 (트리거 매크로, RPE) |
| `modify bus $1 ...` / `mod bus` | 59 / 34 | 객체 수정 |
| `print connection $1 select $2 dump` | 58 | 관계 정보 |
| `temp query bus $1 $2 $3 select $4 dump $5` | 54 | 검색 |
| `print policy $1 select $2 dump` | 43 | 정책 상태 목록 등 |
| `set env $1 $2` | 27 | 환경 변수 쓰기 |
| `list role $1` | 26 | 역할 목록 |
| `trigger off` / `trigger on` | 23 / 21 | 트리거 끄기 / 켜기 |
| `print person $1 select $2 dump` | 19 | 사람 정보 |
| `history off` / `history on` | 15 / 18 | 히스토리 기록 끄기 |
| `eval expr $1 on temp query bus $2 $3 $4 where $5` | 17 (`eval expr` 전체) | 개수 세기 같은 식 계산 |

### 여러 값 받기

`dump` 뒤에 구분자를 주고 잘라 씁니다.

```java
String out = MqlUtil.mqlCommand(context, "print bus $1 select $2 $3 dump $4", objectId, "name", "current", "|");
StringList values = FrameworkUtil.split(out, "|");
```

`FrameworkUtil.split` (1,135 건) 은 `StringUtil` 에서 물려받은 메서드입니다.

여러 줄 결과 (`temp query`) 는 줄마다 한 객체입니다. 줄바꿈으로 자른 뒤 다시 구분자로 자릅니다.

## 사용자에게 메시지 보내기

| 방법 | 결과 |
| --- | --- |
| `MqlUtil.mqlCommand(context, "notice $1", msg)` | 알림 (경고창) |
| `MqlUtil.mqlCommand(context, "warning $1", msg)` | 경고 |
| `MqlUtil.mqlCommand(context, "error $1", msg)` | 오류 |
| `emxContextUtil_mxJPO.mqlNotice(context, msg)` | 위 `notice $1` 을 감싼 static 메서드 (239 건) |
| `emxContextUtil_mxJPO.mqlError(context, msg)` | 위 `error $1` (54 건) |

- 메시지는 바로 뜨지 않고 context 의 클라이언트 작업 목록 (`context.getClientTasks()`) 에 쌓입니다. 화면 JSP 가 요청이 끝날 때 꺼내서 보여 줍니다 (`emxCreateProcess.jsp` 등).
- 트리거에서 진행을 막을 때는 `notice` 로 이유를 남기고 `1` 을 돌려줍니다 ([트리거](/trigger/)).

::: info 근거
emxContextUtilBase_mxJPO.java:192-226 (`mqlError`, `mqlNotice`, `mqlWarning` 이 각각 `"error $1"`, `"notice $1"`, `"warning $1"` 실행), common/emxCreateProcess.jsp:229-237 (`context.getClientTasks()` 로 메시지 꺼냄)
:::

## 트리거 / 히스토리 끄기

```java
ContextUtil.pushContext(context);
try {
    MqlUtil.mqlCommand(context, "trigger off");
    MqlUtil.mqlCommand(context, "modify bus $1 $2 $3", objectId, attrName, value);
} finally {
    MqlUtil.mqlCommand(context, "trigger on");
    ContextUtil.popContext(context);
}
```

::: warning 꼭 finally 에서 다시 켭니다
`trigger off` 는 같은 context (세션) 의 이후 명령 전체에 적용되는 것으로 보입니다. 다시 켜지 않으면 같은 요청 안에서 다른 객체의 트리거 (검사, 알림) 도 건너뜁니다. OOTB 도 `try { trigger off } finally { trigger on }` 형태로 씁니다.
:::

## 환경 변수 (RPE)

트리거 매크로와 요청 단위 표시값은 MQL 환경 변수로 주고받습니다.

| 메서드 | 실행 명령 |
| --- | --- |
| `PropertyUtil.setRPEValue(context, name, value, global)` | `set env $1 $2` / `set env global $1 $2` |
| `PropertyUtil.getRPEValue(context, name, global)` | `get env $1` / `get env global $1` |
| `PropertyUtil.setGlobalRPEValue(context, name, value)` | `setRPEValue(..., true)` |
| `MqlUtil.mqlCommand(context, "get env $1", "OBJECTID")` | 트리거 안에서 매크로 값 읽기 |

생성 화면 프레임워크는 연결 직전에 `MX_ALLOW_POV_STAMPING` 을 `"true"` 로 두고 끝나면 `"false"` 로 되돌립니다. 다른 코드에 신호를 보내는 용도로 씁니다.

::: info 근거
xerinfra.jar `PropertyUtil.setRPEValue` / `getRPEValue` 바이트코드 (`"set env global $1 $2"`, `"set env $1 $2"`, `"get env global $1"`, `"get env $1"`). common/emxCreateProcess.jsp:206, 218. emxCommonCompleteTaskBase_mxJPO.java:135 (`get env $1`, `MX_TASK_AUTO_COMPLETE`)
:::

## DomainObject 와 나눠 쓰기

| 할 일 | 권장 |
| --- | --- |
| 객체 값 읽기 / 쓰기, 관계 따라가기 | `DomainObject` ([DomainObject](/jpo/domain-object)) |
| 관계 하나의 정보 (`print connection`) | `DomainRelationship.getInfo` 또는 MqlUtil |
| 정책 / 타입 / 역할 같은 관리 객체 정보 | MqlUtil (`print policy`, `list role`) |
| 트리거 / 히스토리 끄기, 환경 변수 | MqlUtil |
| 큰 결과 | `mqlCommandStream` 또는 `getRelatedObjects` 의 개수 제한 |
