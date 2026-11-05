/**
 * MultiSelectComboTweaker
 * ------------------------------------------------------------------
 * DataGridView 셀에서 사용할 "멀티 셀렉트 콤보박스" 커스텀 Tweaker.
 *
 * 참고한 원본 소스 (webapps_enovia2026.zip):
 *  - EPSSchematicsUI/tweakers/EPSSchematicsUIValueTypeComboTweaker.js  (콤보 Tweaker 구조)
 *  - EPSSchematicsUI/tweakers/EPSSchematicsUIObjectEditorTweaker.js    (edition / readOnly 뷰 모듈)
 *  - Controls/Controls.js  "DS/Controls/ComboBox"                       (multiSelFlag 속성)
 *
 * WUX ComboBox 는 multiSelFlag = true 이면
 *   - value        : elementsList 항목의 value 배열   (예: ["A", "C"])
 *   - selectedIndexes : 선택된 인덱스 배열
 * 로 동작합니다 (Controls.js _updateCurrentProperties / _applyValue 참조).
 *
 * ※ 모듈 이름 "DS/MyApp/..." 은 실제 위젯 모듈 경로에 맞게 바꾸세요.
 */
define("DS/MyApp/MultiSelectComboTweaker", [
  "DS/Tweakers/TweakerBase",
  "DS/Controls/ComboBox",
  "DS/Utilities/Utils",
  "DS/Utilities/Dom",
  "DS/Core/WebUXComponents",
], function (WUXTweakerBase, WUXComboBox, WUXUtils, WUXDomUtils, WebUXComponents) {
  "use strict";

  const BaseViewModule = WUXTweakerBase.prototype.baseViewModule;

  // ----------------------------------------------------------------
  // 공통: value 배열 -> 화면 표시용 라벨 문자열
  // ----------------------------------------------------------------
  function toLabel(values, possibleValues) {
    if (!Array.isArray(values) || values.length === 0) return "";
    return values
      .map(function (v) {
        const item = (possibleValues || []).find(function (p) {
          return p.value === v;
        });
        return item ? item.label : String(v);
      })
      .join(", ");
  }

  // ----------------------------------------------------------------
  // Tweaker 클래스
  //   semantics 에 넣은 키들이 아래 publishedProperties 로 전달됩니다.
  // ----------------------------------------------------------------
  class MultiSelectComboTweaker extends WUXTweakerBase {
    static get publishedProperties() {
      return {
        value: { defaultValue: [], type: "array", category: "Behavior" },
        // [{ label: "표시명", value: "실제값" }, ...]
        possibleValues: { defaultValue: [], type: "array", category: "Behavior" },
        placeholder: { defaultValue: "", type: "string", category: "Behavior" },
        enableSearchFlag: { defaultValue: true, type: "boolean", category: "Behavior" },
      };
    }
  }

  // ----------------------------------------------------------------
  // 편집(edition) 뷰 모듈 : WUX ComboBox (multiSelFlag = true)
  //   this._view 에 컨트롤을 넣으면 BaseViewModule 이 컨테이너에 붙여 줍니다.
  // ----------------------------------------------------------------
  const EditionViewModule = function (tweaker, options) {
    BaseViewModule.call(this, tweaker, options);
  };
  WUXUtils.applyMixin(EditionViewModule, BaseViewModule);

  EditionViewModule.prototype.buildView = function () {
    if (!this._tweaker.elements.container) return;
    this._view = new WUXComboBox({
      elementsList: this._tweaker.possibleValues, // [{label, value}]
      multiSelFlag: true,                         // ★ 멀티 셀렉트
      enableSearchFlag: this._tweaker.enableSearchFlag,
      placeholder: this._tweaker.placeholder,
      value: (this._tweaker.value || []).slice(0),
    });
  };

  EditionViewModule.prototype.setValue = function (newValue) {
    if (this._view) this._view.value = (newValue || []).slice(0);
  };

  EditionViewModule.prototype.handleEvents = function () {
    WUXDomUtils.addEventOnElement(this._tweaker, this._view, "change", (event) => {
      event.stopPropagation();
      // 선택 결과(배열)를 Tweaker -> DataGridView 셀 값으로 반영
      this.setTweakerValue((this._view.value || []).slice(0));
    });
  };

  // ----------------------------------------------------------------
  // 읽기 전용(readOnly) 뷰 모듈 : "라벨1, 라벨2" 텍스트 표시
  // ----------------------------------------------------------------
  const ReadOnlyViewModule = function (tweaker, options) {
    BaseViewModule.call(this, tweaker, options);
  };
  WUXUtils.applyMixin(ReadOnlyViewModule, BaseViewModule);

  ReadOnlyViewModule.prototype.buildView = function () {
    const c = this._tweaker.elements.container;
    if (!c) return;
    c.classList.add("wux-tweakers-string-label");
    c.textContent = toLabel(this._tweaker.value, this._tweaker.possibleValues);
  };

  ReadOnlyViewModule.prototype.setValue = function (newValue) {
    const c = this._tweaker.elements.container;
    if (c) c.textContent = toLabel(newValue, this._tweaker.possibleValues);
  };

  ReadOnlyViewModule.prototype.destroy = function () {
    const c = this._tweaker.elements.container;
    if (c) {
      c.textContent = "";
      c.classList.remove("wux-tweakers-string-label");
    }
    BaseViewModule.prototype.destroy.call(this);
  };

  // ----------------------------------------------------------------
  MultiSelectComboTweaker.prototype.baseViewModule = EditionViewModule;
  MultiSelectComboTweaker.prototype.VIEW_MODULES = {
    edition: {
      classObject: EditionViewModule,
      options: { viewOptions: { displayStyle: "edition" } },
    },
    readOnly: { classObject: ReadOnlyViewModule },
  };

  WebUXComponents.addClass(MultiSelectComboTweaker, "MultiSelectComboTweaker");
  return MultiSelectComboTweaker;
});
