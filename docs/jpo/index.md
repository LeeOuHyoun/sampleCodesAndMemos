# JPO 개요 <Badge type="info" text="원본 분석" />

JPO (Java Program Object) 는 3DSpace 서버에서 돌아가는 Java 클래스입니다. 표 (table), 폼 (webform), 명령 (command), 검색, 트리거가 화면이나 이벤트에서 JPO 메서드를 이름으로 불러 씁니다. 업무 로직 대부분이 여기에 들어갑니다.

::: info 근거
enovia2025 `jpo/` 의 `*_mxJPO.java` 1,615 개 (그중 `*Base_mxJPO.java` 570 개). `JPO.unpackArgs(` 5,783 건, `JPO.invoke(` 408 건. 예: emxPart_mxJPO, emxPartBase_mxJPO, emxCommonDocumentUIBase_mxJPO, emxECPartBase_mxJPO, emxDomainAccessBase_mxJPO. 프레임워크 쪽은 WEB-INF/lib 의 eMatrixServletRMI.jar (`matrix.db.JPO`), xerinfra.jar (`DomainObject`, `MqlUtil`, `ContextUtil`), framework.jar (`UITable`, `UIForm`)
:::

## 원본 위치

| 경로 | 내용 |
| --- | --- |
| `jpo/*_mxJPO.java` | JPO 소스. OOTB 는 `emx*`, `ENO*`, `enoX*` 등, 사용자 정의는 회사 접두어를 붙임 |
| `mql/08.table`, `mql/09.webform`, `mql/06.command` | JPO 를 부르는 쪽. `setting "program"` / `"function"`, href 의 `program=JPO:method` |
| `mql/12.trigger` | 트리거가 부르는 JPO 이름과 메서드 ([트리거](/trigger/)) |
| `3dspace/common/*.jsp` | JSP 에서 `JPO.invoke` 로 직접 부르는 곳 (402 개 파일) |
| `3dspace/WEB-INF/lib/*.jar` | `DomainObject`, `MqlUtil` 같은 API 클래스. 소스는 없고 class 파일만 있음 |

## 이름 규칙

| 구분 | 형식 | 예 |
| --- | --- | --- |
| 프로그램 이름 (DB, 설정, `JPO.invoke`) | `이름` | `emxPart` |
| Java 클래스 이름 | `이름_mxJPO` | `emxPart_mxJPO` |
| 파일 이름 | `이름_mxJPO.java` | `emxPart_mxJPO.java` |

설정과 호출에는 **`_mxJPO` 를 뺀 이름** 을 씁니다. `setting "program" "emxDomainAccess"`, `JPO.invoke(context, "emxLifecycle", ...)` 처럼 씁니다.

### `${CLASSNAME}`, `${CLASS:이름}`

DB 에 저장된 JPO 소스에는 클래스 이름 대신 매크로를 쓸 수 있습니다. 컴파일할 때 `이름_mxJPO` 로 바뀝니다.

| 매크로 | 바뀌는 값 | 쓰는 곳 |
| --- | --- | --- |
| `${CLASSNAME}` | 자기 클래스 이름 | `public class ${CLASSNAME}`, 생성자 이름 |
| `${CLASS:emxPartBase}` | `emxPartBase_mxJPO` | `extends`, `new`, static 호출 |

```java
public class ${CLASSNAME} extends ${CLASS:emxPartBase} {
    public ${CLASSNAME}(Context context, String[] args) throws Exception {
        super(context, args);
    }
}
```

이 분석 자료의 OOTB 소스는 이미 `_mxJPO` 이름으로 풀린 형태입니다. 주석에만 `${CLASSNAME}` (876 건), `${CLASS:...}` 가 남아 있습니다. 사용자 정의 JPO 는 처음부터 `_mxJPO` 이름을 직접 쓰고 있습니다. 두 방식 모두 동작합니다. IDE 에서 컴파일 오류 없이 다루려면 `_mxJPO` 이름을 직접 쓰는 편이 편합니다.

## Base / 파생 구조

OOTB JPO 는 두 개가 짝을 이룹니다. 570 개 Base 중 550 개가 같은 이름의 파생 클래스를 가집니다.

