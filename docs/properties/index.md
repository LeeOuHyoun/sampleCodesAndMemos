# properties 개요 <Badge type="info" text="원본 분석" />

3DSpace 의 화면 글자(다국어)와 동작 설정은 대부분 `.properties` 파일에 있습니다. 코드는 키 이름으로 값을 읽습니다.

::: info 근거
`properties/` 폴더 4,677 개 파일 (언어 접미사와 `Native` 를 뗀 기본 이름 431 개, 그중 `StringResource` 165 개), `emxSystem.properties`, `emxFrameworkCustom.properties`, `emxFrameworkStringResource*.properties`, `3dspace/WEB-INF/web.xml`, `3dspace/common/emxReloadCache.jsp`. 코드 쪽: `jpo/` 의 `EnoviaResourceBundle.getProperty` 3,942 건, `i18nNow.getI18nString` 209 건, `FrameworkProperties.getProperty` 148 건, `MessageUtil.getMessage` 155 건
:::

## 두 종류

| 종류 | 파일 예 | 내용 | 언어별 |
| --- | --- | --- | --- |
| 문자열 리소스 | `emxFrameworkStringResource.properties`, `emxComponentsStringResource_ko.properties` | 화면 글자, 메시지, type / 속성 표시 이름 | 있음 |
| 설정 | `emxSystem.properties`, `emxComponents.properties`, `emxFrameworkCustom.properties` | 아이콘, 팝업 크기, 앱 등록, 기능 켜기 / 끄기 | 없음 |

## 파일 이름

```text
emxFrameworkStringResource.properties          기본 (영어)
emxFrameworkStringResource_ko.properties       한국어 (\uXXXX 로 적은 ASCII)
emxFrameworkStringResource_koNative.properties 한국어 원문 (CP949)
emxFrameworkStringResource_zh_CN.properties    중국어 간체
```

| 접미사 | 파일 수 |
| --- | --- |
| `_fr` / `_ja` / `_de` | 194 / 193 / 193 |
| `_zh_CN` | 191 |
| `_en` | 173 |
| `_ko` | 128 |
| `...Native` | 1,960 |

자세한 규칙은 [문자열 리소스](/properties/string-resource) 에 있습니다.

## 서버 위치

소스의 `properties/` 폴더는 서버의 아래 폴더에 해당합니다. `web.xml` 이 같은 폴더의 `framework.properties` 를 가리킵니다.

```text
<설치 폴더>/3DSpace/managed/properties/
```

## 코드에서 읽기 (요약)

| 읽는 것 | 호출 |
| --- | --- |
| 설정 값 | `EnoviaResourceBundle.getProperty(context, "emxFramework.PopupSize.Large")` |
| 문자열 (파일 지정) | `EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Common.Name")` |
| 문자열 (앱 별칭) | `EnoviaResourceBundle.getProperty(context, "Framework", "emxFramework.Type.Part", lang)` |
| JSP 태그 | `<emxUtil:i18n localize="i18nId">emxFramework.Collections.OnlyCollection</emxUtil:i18n>` |

자세한 내용은 [문자열 리소스](/properties/string-resource#코드에서-읽기), [시스템 설정](/properties/system-settings#코드에서-읽기) 을 봅니다.

## 고친 뒤 반영

| 방법 | 내용 |
| --- | --- |
| Reload Cache | `common/emxReloadCache.jsp`. admin property 캐시와 tenant properties 캐시를 비웁니다 |
| 서버 재시작 | 캐시로 안 되는 경우 |

::: warning OOTB 파일을 고치면 업그레이드 때 덮어써집니다
`emxSystem.properties`, `emxFrameworkStringResource*.properties` 는 제품 파일입니다. 설정은 [Custom 파일](/properties/system-settings#emxframeworkcustom-properties) 에, 메시지는 [내 앱의 문자열 파일](/properties/string-resource#내-문자열-파일-만들기) 에 둡니다. OOTB 파일에 꼭 넣어야 하는 키는 블록으로 묶어 표시해 둡니다.
:::

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [문자열 리소스](/properties/string-resource) | 다국어 파일 규칙, `_ko` 와 `Native`, 키 이름 규칙, 키 추가 |
| [시스템 설정](/properties/system-settings) | `emxSystem`, `emxFrameworkCustom`, 앱 등록 키, 자주 쓰는 키, page 객체 |
