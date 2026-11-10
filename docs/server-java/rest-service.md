# 커스텀 REST 서비스 <Badge type="info" text="원본 분석" />

위젯이나 외부 시스템이 부를 주소를 3DSpace 에 직접 만드는 방법입니다. OOTB 가 주는 `resources/v1/modeler/*` ([REST API](/rest-api/)) 로 부족할 때, 곧 여러 객체를 한 번에 처리하거나 업무 규칙이 들어간 처리를 한 번의 호출로 끝내고 싶을 때 씁니다.

class 는 두 가지를 만듭니다.

| class | 부모 | 역할 |
| --- | --- | --- |
| Modeler | `com.dassault_systemes.platform.restServices.ModelerBase` | 주소의 앞부분(앱 이름)을 정하고 서비스 class 목록을 등록 |
| Service | `com.dassault_systemes.platform.restServices.RestService` | 주소 하나하나를 처리하는 메서드 |

::: info 근거
프로젝트 `src/` 의 rest 패키지 (Modeler 1 개, Service 2 개) 와 그 javadoc. `ModelerBase`, `RestService` 는 jar 안의 class 라서 내부 동작은 확인하지 못했고 쓰는 쪽 코드에서 본 사용법만 적었습니다. 3dspace/WEB-INF/web.xml 에는 이 Modeler 의 등록이 없습니다
:::

## 주소 구성

```text
{3DSpace}/resources/{앱 이름}/{서비스 경로}/{메서드 경로}
{3DSpace}/resources/my-integration/user-mgmt/v1/get-all
```

| 부분 | 정하는 곳 |
| --- | --- |
| `/resources` | `ModelerBase.REST_BASE_PATH` |
| `/my-integration` | Modeler 의 `@ApplicationPath` |
| `/user-mgmt` | Service class 의 `@Path` |
| `/v1/get-all` | 메서드의 `@Path` |

메서드 경로 앞에 `/v1` 을 붙여 두면 응답 형식을 바꿔야 할 때 `/v2` 를 새로 만들고 기존 호출은 그대로 둘 수 있습니다.

## Modeler

```java
package com.example.rest;

import com.dassault_systemes.platform.restServices.ModelerBase;
import jakarta.ws.rs.ApplicationPath;

@ApplicationPath(value = ModelerBase.REST_BASE_PATH + "/my-integration")
public class MyWebserviceModeler extends ModelerBase {

    @Override
    public Class<?>[] getServices() {
        return new Class[]{
                MyUserMgmtWebService.class,
                MyExternalIntegrationService.class
        };
    }
}
```

- Service class 를 새로 만들면 `getServices()` 배열에 추가해야 주소가 열립니다.
- `web.xml` 에는 이 class 를 등록한 곳이 없습니다. `@ApplicationPath` 어노테이션을 서버가 찾아서 등록하는 것으로 보입니다. <Badge type="danger" text="검증 필요" />
- 어노테이션은 `jakarta.ws.rs.*` 입니다. 예전 자료의 `javax.ws.rs.*` 를 그대로 쓰면 이 버전에서는 컴파일되지 않거나 주소가 열리지 않습니다.

## Service

```java
package com.example.rest;

@Path("/user-mgmt")
public class MyUserMgmtWebService extends RestService {

    private static final String JPO_NAME = "MyUserMgmt";

    @Path("/v1/get-all")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsers(@Context HttpServletRequest request) {
        return invokeJpo(request, "getUsers", null);
    }

    @Path("/v1/get-one")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@Context HttpServletRequest request, @QueryParam("login") String login) {
        String json = Json.createObjectBuilder()
                .add("login", login == null ? "" : login)
                .build().toString();
        return invokeJpo(request, "getUser", json);
    }

    @Path("/v1/create")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(@Context HttpServletRequest request, String json) {
        return invokeJpo(request, "createUser", json);
    }
}
```

| 어노테이션 / 인자 | 내용 |
| --- | --- |
| `@Path` (class) | 서비스 경로 |
| `@Path` (메서드) | 메서드 경로 |
| `@GET`, `@POST`, `@PUT` | HTTP 메서드 |
| `@Consumes(MediaType.APPLICATION_JSON)` | 본문을 받는 메서드에 붙임 |
| `@Produces(MediaType.APPLICATION_JSON)` | 응답 형식 |
| `@Context HttpServletRequest request` | 요청 객체. Context 를 얻을 때 필요 |
| `@QueryParam("login") String login` | 쿼리 파라미터 |
| 어노테이션 없는 마지막 `String json` | 요청 본문 원문 |