| 클래스 | 역할 |
| --- | --- |
| `emxPartBase_mxJPO` | 실제 구현. 업그레이드 때 교체됨 |
| `emxPart_mxJPO extends emxPartBase_mxJPO` | 비어 있음. 생성자만 있음. 설정은 이 이름(`emxPart`)을 가리킴 |

```java
public class emxPart_mxJPO extends emxPartBase_mxJPO {
    public emxPart_mxJPO(Context context, String[] args) throws Exception {
        super(context, args);
    }
}
```

- OOTB 동작을 바꿀 때는 파생 클래스에서 메서드를 덮어씁니다. Base 를 직접 고치면 업그레이드 때 사라지는 것으로 보입니다.
- 새로 만드는 JPO 는 Base / 파생으로 나누지 않고 한 클래스로 두는 경우가 많습니다. 공통 로직은 일반 Java 패키지(jar)로 빼고 JPO 에서 부릅니다.

::: info 근거
emxPart_mxJPO.java:18-33, emxPartBase_mxJPO.java:19-33
:::

## 기본 골격

```java
import java.util.Map;

import com.matrixone.apps.domain.util.MapList;

import matrix.db.Context;
import matrix.db.JPO;

public class XX_MyPartUI_mxJPO {

    public XX_MyPartUI_mxJPO(Context context, String[] args) throws Exception {
    }

    @com.matrixone.apps.framework.ui.ProgramCallable
    public MapList getMyPartList(Context context, String[] args) throws Exception {
        Map programMap = (Map) JPO.unpackArgs(args);
        String objectId = (String) programMap.get("objectId");
        return new MapList();
    }
}
```

| 요소 | 규칙 |
| --- | --- |
| 생성자 | `(Context context, String[] args)`. 비어 있어도 둠. `args` 는 `JPO.invoke` 의 세 번째 인자. 표 목록을 부를 때 프레임워크는 빈 배열 (`new String[0]`) 을 넘기고, 직접 부르는 코드는 `null` 을 많이 넘김 |
| 메서드 | `public 반환형 이름(Context context, String[] args) throws Exception` |
| 인자 | `args` 는 직렬화된 문자열 배열. `JPO.unpackArgs(args)` 로 Map 을 꺼냄 ([인자 구조](/jpo/args)) |
| 반환형 | 호출하는 쪽이 정함. 표 목록은 `MapList`, 열은 `Vector` / `StringList`, 접근 검사는 `Boolean` |
| static | static 메서드도 불림 (`emxDomainAccessBase.getAccesses` 등) |
| `mxMain` | 메서드 이름 없이 실행할 때 불리는 기본 메서드 (427 개 파일) |

### 반환형 분포

`(Context, String[])` 시그니처 public 메서드 기준입니다.

| 반환형 | 건수 | 주 용도 |
| --- | --- | --- |
| `void` | 1,214 | 처리만 하는 메서드 |
| `String` | 1,183 | 폼 필드 값, HTML |
| `MapList` | 1,103 | 표 / 구조 목록 |
| `int` | 1,075 | 트리거 (0 통과, 그 외 차단) |
| `boolean` / `Boolean` | 989 / 313 | 접근 검사 |
| `Vector` / `StringList` | 973 / 737 | 표 열 값, 검색 포함 / 제외 id |
| `Map` / `HashMap` | 506 / 238 | 범위 값, 생성 결과 |

### 호출 표시 어노테이션

UI 에서 불리는 메서드에는 `@com.matrixone.apps.framework.ui.ProgramCallable` 같은 표시를 붙입니다.

| 어노테이션 | 건수 | 붙이는 곳 |
| --- | --- | --- |
| `ProgramCallable` | 1,348 | 표 program, 폼 / 표 함수 대부분 |
| `PostProcessCallable` | 182 | 생성 / 편집 후처리 (`postProcessJPO`) |
| `ExcludeOIDProgramCallable` / `IncludeOIDProgramCallable` | 115 / 74 | 검색 제외 / 포함 id |
| `CreateProcessCallable` | 82 | 생성 폼 `createJPO` |
| `ConnectionProgramCallable` | 35 | 구조 편집 연결 |
| `PreProcessCallable`, `CancelProcessCallable`, `LookUpCallable` | 19, 1, 2 | 전처리, 취소, 조회 |

