# Context, 트랜잭션, 권한 전환 <Badge type="info" text="원본 분석" />

`Context` 는 "누가, 어떤 트랜잭션 안에서" 실행 중인지를 담은 세션 객체입니다. JPO 메서드는 항상 첫 인자로 받습니다. 이 페이지는 Context 에서 꺼내 쓰는 값, 트랜잭션 (`ContextUtil.startTransaction`), 슈퍼유저로 잠깐 바꾸기 (`pushContext` / `popContext`) 를 정리합니다.

::: info 근거
jpo 폴더 호출 수: `context.getLocale(` 1,617, `context.getSession(` 1,340, `context.getUser(` 742, `ContextUtil.pushContext(` 698, `ContextUtil.popContext(` 725, `ContextUtil.startTransaction(` 359, `ContextUtil.commitTransaction(` 369, `ContextUtil.abortTransaction(` 378. 동작은 xerinfra.jar `ContextUtil`, eMatrixServletRMI.jar `matrix.db.Context` class 파일의 바이트코드 기준
:::

샘플: [XX_MyPartAction_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/JPOSample/XX_MyPartAction_mxJPO.java) (startTransaction / commit / abort, pushContext / popContext)

## Context 에서 꺼내는 값

| 메서드 | 값 |
| --- | --- |
| `context.getUser()` | 로그인 사용자 이름. `pushContext` 중이면 바뀐 사용자 |
| `context.getRole()` | 현재 보안 컨텍스트 (역할 / 조직 / 공간) 로 보입니다 <Badge type="danger" text="검증 필요" /> |
| `context.getLocale()` | `Locale`. 다국어 문구에 씀 |
| `context.getSession().getLanguage()` | 언어 코드 (`ko`, `en` ...) |
| `context.getVault().getName()` | 기본 vault |
| `context.isConnected()` | 서버에 연결된 context 인지. `mxMain` 첫 줄에서 확인하는 관례 |
| `context.isTransactionActive()` | 트랜잭션 진행 중인지 |
| `context.getApplication()` | 현재 앱 이름 |
| `context.getClientTasks()` | 쌓인 `notice` / `error` 메시지 ([MqlUtil](/jpo/mql-util#사용자에게-메시지-보내기)) |

- JSP 에서는 공통 include (`emxNavigatorInclude.inc` 등) 가 `context` 변수를 만들어 둡니다. 직접 얻을 때는 `Framework.getFrameContext(session)` 를 씁니다.
- Context 를 static 변수나 캐시에 담아 두지 않습니다. 요청마다 다른 사용자, 다른 트랜잭션입니다.

## 트랜잭션

여러 객체를 함께 바꿀 때 하나라도 실패하면 전부 되돌리려면 트랜잭션으로 묶습니다.

```java
ContextUtil.startTransaction(context, true);
try {
    DomainObject doc = DomainObject.newInstance(context);
    doc.createObject(context, typeDoc, null, null, null, null);
    DomainRelationship.connect(context, part, relName, doc);
    ContextUtil.commitTransaction(context);
} catch (Exception e) {
    ContextUtil.abortTransaction(context);
    throw e;
}
```

| 메서드 | 설명 |
| --- | --- |
| `startTransaction(context, true)` | 쓰기 트랜잭션 시작 (258 + 39 건). `false` 는 읽기 전용 (59 건) |
| `commitTransaction(context)` | 확정 |
| `abortTransaction(context)` | 되돌리기 |
| `isTransactionActive(context)` | 진행 중인지 |
| `setSavePoint(context, name)` / `abortSavePoint(context, name)` | 중간 지점. 생성 화면이 `"CreateObject"` 저장점을 씀 |

### 중첩 호출은 참조 카운트로 처리

`ContextUtil` 은 트랜잭션을 몇 번 열었는지 context 에 세어 둡니다. **가장 바깥 한 쌍만 실제로 시작 / 확정** 합니다.

| 상황 | `startTransaction` | `commitTransaction` | `abortTransaction` |
| --- | --- | --- | --- |
| 아무 트랜잭션 없음 | 실제 시작, 카운트 1 | 카운트 1 → 실제 commit | 카운트 1 → 실제 abort |
| `ContextUtil` 로 이미 시작됨 (카운트 n) | 카운트만 n+1 | 카운트만 -1 | 카운트만 -1 |
| 다른 곳에서 이미 시작됨 (카운트 0, 트랜잭션 활성) | 아무것도 안 하고 `false` 반환 | 아무것도 안 함 | 아무것도 안 함 |

::: warning 안쪽 abort 만으로는 되돌아가지 않습니다
안쪽에서 `abortTransaction` 을 불러도 카운트만 줄어듭니다. 바깥에서 예외를 잡고 `commitTransaction` 을 부르면 안쪽 변경까지 확정될 수 있습니다. 안쪽에서 실패하면 **예외를 다시 던져** 바깥도 abort 하게 합니다.
:::

::: warning commit 이 실패할 수 있습니다
가장 바깥 `commitTransaction` 은 먼저 MQL `print transaction` 으로 상태를 확인합니다. 트랜잭션 중간에 MQL 오류가 나서 "aborting" 상태면 `emxFramework.ContextUtil.ErrorCommit` 문구로 `FrameworkException` 을 던집니다. catch 에서 오류를 삼키고 계속 진행하면 이 지점에서 실패합니다.
:::

::: info 근거
xerinfra.jar `ContextUtil.startTransaction(Context, boolean, boolean)`: 카운트가 0 보다 크면 `incrementTransactionReferenceCount`, 아니면 `isTransactionActive` 가 참일 때 `false` 반환, 아니면 `Context.start` 후 카운트 1. `commitTransaction`: 카운트 0 이하면 무시, 1 이면 `isTransactionUpdateAndAborting` (`print transaction` 결과의 `aborting`, `update` 확인) 후 `Context.commit`. `abortTransaction`: 카운트를 줄여 0 이 될 때만 `Context.abort`
:::

### UI 가 열어 주는 트랜잭션

아래 경우에는 화면 처리 JSP 가 이미 트랜잭션을 열어 둔 상태에서 JPO 를 부릅니다. JPO 에서 `startTransaction` 을 불러도 카운트만 올라가고, 예외를 던지면 화면 처리 전체가 abort 됩니다.

| 화면 | 처리 JSP | 안에서 불리는 JPO |
| --- | --- | --- |
| 생성 폼 | `emxCreateProcess.jsp` | `createJPO`, 연결, `postProcessJPO` |
| 편집 폼 | `emxFormEditProcess.jsp` | 필드별 `Update Function`, `postProcessJPO` |

트리거는 객체를 바꾸는 MQL 명령의 트랜잭션 안에서 실행되는 것으로 보입니다. <Badge type="danger" text="검증 필요" /> 그렇다면 위 표의 세 번째 줄에 해당해 `startTransaction` 은 아무것도 하지 않습니다. 트리거 JPO 에서 트랜잭션을 따로 열 필요는 없고, 막으려면 `1` 을 돌려줍니다 ([트리거](/trigger/)).

::: info 근거
common/emxCreateProcess.jsp:190, 221 (`setSavePoint(context,"CreateObject")`), 259, 365-378. common/emxFormEditProcess.jsp:161, 268-285
:::

## 슈퍼유저로 바꾸기 (pushContext)

사용자에게 권한이 없는 작업 (시스템 속성 갱신, 다른 사람 객체 연결 ...) 을 잠깐 슈퍼유저로 실행합니다.

```java
ContextUtil.pushContext(context);
try {
    DomainObject.newInstance(context, objectId).setAttributeValue(context, attrName, value);
} finally {
    ContextUtil.popContext(context);
}
```

| 호출 | 바뀌는 사용자 |
| --- | --- |
| `ContextUtil.pushContext(context)` | User Agent (`person_UserAgent`) (432 건) |
| `ContextUtil.pushContext(context, user, password, vault)` | 지정한 사용자. `user` 가 비면 User Agent |
| `ContextUtil.pushContext(context, PropertyUtil.getSchemaProperty(context, "person_UserAgent"), "", "")` | 위와 같음. OOTB 에 흔한 형태 (95 건) |
| `ContextUtil.popContext(context)` | 바로 전 사용자로 복귀 |

- 바꾸기 전 사용자를 context 의 `"context-stack"` 에 쌓습니다. `push` 를 두 번 하면 `pop` 도 두 번 해야 합니다.
- 처음 바꿀 때 원래 사용자 이름을 RPE `MX_LOGGED_IN_USER_NAME` 에 남깁니다. 슈퍼유저로 실행 중인 트리거에서 실제 사용자를 알아야 할 때 이 값을 읽습니다 (`PropertyUtil.getGlobalRPEValue(context, "MX_LOGGED_IN_USER_NAME")`).
- 단일 MQL 명령만 슈퍼유저로 하려면 `MqlUtil.mqlCommand(context, cmd, true, ...)` 를 씁니다 ([MqlUtil](/jpo/mql-util#boolean-인자)).

::: warning popContext 는 꼭 finally 에서
`pushContext` 뒤에 예외가 나서 `popContext` 를 못 하면, 그 요청의 나머지 처리가 슈퍼유저로 실행됩니다. 이력 (history) 의 사용자도 User Agent 로 남는 것으로 보입니다. <Badge type="danger" text="검증 필요" /> OOTB 는 `pushContext` 698 건, `popContext` 725 건으로 대부분 finally 에서 짝을 맞춥니다.
:::

::: warning pushContext 중에는 context.getUser() 가 바뀝니다
`pushContext` 안에서 `context.getUser()` 는 User Agent 를 돌려줍니다. 소유자 지정, 메일 수신자처럼 실제 사용자가 필요하면 push 전에 변수에 담아 둡니다.
:::

::: info 근거
xerinfra.jar `ContextUtil.pushContext(Context)` → `pushContext(context, getSuperUserName, getSuperUserPassword, null)`, `getSuperUserName` 은 `PropertyUtil.getSchemaProperty(context, "person_UserAgent")`. `pushContext(Context, String, String, String)`: `MX_LOGGED_IN_USER_NAME` 설정, 현재 사용자를 `"context-stack"` 에 push, `Context.resetContext`. `popContext`: stack pop 후 `resetContext`, 실패하면 `emxFramework.ContextUtil.ContextNotSaved` 문구로 예외
:::

## 다른 사용자 / 다른 JPO 호출과 context

- `JPO.invoke(context, ...)` 로 다른 JPO 를 부르면 **같은 context** 를 넘깁니다. 같은 사용자, 같은 트랜잭션입니다.
- `pushContext` 안에서 다른 JPO 를 부르면 그 JPO 도 슈퍼유저로 실행됩니다.
- 백그라운드 작업처럼 사용자 없이 돌릴 때는 `ContextUtil.runInAnonymousContext` / `getAnonymousContext` 가 있습니다 (7 건). 일반 화면 JPO 에서는 쓸 일이 거의 없습니다.