## 로그인 사용자의 Context

`RestService` 가 주는 `getAuthenticatedContext` 로 요청을 보낸 사용자의 `Context` 를 얻습니다.

```java
matrix.db.Context context = this.getAuthenticatedContext(request, true);
```

- 브라우저의 3DSpace 로그인 세션과 요청 헤더 `SecurityContext` 를 써서 Context 를 만듭니다. 위젯에서는 [WAFData.authenticatedRequest](/uwa/request) 로 부르고 헤더에 [SecurityContext](/rest-api/security-context#헤더에-넣기) 를 넣습니다.
- 얻은 Context 의 `context.getRole()` 에 그 보안 컨텍스트가 들어 있습니다. 원본은 호출 로그에 이 값을 함께 남깁니다.
- 두 번째 인자는 원본의 모든 호출이 `true` 입니다. 뜻은 확인하지 못했습니다. <Badge type="danger" text="검증 필요" />
- `POST`, `PUT` 에 [CSRF 토큰](/uwa/request#csrf-토큰-3dspace-쓰기-요청) 이 필요한지는 확인하지 못했습니다. OOTB 서비스와 같은 틀을 쓰므로 필요한 것으로 보입니다. <Badge type="danger" text="검증 필요" />

## JPO 로 넘기기

Service 메서드에는 업무 로직을 두지 않습니다. 공통 메서드 하나가 "Context 얻기 → `JPO.invoke` → 로그 → 오류 변환" 을 하고, 주소별 메서드는 그 메서드를 부르기만 합니다.

```java
private Response invokeJpo(HttpServletRequest request, String method, String json) {
    Map<String, Object> resultMap;
    long start = System.currentTimeMillis();
    try {
        matrix.db.Context context = this.getAuthenticatedContext(request, true);
        Map<String, Object> invokeMap = new HashMap<>();
        if (json != null) {
            invokeMap.put("json", json);
        }
        resultMap = JPO.invoke(context, JPO_NAME, null, method, JPO.packArgs(invokeMap), Map.class);
        if (resultMap == null) {
            throw new IllegalStateException("JPO returned null: " + JPO_NAME + "." + method);
        }
        logger.info("[user-mgmt] {} credentials={} result={} ({}ms)", method, context.getRole(), resultMap.get("result"), System.currentTimeMillis() - start);
    } catch (Exception e) {
        logger.error("[user-mgmt] " + method + " failed", e);
        resultMap = new HashMap<>();
        resultMap.put("result", "error");
        resultMap.put("message", e.getMessage());
    }
    return Response.ok(resultMap).build();
}
```

JPO 쪽은 `programMap` 에서 `json` 을 꺼내 처리하고 `Map` 을 돌려줍니다 ([JPO.invoke 로 부르는 메서드](/jpo/#다른-jpo-에서)).

```java
public Map<String, Object> getUsers(Context context, String[] args) throws Exception {
    Map<String, Object> programMap = JPO.unpackArgs(args);
    String json = (String) programMap.get("json");
    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put("result", "success");
    resultMap.put("users", findUsers(context, json));
    return resultMap;
}
```

- 쿼리 파라미터를 받는 `GET` 도 JSON 문자열로 바꿔 넘깁니다. JPO 는 호출 방식과 상관없이 `json` 하나만 읽으면 됩니다.
- 업무 로직이 JPO 에 있으므로 고칠 때 재시작 없이 JPO 만 다시 컴파일하면 됩니다. Service class 를 고치면 재시작이 필요합니다 ([서버 반영 절차](/deploy/#한눈에-보기)).

## 응답 형식

```json
{ "result": "success", "users": [ { "id": "...", "name": "..." } ] }
```

```json
{ "result": "error", "message": "오류 내용" }
```

| 키 | 내용 |
| --- | --- |
| `result` | `"success"` 또는 `"error"` |
| `message` | 오류일 때 예외 메시지 |
| `warnings` | 처리는 됐지만 알릴 것이 있을 때 문자열 목록 |
| 그 밖의 키 | 주소마다 다른 결과 (`users`, `id` ...) |

::: warning 실패해도 HTTP 상태는 200 입니다
모든 메서드가 `Response.ok(resultMap)` 로 끝납니다. 예외가 나도 HTTP 200 에 `result: "error"` 가 담겨 옵니다. 부르는 쪽은 `onFailure` 만 믿지 말고 `onComplete` 에서 `result` 값을 확인해야 합니다. Context 를 얻지 못한 경우(로그인 만료)도 같은 형태로 오는 것으로 보입니다. <Badge type="danger" text="검증 필요" />
:::

## 외부 시스템이 부르는 주소

외부 시스템이 서버끼리 부르는 주소(웹훅)에는 브라우저 로그인 세션이 없습니다. 이 경우 `getAuthenticatedContext` 대신 [인터페이스 계정으로 Context 를 만들고](/server-java/#서버에서-context-만들기) `finally` 에서 닫습니다.

```java
@Path("/v1/item")
@POST
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public Response createItem(@Context HttpServletRequest request, String json) {
    Map<String, Object> resultMap = new HashMap<>();
    matrix.db.Context context = null;
    try {
        context = MyDomainUtil.getContext();
        JsonObject body = Json.createReader(new StringReader(json)).readObject();
        Map<String, Object> programMap = new HashMap<>();
        programMap.put("itemName", body.getString("itemName", ""));
        programMap.put("login", body.getString("login", ""));
        Map<?, ?> created = JPO.invoke(context, "MyItemMaster", null, "createFromExternal", JPO.packArgs(programMap), Map.class);
        resultMap.put("result", "success");
        resultMap.put("id", created.get("id"));
    } catch (Exception e) {
        logger.error("create item failed", e);
        resultMap.put("result", "error");
        resultMap.put("message", e.getMessage());
    } finally {
        if (context != null) {
            context.shutdown();
        }
    }
    return Response.ok(resultMap).build();
}
```

| 항목 | 내용 |
| --- | --- |
| JSON 읽기 | `jakarta.json` 의 `JsonObject`. `getString(key, "")` 처럼 기본값을 주면 키가 없어도 예외가 나지 않음. 배열은 `getJsonArray`, 숫자는 `getJsonNumber` |
| 요청 사용자 | 본문에 `login` 을 받아 JPO 로 넘김. Context 는 인터페이스 계정이므로 실제 요청자를 따로 받아야 소유자를 지정할 수 있음 |
| 요청 기록 | 받은 JSON 원문과 처리 결과를 [외부 DB 테이블](/server-java/external-db) 에 남김. 외부 시스템과 처리 여부를 맞춰 볼 때 씀 |
| Context 닫기 | `finally` 에서 `context.shutdown()` |

::: warning 이 주소는 로그인 없이 열립니다
`getAuthenticatedContext` 를 부르지 않는 메서드는 코드에서 사용자를 확인하지 않습니다. 원본에는 부른 쪽을 확인하는 코드(토큰, IP 확인)가 보이지 않습니다. 이런 주소를 만들 때는 서버 앞단(방화벽, 프록시)에서 막고 있는지, 메서드 안에서 공유 키를 확인할지를 먼저 정합니다. `resources/` 아래 주소에 서버가 기본으로 로그인을 요구하는지는 확인하지 못했습니다. <Badge type="danger" text="검증 필요" />
:::

## 위젯에서 부르기

```js
WAFData.authenticatedRequest(spaceUrl + '/resources/my-integration/user-mgmt/v1/get-all', {
  method: 'GET',
  type: 'json',
  headers: { SecurityContext: securityContext },
  onComplete: function (data) {
    if (data.result !== 'success') {
      showError(data.message);
      return;
    }
    render(data.users);
  },
  onFailure: function (error) {
    showError(error.message);
  }
});
```

- `spaceUrl` 과 `securityContext` 를 얻는 방법은 [3DSpace 주소와 SecurityContext](/widget/space-url) 에 있습니다.
- 원본 webapps 폴더에는 이 서비스를 부르는 위젯 소스가 없어서 위 호출은 OOTB 서비스를 부르는 방식([서버 호출](/uwa/request))을 그대로 적용한 것입니다. <Badge type="danger" text="검증 필요" />

## 새 주소 추가 체크리스트

| 순서 | 할 일 |
| --- | --- |
| 1 | JPO 에 `public Map<String, Object> 메서드(Context context, String[] args)` 추가, 컴파일 |
| 2 | Service class 에 `@Path`, `@GET` / `@POST` 메서드 추가 (공통 메서드 호출 한 줄) |
| 3 | 새 Service class 면 Modeler 의 `getServices()` 에 추가 |
| 4 | class 를 서버에 넣고 재시작 ([서버 반영 절차](/deploy/#커스텀-java-src)) |
| 5 | 브라우저에서 로그인한 뒤 `GET` 주소를 직접 열어 `result` 확인 |
