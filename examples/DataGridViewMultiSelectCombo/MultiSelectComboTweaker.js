/**
 * MultiSelectComboTweaker (lodash 버전)
 * ------------------------------------------------------------------
 * DataGridView 셀에서 사용할 "멀티 셀렉트 콤보박스" 커스텀 Tweaker.
 *
 * 참고한 원본 소스 (webapps_enovia2026.zip):
 *  - EPSSchematicsUI/tweakers/EPSSchematicsUIValueTypeComboTweaker.js  (콤보 Tweaker 구조)
 *  - EPSSchematicsUI/tweakers/EPSSchematicsUIObjectEditorTweaker.js    (edition / readOnly 뷰 모듈)
 *  - Controls/Controls.js  "DS/Controls/ComboBox"                       (multiSelFlag 속성)
 *
 * WUX ComboBox 는 multiSelFlag = true 이면
 *   - value           : elementsList 항목의 value 배열   (예: ["A", "C"])
 *   - selectedIndexes : 선택된 인덱스 배열
 * 로 동작합니다 (Controls.js _updateCurrentProperties / _applyValue 참조).
 *
 * lodash 는 "DS/sdxENOChgGovernanceUX/custom/lib/lodash-amd/lodashConfig" 가
 * lodash 객체(_)를 반환한다는 전제로 사용합니다.
 *
 * ※ 모듈 이름 "DS/MyApp/..." 은 실제 위젯 모듈 경로에 맞게 바꾸세요.
 */
define("DS/MyApp/MultiSelectComboTweaker", [
  "DS/sdxENOChgGovernanceUX/custom/lib/lodash-amd/lodashConfig",
  "DS/Tweakers/TweakerBase",
  "DS/Controls/ComboBox",
  "DS/Utilities/Utils",
  "DS/Utilities/Dom",
  "DS/Core/WebUXComponents",
], function (_, WUXTweakerBase, WUXComboBox, WUXUtils, WUXDomUtils, WebUXComponents) {
  "use strict";

  const BaseViewModule = WUXTweakerBase.prototype.baseViewModule;
  const LABEL_CLASS = "wux-tweakers-string-label";

  // ----------------------------------------------------------------
  // 공통 유틸 (lodash)
  // ----------------------------------------------------------------

  /** 셀 값 정규화: undefined/null → [], 단일 값 → [값], 배열 → 얕은 복사본 */
  function normalizeValues(values) {
    return _.isNil(values) ? [] : _.clone(_.castArray(values));
  }

  /** value 배열 → "라벨1, 라벨2" (possibleValues 에 없으면 값 자체를 표시) */
  function toLabel(values, possibleValues) {
    const labelByValue = _.mapValues(_.keyBy(possibleValues, "value"), "label");
    return _.map(normalizeValues(values), (v) =>
      _.get(labelByValue, [v], _.toString(v)),
    ).join(", ");
  }

  /** 읽기 전용 컨테이너에 텍스트 반영 */
  function renderLabel(tweaker, values) {
    const container = _.get(tweaker, "elements.container");
    if (container) container.textContent = toLabel(values, tweaker.possibleValues);
    return container;
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
    if (!_.get(this._tweaker, "elements.container")) return;
    this._view = new WUXComboBox(
      _.assign(_.pick(this._tweaker, ["placeholder", "enableSearchFlag"]), {
        elementsList: this._tweaker.possibleValues, // [{label, value}]
        multiSelFlag: true,                         // ★ 멀티 셀렉트
        value: normalizeValues(this._tweaker.value),
      }),
    );
  };

  EditionViewModule.prototype.setValue = function (newValue) {
    if (!this._view) return;
    const next = normalizeValues(newValue);
    // 같은 값이면 다시 세팅하지 않음 (불필요한 change/redraw 방지)
    if (!_.isEqual(normalizeValues(this._view.value), next)) this._view.value = next;
  };

  EditionViewModule.prototype.handleEvents = function () {
    WUXDomUtils.addEventOnElement(this._tweaker, this._view, "change", (event) => {
      event.stopPropagation();
      // 선택 결과(배열)를 Tweaker -> DataGridView 셀 값으로 반영
      this.setTweakerValue(normalizeValues(this._view.value));
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
    const container = renderLabel(this._tweaker, this._tweaker.value);
    if (container) container.classList.add(LABEL_CLASS);
  };

  ReadOnlyViewModule.prototype.setValue = function (newValue) {
    renderLabel(this._tweaker, newValue);
  };

  ReadOnlyViewModule.prototype.destroy = function () {
    const container = _.get(this._tweaker, "elements.container");
    if (container) {
      container.textContent = "";
      container.classList.remove(LABEL_CLASS);
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