`FrameworkUtil.validateMethodBeforeInvoke` 가 `emxFramework.securityMode` 가 `true` 일 때만 이 표시를 검사하고, 없으면 "Invalid method Passed" 오류를 냅니다. 이 환경은 `emxSystem.properties` 에 `emxFramework.securityMode= false` 라서 표시가 없어도 불립니다.

::: tip
지금은 검사하지 않지만 보안 모드를 켜면 표시 없는 메서드는 URL 로 부를 수 없습니다. UI 에서 부르는 메서드에는 처음부터 붙여 둡니다.
:::

::: info 근거
properties/emxSystem.properties:5764, emxFrameworkStringResource.properties:27435. xerinfra.jar `FrameworkUtil.validateMethodBeforeInvoke(Context, String, String, Class)` 가 `Method.isAnnotationPresent` 로 검사. 호출부: common/emxAEFSubmitJPO.jsp:37
:::

## 호출 흐름

표 하나를 열 때를 예로 들면 아래 순서입니다.

```
URL  emxIndentedTable.jsp?program=XX_MyPartUI:getMyPartList&table=XX_MyPartTable
  │
  ├─ UITableIndented / UITable
  │    FrameworkUtil.validateMethodBeforeInvoke(...)
  │    JPO.invoke(context, "XX_MyPartUI", new String[0], "getMyPartList", JPO.packArgs(요청 Map), MapList.class)
  │      └─ new XX_MyPartUI_mxJPO(context, new String[0]).getMyPartList(context, args)
  │           └─ JPO.unpackArgs(args) → Map → MapList [{id=...}, {id=...}]
  │
  └─ 표 열마다 (setting "program" / "function" 이 있는 열)
       JPO.invoke(..., "getStatusColumn", { objectList, paramList, columnMap })
         └─ Vector ["작업중", "승인", ...]   행 순서와 같은 길이
```

