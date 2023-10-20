import { defineComponent, ref, reactive, computed, watch, onUpdated, openBlock, createElementBlock, normalizeClass, unref, withModifiers, withDirectives, withKeys, createVNode, withCtx, createBlock, createCommentVNode, useSSRContext, mergeProps, isRef, createTextVNode } from 'vue';
import { isNil } from 'lodash-unified';
import { u as useFormItem, a as useFormSize, b as useFormDisabled, E as ElInput, C as CHANGE_EVENT, I as INPUT_EVENT, U as UPDATE_MODEL_EVENT } from './index-fa6727cb.mjs';
import { b as buildProps, g as useLocale, e as isNumber, s as isUndefined, E as ElIcon, D as arrow_down_default, G as minus_default, H as arrow_up_default, I as plus_default, w as withInstall, a as useSizeProp, _ as _export_sfc$1 } from './index-036fcace.mjs';
import { g as useNamespace, _ as _export_sfc, t as throwError, f as debugWarn, e as useState, h as useNuxtApp } from '../server.mjs';
import { isFunction, isString } from '@vue/shared';
import { E as ElLink } from './index-1a8df0f7.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import '@vueuse/core';
import '../../nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'cookie';
import 'vue-i18n';
import 'crypto-js/sha3.js';
import 'prismjs';

const REPEAT_INTERVAL = 100;
const REPEAT_DELAY = 600;
const vRepeatClick = {
  beforeMount(el, binding) {
    const value = binding.value;
    const { interval = REPEAT_INTERVAL, delay = REPEAT_DELAY } = isFunction(value) ? {} : value;
    let intervalId;
    let delayId;
    const handler = () => isFunction(value) ? value() : value.handler();
    const clear = () => {
      if (delayId) {
        clearTimeout(delayId);
        delayId = void 0;
      }
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = void 0;
      }
    };
    el.addEventListener("mousedown", (evt) => {
      if (evt.button !== 0)
        return;
      clear();
      handler();
      document.addEventListener("mouseup", () => clear(), {
        once: true
      });
      delayId = setTimeout(() => {
        intervalId = setInterval(() => {
          handler();
        }, interval);
      }, delay);
    });
  }
};
const inputNumberProps = buildProps({
  id: {
    type: String,
    default: void 0
  },
  step: {
    type: Number,
    default: 1
  },
  stepStrictly: Boolean,
  max: {
    type: Number,
    default: Number.POSITIVE_INFINITY
  },
  min: {
    type: Number,
    default: Number.NEGATIVE_INFINITY
  },
  modelValue: Number,
  readonly: Boolean,
  disabled: Boolean,
  size: useSizeProp,
  controls: {
    type: Boolean,
    default: true
  },
  controlsPosition: {
    type: String,
    default: "",
    values: ["", "right"]
  },
  valueOnClear: {
    type: [String, Number, null],
    validator: (val) => val === null || isNumber(val) || ["min", "max"].includes(val),
    default: null
  },
  name: String,
  label: String,
  placeholder: String,
  precision: {
    type: Number,
    validator: (val) => val >= 0 && val === Number.parseInt(`${val}`, 10)
  },
  validateEvent: {
    type: Boolean,
    default: true
  }
});
const inputNumberEmits = {
  [CHANGE_EVENT]: (cur, prev) => prev !== cur,
  blur: (e) => e instanceof FocusEvent,
  focus: (e) => e instanceof FocusEvent,
  [INPUT_EVENT]: (val) => isNumber(val) || isNil(val),
  [UPDATE_MODEL_EVENT]: (val) => isNumber(val) || isNil(val)
};
const _hoisted_1 = ["aria-label", "onKeydown"];
const _hoisted_2 = ["aria-label", "onKeydown"];
const __default__ = /* @__PURE__ */ defineComponent({
  name: "ElInputNumber"
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...__default__,
  props: inputNumberProps,
  emits: inputNumberEmits,
  setup(__props, { expose, emit }) {
    const props = __props;
    const { t } = useLocale();
    const ns = useNamespace("input-number");
    const input = ref();
    const data = reactive({
      currentValue: props.modelValue,
      userInput: null
    });
    const { formItem } = useFormItem();
    const minDisabled = computed(() => isNumber(props.modelValue) && props.modelValue <= props.min);
    const maxDisabled = computed(() => isNumber(props.modelValue) && props.modelValue >= props.max);
    const numPrecision = computed(() => {
      const stepPrecision = getPrecision(props.step);
      if (!isUndefined(props.precision)) {
        if (stepPrecision > props.precision) ;
        return props.precision;
      } else {
        return Math.max(getPrecision(props.modelValue), stepPrecision);
      }
    });
    const controlsAtRight = computed(() => {
      return props.controls && props.controlsPosition === "right";
    });
    const inputNumberSize = useFormSize();
    const inputNumberDisabled = useFormDisabled();
    const displayValue = computed(() => {
      if (data.userInput !== null) {
        return data.userInput;
      }
      let currentValue = data.currentValue;
      if (isNil(currentValue))
        return "";
      if (isNumber(currentValue)) {
        if (Number.isNaN(currentValue))
          return "";
        if (!isUndefined(props.precision)) {
          currentValue = currentValue.toFixed(props.precision);
        }
      }
      return currentValue;
    });
    const toPrecision = (num, pre) => {
      if (isUndefined(pre))
        pre = numPrecision.value;
      if (pre === 0)
        return Math.round(num);
      let snum = String(num);
      const pointPos = snum.indexOf(".");
      if (pointPos === -1)
        return num;
      const nums = snum.replace(".", "").split("");
      const datum = nums[pointPos + pre];
      if (!datum)
        return num;
      const length = snum.length;
      if (snum.charAt(length - 1) === "5") {
        snum = `${snum.slice(0, Math.max(0, length - 1))}6`;
      }
      return Number.parseFloat(Number(snum).toFixed(pre));
    };
    const getPrecision = (value) => {
      if (isNil(value))
        return 0;
      const valueString = value.toString();
      const dotPosition = valueString.indexOf(".");
      let precision = 0;
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1;
      }
      return precision;
    };
    const ensurePrecision = (val, coefficient = 1) => {
      if (!isNumber(val))
        return data.currentValue;
      return toPrecision(val + props.step * coefficient);
    };
    const increase = () => {
      if (props.readonly || inputNumberDisabled.value || maxDisabled.value)
        return;
      const value = Number(displayValue.value) || 0;
      const newVal = ensurePrecision(value);
      setCurrentValue(newVal);
      emit(INPUT_EVENT, data.currentValue);
    };
    const decrease = () => {
      if (props.readonly || inputNumberDisabled.value || minDisabled.value)
        return;
      const value = Number(displayValue.value) || 0;
      const newVal = ensurePrecision(value, -1);
      setCurrentValue(newVal);
      emit(INPUT_EVENT, data.currentValue);
    };
    const verifyValue = (value, update) => {
      const { max, min, step, precision, stepStrictly, valueOnClear } = props;
      if (max < min) {
        throwError("InputNumber", "min should not be greater than max.");
      }
      let newVal = Number(value);
      if (isNil(value) || Number.isNaN(newVal)) {
        return null;
      }
      if (value === "") {
        if (valueOnClear === null) {
          return null;
        }
        newVal = isString(valueOnClear) ? { min, max }[valueOnClear] : valueOnClear;
      }
      if (stepStrictly) {
        newVal = toPrecision(Math.round(newVal / step) * step, precision);
      }
      if (!isUndefined(precision)) {
        newVal = toPrecision(newVal, precision);
      }
      if (newVal > max || newVal < min) {
        newVal = newVal > max ? max : min;
        update && emit(UPDATE_MODEL_EVENT, newVal);
      }
      return newVal;
    };
    const setCurrentValue = (value, emitChange = true) => {
      var _a;
      const oldVal = data.currentValue;
      const newVal = verifyValue(value);
      if (!emitChange) {
        emit(UPDATE_MODEL_EVENT, newVal);
        return;
      }
      if (oldVal === newVal)
        return;
      data.userInput = null;
      emit(UPDATE_MODEL_EVENT, newVal);
      emit(CHANGE_EVENT, newVal, oldVal);
      if (props.validateEvent) {
        (_a = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a.call(formItem, "change").catch((err) => debugWarn());
      }
      data.currentValue = newVal;
    };
    const handleInput = (value) => {
      data.userInput = value;
      const newVal = value === "" ? null : Number(value);
      emit(INPUT_EVENT, newVal);
      setCurrentValue(newVal, false);
    };
    const handleInputChange = (value) => {
      const newVal = value !== "" ? Number(value) : "";
      if (isNumber(newVal) && !Number.isNaN(newVal) || value === "") {
        setCurrentValue(newVal);
      }
      data.userInput = null;
    };
    const focus = () => {
      var _a, _b;
      (_b = (_a = input.value) == null ? void 0 : _a.focus) == null ? void 0 : _b.call(_a);
    };
    const blur = () => {
      var _a, _b;
      (_b = (_a = input.value) == null ? void 0 : _a.blur) == null ? void 0 : _b.call(_a);
    };
    const handleFocus = (event) => {
      emit("focus", event);
    };
    const handleBlur = (event) => {
      var _a;
      emit("blur", event);
      if (props.validateEvent) {
        (_a = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a.call(formItem, "blur").catch((err) => debugWarn());
      }
    };
    watch(() => props.modelValue, (value) => {
      const userInput = verifyValue(data.userInput);
      const newValue = verifyValue(value, true);
      if (!isNumber(userInput) && (!userInput || userInput !== newValue)) {
        data.currentValue = newValue;
        data.userInput = null;
      }
    }, { immediate: true });
    onUpdated(() => {
      var _a, _b;
      const innerInput = (_a = input.value) == null ? void 0 : _a.input;
      innerInput == null ? void 0 : innerInput.setAttribute("aria-valuenow", `${(_b = data.currentValue) != null ? _b : ""}`);
    });
    expose({
      focus,
      blur
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([
          unref(ns).b(),
          unref(ns).m(unref(inputNumberSize)),
          unref(ns).is("disabled", unref(inputNumberDisabled)),
          unref(ns).is("without-controls", !_ctx.controls),
          unref(ns).is("controls-right", unref(controlsAtRight))
        ]),
        onDragstart: _cache[1] || (_cache[1] = withModifiers(() => {
        }, ["prevent"]))
      }, [
        _ctx.controls ? withDirectives((openBlock(), createElementBlock("span", {
          key: 0,
          role: "button",
          "aria-label": unref(t)("el.inputNumber.decrease"),
          class: normalizeClass([unref(ns).e("decrease"), unref(ns).is("disabled", unref(minDisabled))]),
          onKeydown: withKeys(decrease, ["enter"])
        }, [
          createVNode(unref(ElIcon), null, {
            default: withCtx(() => [
              unref(controlsAtRight) ? (openBlock(), createBlock(unref(arrow_down_default), { key: 0 })) : (openBlock(), createBlock(unref(minus_default), { key: 1 }))
            ]),
            _: 1
          })
        ], 42, _hoisted_1)), [
          [unref(vRepeatClick), decrease]
        ]) : createCommentVNode("v-if", true),
        _ctx.controls ? withDirectives((openBlock(), createElementBlock("span", {
          key: 1,
          role: "button",
          "aria-label": unref(t)("el.inputNumber.increase"),
          class: normalizeClass([unref(ns).e("increase"), unref(ns).is("disabled", unref(maxDisabled))]),
          onKeydown: withKeys(increase, ["enter"])
        }, [
          createVNode(unref(ElIcon), null, {
            default: withCtx(() => [
              unref(controlsAtRight) ? (openBlock(), createBlock(unref(arrow_up_default), { key: 0 })) : (openBlock(), createBlock(unref(plus_default), { key: 1 }))
            ]),
            _: 1
          })
        ], 42, _hoisted_2)), [
          [unref(vRepeatClick), increase]
        ]) : createCommentVNode("v-if", true),
        createVNode(unref(ElInput), {
          id: _ctx.id,
          ref_key: "input",
          ref: input,
          type: "number",
          step: _ctx.step,
          "model-value": unref(displayValue),
          placeholder: _ctx.placeholder,
          readonly: _ctx.readonly,
          disabled: unref(inputNumberDisabled),
          size: unref(inputNumberSize),
          max: _ctx.max,
          min: _ctx.min,
          name: _ctx.name,
          label: _ctx.label,
          "validate-event": false,
          onWheel: _cache[0] || (_cache[0] = withModifiers(() => {
          }, ["prevent"])),
          onKeydown: [
            withKeys(withModifiers(increase, ["prevent"]), ["up"]),
            withKeys(withModifiers(decrease, ["prevent"]), ["down"])
          ],
          onBlur: handleBlur,
          onFocus: handleFocus,
          onInput: handleInput,
          onChange: handleInputChange
        }, null, 8, ["id", "step", "model-value", "placeholder", "readonly", "disabled", "size", "max", "min", "name", "label", "onKeydown"])
      ], 34);
    };
  }
});
var InputNumber = /* @__PURE__ */ _export_sfc$1(_sfc_main$1, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/input-number/src/input-number.vue"]]);
const ElInputNumber = withInstall(InputNumber);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "matrix-calculator",
  __ssrInlineRender: true,
  setup(__props) {
    function trimValue(value) {
      return value.replace(/\s/g, "");
    }
    const matrixSize = ref(0);
    const matrix = reactive([]);
    function range(n) {
      const result = [];
      for (let i = 0; i < n; i++)
        result.push(i);
      return result;
    }
    function back() {
      if (history.length > 1) {
        history.back();
      } else {
        useNuxtApp().$router.push("/");
      }
    }
    function initDeterminant() {
      while (matrix.length != matrixSize.value) {
        if (matrix.length > matrixSize.value) {
          matrix.pop();
          for (let i = 0; i < matrix.length; i++)
            if (matrix[i].length > matrixSize.value)
              matrix[i].pop();
        } else {
          matrix.push(Array.from({ length: matrixSize.value }).fill(0));
          for (let i = 0; i < matrix.length; i++)
            if (matrix[i].length < matrixSize.value)
              matrix[i].push(0);
        }
      }
    }
    const determinant = ref(0);
    function calcDeterminant(matrix2) {
      if (matrix2.length == 2)
        return matrix2[0][0] * matrix2[1][1] - matrix2[0][1] * matrix2[1][0];
      let sum = 0;
      for (let i = 0; i < matrix2.length; i++) {
        const coefficient = matrix2[0][i];
        if (coefficient == 0)
          continue;
        const selected_matrix = [];
        for (let row = 1; row < matrix2.length; row++) {
          const selected_row = [];
          for (let col = 0; col < matrix2.length; col++) {
            if (col != i)
              selected_row.push(matrix2[row][col]);
          }
          selected_matrix.push(selected_row);
        }
        sum += coefficient * calcDeterminant(selected_matrix) * (i % 2 == 0 ? 1 : -1);
      }
      return sum;
    }
    function determinantOnchange() {
      initDeterminant();
      determinant.value = calcDeterminant(matrix);
    }
    const appName = useState("appName");
    useTitle(`Matrix Calculator - ${appName.value}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_input_number = ElInputNumber;
      const _component_el_input = ElInput;
      const _component_el_link = ElLink;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8 flex-col gap-4 flex-center" }, _attrs))} data-v-e6faec81><h1 class="m-0" data-v-e6faec81>Determinant</h1><div class="px-4 w-full max-w-prose flex flex-col gap-4 justify-center" data-v-e6faec81>`);
      _push(ssrRenderComponent(_component_el_input_number, {
        modelValue: unref(matrixSize),
        "onUpdate:modelValue": ($event) => isRef(matrixSize) ? matrixSize.value = $event : null,
        onChange: ($event) => determinantOnchange()
      }, null, _parent));
      _push(`<div data-v-e6faec81><!--[-->`);
      ssrRenderList(range(unref(matrixSize)), (r) => {
        _push(`<div data-v-e6faec81><!--[-->`);
        ssrRenderList(range(unref(matrixSize)), (c) => {
          _push(ssrRenderComponent(_component_el_input, {
            modelValue: unref(matrix)[r][c],
            "onUpdate:modelValue": ($event) => unref(matrix)[r][c] = $event,
            style: { "max-width": "45px" },
            onKeyup: ($event) => determinantOnchange(),
            formatter: (v) => trimValue(v),
            parser: (v) => trimValue(v)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div><div data-v-e6faec81><div data-v-e6faec81>Determinant: ${ssrInterpolate(unref(determinant))}</div></div><div class="pb-16" data-v-e6faec81></div><div class="flex-center pb-16" data-v-e6faec81>`);
      _push(ssrRenderComponent(_component_el_link, {
        onClick: ($event) => back()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`BACK`);
          } else {
            return [
              createTextVNode("BACK")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/matrix-calculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const matrixCalculator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e6faec81"]]);

export { matrixCalculator as default };
//# sourceMappingURL=matrix-calculator-614eab0b.mjs.map