- 프레임워크는 요청 값을 `HashMap` 에 담아 `JPO.packArgs` 로 문자열 배열로 바꿔 넘깁니다. 받는 쪽은 `JPO.unpackArgs` 로 되돌립니다.
- 반환 값은 `JPO.invoke` 의 마지막 인자 (반환 클래스) 로 받습니다.
- 메서드가 예외를 던지면 화면에 오류 문구로 나옵니다 ([예외](/jpo/i18n-exception#예외)).

### JPO 를 부르는 곳

| 부르는 곳 | 설정 | 인자 / 반환 |
| --- | --- | --- |
| 표 목록 | href `program=JPO:method` | [표 program](/jpo/args#표-program) |
| 구조 (Structure Browser) 펼치기 | href `program=` 또는 `expandProgram=` | [펼치기](/jpo/args#구조-펼치기-program) |
| 표 열 | `setting "program"` + `"function"` | [열 function](/jpo/args#표-열-function) |
| 폼 필드 | `setting "program"` + `"function"` | [폼 필드](/jpo/args#폼-필드-function) |
| 범위 (선택 목록) | `"Range Program"` + `"Range Function"` | [범위](/jpo/args#범위-range-function) |
| 값 저장 | `"Update Program"` + `"Update Function"` | [저장](/jpo/args#저장-update-function) |
| 보이기 / 숨기기 | `"Access Program"` + `"Access Function"` | [접근](/jpo/args#접근-access-function) |
| 생성 폼 | href `createJPO=`, `postProcessJPO=` | [생성](/jpo/args#생성-폼-createjpo-postprocessjpo) |
| 검색 | href `includeOIDprogram=`, `excludeOIDprogram=` | [검색](/jpo/args#검색-포함-제외-program) |
| 트리거 | `eService Trigger Program Parameters` 객체 | [트리거](/trigger/) |
| JSP, 다른 JPO | `JPO.invoke` | [아래](#다른-곳에서-jpo-부르기) |

설정 키 자체 (`Column Type`, `Editable` 등) 는 [UI 설정](/ui-components/settings) 에 정리되어 있습니다.

## 다른 곳에서 JPO 부르기

### JSP 에서

```jsp
<%
HashMap programMap = new HashMap();
programMap.put("objectId", objectId);
Map result = (Map) JPO.invoke(context, "XX_MyPartAction", null, "createDocumentForPart",
        JPO.packArgs(programMap), Map.class);
%>
```

### 다른 JPO 에서

| 방법 | 예 | 특징 |
| --- | --- | --- |
| `JPO.invoke` | `JPO.invoke(context, "emxLifecycle", null, "getAllTaskSignaturesOnObject", JPO.packArgs(programMap), MapList.class)` | 이름 문자열로 부름. 받는 쪽은 UI 에서 불릴 때와 같음 |
| 직접 생성 | `new IEFGetRegistrationDetails_mxJPO(context, null)` (199 건) | 컴파일 시점에 클래스가 있어야 함 |
| static 호출 | `emxContextUtil_mxJPO.mqlNotice(context, msg)` (884 건) | 가장 간단 |
| 매크로 | `${CLASS:emxContextUtil}.mqlNotice(context, msg)` | DB 소스 방식 |

`JPO.invoke` 오버로드 (eMatrixServletRMI.jar `matrix.db.JPO`):

| 시그니처 | 반환 |
| --- | --- |
| `invoke(Context, String 프로그램, String[] 생성자인자, String 메서드, String[] 인자, Class 반환형)` | `Object` (반환형으로 캐스팅) |
| `invoke(Context, String, String[], String, String[])` | `int` (`mxMain` 형태) |
| `invokeLocal(...)` | 같은 형태 |
| `packArgs(Object)` / `unpackArgs(String[])` | 직렬화 / 역직렬화 |

::: warning 받는 쪽 인자 형태를 맞춥니다
UI 용 메서드를 다른 곳에서 부를 때는 UI 가 넘기는 Map 모양 (`objectList`, `paramList`, `paramMap` ...)을 그대로 만들어야 합니다. 키 하나가 빠지면 받는 쪽에서 `NullPointerException` 이 납니다.
:::

::: info 근거
ENOProductSpecificationUIBase_mxJPO.java:187, DECModifyUpdateStamp_mxJPO.java:197, ENOCharacteristicBase_mxJPO.java:240, common/emxAEFSubmitJPO.jsp:34-39
:::

## 자주 틀리는 것

| 틀린 생각 | 실제 | 문서 |
| --- | --- | --- |
| 설정에 `XX_MyPartUI_mxJPO` 를 씀 | `_mxJPO` 를 뺀 `XX_MyPartUI` | [이름 규칙](#이름-규칙) |
| 열 function 은 행 하나씩 불림 | 한 번에 `objectList` 전체를 받고 같은 길이의 목록을 돌려줌 | [열 function](/jpo/args#표-열-function) |
| 폼 저장 값은 `programMap.get("New Value")` | `programMap` 안의 `paramMap` 에 있음 | [저장](/jpo/args#저장-update-function) |
| `mqlCommand(context, cmd, true, ...)` 의 `true` 는 결과 옵션 | 슈퍼유저로 실행 (`pushContext`) | [MqlUtil](/jpo/mql-util#boolean-인자) |
| `startTransaction` 을 부르면 항상 새 트랜잭션 | 이미 열려 있으면 참조 카운트만 올림. 가장 바깥에서만 commit | [트랜잭션](/jpo/transaction-context#트랜잭션) |
| 값이 여러 개인 select 는 항상 StringList | 하나면 String, 여럿이면 StringList 로 섞여 옴 | [DomainObject](/jpo/domain-object#여러-값-select) |
| 접근 함수가 `null` 을 돌려도 숨김 처리 | "JPO Access Program Returns NULL" 오류 | [접근](/jpo/args#접근-access-function) |

## 샘플

| 샘플 | 내용 |
| --- | --- |
| [XX_MyPartUI_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/JPOSample/XX_MyPartUI_mxJPO.java) | 표 program, 구조 펼치기, 열 function, 접근, 범위, 저장 (객체 / 관계) |
| [XX_MyPartAction_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/JPOSample/XX_MyPartAction_mxJPO.java) | 트랜잭션 안에서 생성 + 연결, `pushContext`, `MqlUtil`, 다국어 메시지 |

::: warning
샘플의 타입, 관계, 속성 (`type_MyPart`, `relationship_MyPartDocument` ...) 은 예시 이름입니다. 실제 스키마의 심볼릭 이름으로 바꿔야 합니다. 원본 소스 분석으로 작성했고 서버에서 컴파일 확인을 하지 않았습니다.
:::
