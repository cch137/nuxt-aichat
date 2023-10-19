import { _ as __nuxt_component_0$1 } from './client-only-29ef7f45.mjs';
import { ref, watch, computed, reactive, isVNode, render, createVNode, defineComponent, nextTick, toRefs, resolveComponent, openBlock, createBlock, Transition, withCtx, withDirectives, createElementVNode, normalizeClass, normalizeStyle, withModifiers, createElementBlock, resolveDynamicComponent, createCommentVNode, toDisplayString, withKeys, renderSlot, createTextVNode, vShow, isRef, onScopeDispose, h, useSSRContext } from 'vue';
import { d as useState, o as useUniCookie, g as useNuxtApp, b as useLocale, n as navigateTo, l as baseConverter, p as useScrollToBottom, m as str, r as random, s as safeStringify, k as toSeed, j as useId, t as throwError, f as useNamespace } from '../server.mjs';
import sha3 from 'crypto-js/sha3.js';
import md5 from 'crypto-js/md5.js';
import { u as useAuth } from './useAuth-80d15c3b.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import qs from 'qs';
import { E as ElMessage } from './index-aede38cc.mjs';
import { E as ElButton } from './index-629aedcf.mjs';
import { E as ElInput } from './index-c191d638.mjs';
import { b as buildProps, d as definePropType, s as isUndefined, _ as _export_sfc, o as isElement, E as ElIcon, n as TypeComponents, T as TypeComponentsMap, t as hasClass, p as getStyle, q as addClass, r as removeClass } from './index-d0f66181.mjs';
import { isString, isObject, hasOwn, isFunction, NOOP } from '@vue/shared';
import { E as EVENT_CODE } from './aria-30c2b077.mjs';
import { E as ElFocusTrap, i as isValidComponentSize, g as getScrollBarWidth } from './focus-trap-2f408061.mjs';
import { a as useGlobalComponentSettings } from './use-global-config-9dc0ce1e.mjs';
import { computed as computed$1 } from '@vue/reactivity';
import { isClient } from '@vueuse/core';
import { E as ElLoading } from './index-5f687ead.mjs';
import { ssrRenderComponent } from 'vue/server-renderer';
import { marked } from 'marked';

const FOCUSABLE_ELEMENT_SELECTORS = `a[href],button:not([disabled]),button:not([hidden]),:not([tabindex="-1"]),input:not([disabled]),input:not([type="hidden"]),select:not([disabled]),textarea:not([disabled])`;
const isVisible = (element) => {
  const computed2 = getComputedStyle(element);
  return computed2.position === "fixed" ? false : element.offsetParent !== null;
};
const obtainAllFocusableElements = (element) => {
  return Array.from(element.querySelectorAll(FOCUSABLE_ELEMENT_SELECTORS)).filter((item) => isFocusable(item) && isVisible(item));
};
const isFocusable = (element) => {
  if (element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute("tabIndex") !== null) {
    return true;
  }
  if (element.disabled) {
    return false;
  }
  switch (element.nodeName) {
    case "A": {
      return !!element.href && element.rel !== "ignore";
    }
    case "INPUT": {
      return !(element.type === "hidden" || element.type === "file");
    }
    case "BUTTON":
    case "SELECT":
    case "TEXTAREA": {
      return true;
    }
    default: {
      return false;
    }
  }
};
var PatchFlags = /* @__PURE__ */ ((PatchFlags2) => {
  PatchFlags2[PatchFlags2["TEXT"] = 1] = "TEXT";
  PatchFlags2[PatchFlags2["CLASS"] = 2] = "CLASS";
  PatchFlags2[PatchFlags2["STYLE"] = 4] = "STYLE";
  PatchFlags2[PatchFlags2["PROPS"] = 8] = "PROPS";
  PatchFlags2[PatchFlags2["FULL_PROPS"] = 16] = "FULL_PROPS";
  PatchFlags2[PatchFlags2["HYDRATE_EVENTS"] = 32] = "HYDRATE_EVENTS";
  PatchFlags2[PatchFlags2["STABLE_FRAGMENT"] = 64] = "STABLE_FRAGMENT";
  PatchFlags2[PatchFlags2["KEYED_FRAGMENT"] = 128] = "KEYED_FRAGMENT";
  PatchFlags2[PatchFlags2["UNKEYED_FRAGMENT"] = 256] = "UNKEYED_FRAGMENT";
  PatchFlags2[PatchFlags2["NEED_PATCH"] = 512] = "NEED_PATCH";
  PatchFlags2[PatchFlags2["DYNAMIC_SLOTS"] = 1024] = "DYNAMIC_SLOTS";
  PatchFlags2[PatchFlags2["HOISTED"] = -1] = "HOISTED";
  PatchFlags2[PatchFlags2["BAIL"] = -2] = "BAIL";
  return PatchFlags2;
})(PatchFlags || {});
const useLockscreen = (trigger, options = {}) => {
  if (!isRef(trigger)) {
    throwError("[useLockscreen]", "You need to pass a ref param to this function");
  }
  const ns = options.ns || useNamespace("popup");
  const hiddenCls = computed$1(() => ns.bm("parent", "hidden"));
  if (!isClient || hasClass(document.body, hiddenCls.value)) {
    return;
  }
  let scrollBarWidth = 0;
  let withoutHiddenClass = false;
  let bodyWidth = "0";
  const cleanup = () => {
    setTimeout(() => {
      removeClass(document == null ? void 0 : document.body, hiddenCls.value);
      if (withoutHiddenClass && document) {
        document.body.style.width = bodyWidth;
      }
    }, 200);
  };
  watch(trigger, (val) => {
    if (!val) {
      cleanup();
      return;
    }
    withoutHiddenClass = !hasClass(document.body, hiddenCls.value);
    if (withoutHiddenClass) {
      bodyWidth = document.body.style.width;
    }
    scrollBarWidth = getScrollBarWidth(ns.namespace.value);
    const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
    const bodyOverflowY = getStyle(document.body, "overflowY");
    if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === "scroll") && withoutHiddenClass) {
      document.body.style.width = `calc(100% - ${scrollBarWidth}px)`;
    }
    addClass(document.body, hiddenCls.value);
  });
  onScopeDispose(() => cleanup());
};
const useSameTarget = (handleClick) => {
  if (!handleClick) {
    return { onClick: NOOP, onMousedown: NOOP, onMouseup: NOOP };
  }
  let mousedownTarget = false;
  let mouseupTarget = false;
  const onClick = (e2) => {
    if (mousedownTarget && mouseupTarget) {
      handleClick(e2);
    }
    mousedownTarget = mouseupTarget = false;
  };
  const onMousedown = (e2) => {
    mousedownTarget = e2.target === e2.currentTarget;
  };
  const onMouseup = (e2) => {
    mouseupTarget = e2.target === e2.currentTarget;
  };
  return { onClick, onMousedown, onMouseup };
};
const FOCUSABLE_CHILDREN = "_trap-focus-children";
const FOCUS_STACK = [];
const FOCUS_HANDLER = (e2) => {
  if (FOCUS_STACK.length === 0)
    return;
  const focusableElement = FOCUS_STACK[FOCUS_STACK.length - 1][FOCUSABLE_CHILDREN];
  if (focusableElement.length > 0 && e2.code === EVENT_CODE.tab) {
    if (focusableElement.length === 1) {
      e2.preventDefault();
      if (document.activeElement !== focusableElement[0]) {
        focusableElement[0].focus();
      }
      return;
    }
    const goingBackward = e2.shiftKey;
    const isFirst = e2.target === focusableElement[0];
    const isLast = e2.target === focusableElement[focusableElement.length - 1];
    if (isFirst && goingBackward) {
      e2.preventDefault();
      focusableElement[focusableElement.length - 1].focus();
    }
    if (isLast && !goingBackward) {
      e2.preventDefault();
      focusableElement[0].focus();
    }
  }
};
const TrapFocus = {
  beforeMount(el) {
    el[FOCUSABLE_CHILDREN] = obtainAllFocusableElements(el);
    FOCUS_STACK.push(el);
    if (FOCUS_STACK.length <= 1) {
      document.addEventListener("keydown", FOCUS_HANDLER);
    }
  },
  updated(el) {
    nextTick(() => {
      el[FOCUSABLE_CHILDREN] = obtainAllFocusableElements(el);
    });
  },
  unmounted() {
    FOCUS_STACK.shift();
    if (FOCUS_STACK.length === 0) {
      document.removeEventListener("keydown", FOCUS_HANDLER);
    }
  }
};
const overlayProps = buildProps({
  mask: {
    type: Boolean,
    default: true
  },
  customMaskEvent: {
    type: Boolean,
    default: false
  },
  overlayClass: {
    type: definePropType([
      String,
      Array,
      Object
    ])
  },
  zIndex: {
    type: definePropType([String, Number])
  }
});
const overlayEmits = {
  click: (evt) => evt instanceof MouseEvent
};
const BLOCK = "overlay";
var Overlay = /* @__PURE__ */ defineComponent({
  name: "ElOverlay",
  props: overlayProps,
  emits: overlayEmits,
  setup(props, { slots, emit }) {
    const ns = useNamespace(BLOCK);
    const onMaskClick = (e2) => {
      emit("click", e2);
    };
    const { onClick, onMousedown, onMouseup } = useSameTarget(props.customMaskEvent ? void 0 : onMaskClick);
    return () => {
      return props.mask ? createVNode("div", {
        class: [ns.b(), props.overlayClass],
        style: {
          zIndex: props.zIndex
        },
        onClick,
        onMousedown,
        onMouseup
      }, [renderSlot(slots, "default")], PatchFlags.STYLE | PatchFlags.CLASS | PatchFlags.PROPS, ["onClick", "onMouseup", "onMousedown"]) : h("div", {
        class: props.overlayClass,
        style: {
          zIndex: props.zIndex,
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }, [renderSlot(slots, "default")]);
    };
  }
});
const ElOverlay = Overlay;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  name: "ElMessageBox",
  directives: {
    TrapFocus
  },
  components: {
    ElButton,
    ElFocusTrap,
    ElInput,
    ElOverlay,
    ElIcon,
    ...TypeComponents
  },
  inheritAttrs: false,
  props: {
    buttonSize: {
      type: String,
      validator: isValidComponentSize
    },
    modal: {
      type: Boolean,
      default: true
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    closeOnHashChange: {
      type: Boolean,
      default: true
    },
    center: Boolean,
    draggable: Boolean,
    roundButton: {
      default: false,
      type: Boolean
    },
    container: {
      type: String,
      default: "body"
    },
    boxType: {
      type: String,
      default: ""
    }
  },
  emits: ["vanish", "action"],
  setup(props, { emit }) {
    const {
      locale,
      zIndex,
      ns,
      size: btnSize
    } = useGlobalComponentSettings("message-box", computed(() => props.buttonSize));
    const { t } = locale;
    const { nextZIndex } = zIndex;
    const visible = ref(false);
    const state = reactive({
      autofocus: true,
      beforeClose: null,
      callback: null,
      cancelButtonText: "",
      cancelButtonClass: "",
      confirmButtonText: "",
      confirmButtonClass: "",
      customClass: "",
      customStyle: {},
      dangerouslyUseHTMLString: false,
      distinguishCancelAndClose: false,
      icon: "",
      inputPattern: null,
      inputPlaceholder: "",
      inputType: "text",
      inputValue: null,
      inputValidator: null,
      inputErrorMessage: "",
      message: null,
      modalFade: true,
      modalClass: "",
      showCancelButton: false,
      showConfirmButton: true,
      type: "",
      title: void 0,
      showInput: false,
      action: "",
      confirmButtonLoading: false,
      cancelButtonLoading: false,
      confirmButtonDisabled: false,
      editorErrorMessage: "",
      validateError: false,
      zIndex: nextZIndex()
    });
    const typeClass = computed(() => {
      const type = state.type;
      return { [ns.bm("icon", type)]: type && TypeComponentsMap[type] };
    });
    const contentId = useId();
    const inputId = useId();
    const iconComponent = computed(() => state.icon || TypeComponentsMap[state.type] || "");
    const hasMessage = computed(() => !!state.message);
    const rootRef = ref();
    const headerRef = ref();
    const focusStartRef = ref();
    const inputRef = ref();
    const confirmRef = ref();
    const confirmButtonClasses = computed(() => state.confirmButtonClass);
    watch(() => state.inputValue, async (val) => {
      await nextTick();
      if (props.boxType === "prompt" && val !== null) {
        validate();
      }
    }, { immediate: true });
    watch(() => visible.value, (val) => {
      var _a, _b;
      if (val) {
        if (props.boxType !== "prompt") {
          if (state.autofocus) {
            focusStartRef.value = (_b = (_a = confirmRef.value) == null ? void 0 : _a.$el) != null ? _b : rootRef.value;
          } else {
            focusStartRef.value = rootRef.value;
          }
        }
        state.zIndex = nextZIndex();
      }
      if (props.boxType !== "prompt")
        return;
      if (val) {
        nextTick().then(() => {
          var _a2;
          if (inputRef.value && inputRef.value.$el) {
            if (state.autofocus) {
              focusStartRef.value = (_a2 = getInputElement()) != null ? _a2 : rootRef.value;
            } else {
              focusStartRef.value = rootRef.value;
            }
          }
        });
      } else {
        state.editorErrorMessage = "";
        state.validateError = false;
      }
    });
    computed(() => props.draggable);
    function doClose() {
      if (!visible.value)
        return;
      visible.value = false;
      nextTick(() => {
        if (state.action)
          emit("action", state.action);
      });
    }
    const handleWrapperClick = () => {
      if (props.closeOnClickModal) {
        handleAction(state.distinguishCancelAndClose ? "close" : "cancel");
      }
    };
    const overlayEvent = useSameTarget(handleWrapperClick);
    const handleInputEnter = (e2) => {
      if (state.inputType !== "textarea") {
        e2.preventDefault();
        return handleAction("confirm");
      }
    };
    const handleAction = (action) => {
      var _a;
      if (props.boxType === "prompt" && action === "confirm" && !validate()) {
        return;
      }
      state.action = action;
      if (state.beforeClose) {
        (_a = state.beforeClose) == null ? void 0 : _a.call(state, action, state, doClose);
      } else {
        doClose();
      }
    };
    const validate = () => {
      if (props.boxType === "prompt") {
        const inputPattern = state.inputPattern;
        if (inputPattern && !inputPattern.test(state.inputValue || "")) {
          state.editorErrorMessage = state.inputErrorMessage || t("el.messagebox.error");
          state.validateError = true;
          return false;
        }
        const inputValidator = state.inputValidator;
        if (typeof inputValidator === "function") {
          const validateResult = inputValidator(state.inputValue);
          if (validateResult === false) {
            state.editorErrorMessage = state.inputErrorMessage || t("el.messagebox.error");
            state.validateError = true;
            return false;
          }
          if (typeof validateResult === "string") {
            state.editorErrorMessage = validateResult;
            state.validateError = true;
            return false;
          }
        }
      }
      state.editorErrorMessage = "";
      state.validateError = false;
      return true;
    };
    const getInputElement = () => {
      const inputRefs = inputRef.value.$refs;
      return inputRefs.input || inputRefs.textarea;
    };
    const handleClose = () => {
      handleAction("close");
    };
    const onCloseRequested = () => {
      if (props.closeOnPressEscape) {
        handleClose();
      }
    };
    if (props.lockScroll) {
      useLockscreen(visible);
    }
    return {
      ...toRefs(state),
      ns,
      overlayEvent,
      visible,
      hasMessage,
      typeClass,
      contentId,
      inputId,
      btnSize,
      iconComponent,
      confirmButtonClasses,
      rootRef,
      focusStartRef,
      headerRef,
      inputRef,
      confirmRef,
      doClose,
      handleClose,
      onCloseRequested,
      handleWrapperClick,
      handleInputEnter,
      handleAction,
      t
    };
  }
});
const _hoisted_1 = ["aria-label", "aria-describedby"];
const _hoisted_2 = ["aria-label"];
const _hoisted_3 = ["id"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_el_icon = resolveComponent("el-icon");
  const _component_close = resolveComponent("close");
  const _component_el_input = resolveComponent("el-input");
  const _component_el_button = resolveComponent("el-button");
  const _component_el_focus_trap = resolveComponent("el-focus-trap");
  const _component_el_overlay = resolveComponent("el-overlay");
  return openBlock(), createBlock(Transition, {
    name: "fade-in-linear",
    onAfterLeave: _cache[11] || (_cache[11] = ($event) => _ctx.$emit("vanish")),
    persisted: ""
  }, {
    default: withCtx(() => [
      withDirectives(createVNode(_component_el_overlay, {
        "z-index": _ctx.zIndex,
        "overlay-class": [_ctx.ns.is("message-box"), _ctx.modalClass],
        mask: _ctx.modal
      }, {
        default: withCtx(() => [
          createElementVNode("div", {
            role: "dialog",
            "aria-label": _ctx.title,
            "aria-modal": "true",
            "aria-describedby": !_ctx.showInput ? _ctx.contentId : void 0,
            class: normalizeClass(`${_ctx.ns.namespace.value}-overlay-message-box`),
            onClick: _cache[8] || (_cache[8] = (...args) => _ctx.overlayEvent.onClick && _ctx.overlayEvent.onClick(...args)),
            onMousedown: _cache[9] || (_cache[9] = (...args) => _ctx.overlayEvent.onMousedown && _ctx.overlayEvent.onMousedown(...args)),
            onMouseup: _cache[10] || (_cache[10] = (...args) => _ctx.overlayEvent.onMouseup && _ctx.overlayEvent.onMouseup(...args))
          }, [
            createVNode(_component_el_focus_trap, {
              loop: "",
              trapped: _ctx.visible,
              "focus-trap-el": _ctx.rootRef,
              "focus-start-el": _ctx.focusStartRef,
              onReleaseRequested: _ctx.onCloseRequested
            }, {
              default: withCtx(() => [
                createElementVNode("div", {
                  ref: "rootRef",
                  class: normalizeClass([
                    _ctx.ns.b(),
                    _ctx.customClass,
                    _ctx.ns.is("draggable", _ctx.draggable),
                    { [_ctx.ns.m("center")]: _ctx.center }
                  ]),
                  style: normalizeStyle(_ctx.customStyle),
                  tabindex: "-1",
                  onClick: _cache[7] || (_cache[7] = withModifiers(() => {
                  }, ["stop"]))
                }, [
                  _ctx.title !== null && _ctx.title !== void 0 ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    ref: "headerRef",
                    class: normalizeClass(_ctx.ns.e("header"))
                  }, [
                    createElementVNode("div", {
                      class: normalizeClass(_ctx.ns.e("title"))
                    }, [
                      _ctx.iconComponent && _ctx.center ? (openBlock(), createBlock(_component_el_icon, {
                        key: 0,
                        class: normalizeClass([_ctx.ns.e("status"), _ctx.typeClass])
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(resolveDynamicComponent(_ctx.iconComponent)))
                        ]),
                        _: 1
                      }, 8, ["class"])) : createCommentVNode("v-if", true),
                      createElementVNode("span", null, toDisplayString(_ctx.title), 1)
                    ], 2),
                    _ctx.showClose ? (openBlock(), createElementBlock("button", {
                      key: 0,
                      type: "button",
                      class: normalizeClass(_ctx.ns.e("headerbtn")),
                      "aria-label": _ctx.t("el.messagebox.close"),
                      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.handleAction(_ctx.distinguishCancelAndClose ? "close" : "cancel")),
                      onKeydown: _cache[1] || (_cache[1] = withKeys(withModifiers(($event) => _ctx.handleAction(_ctx.distinguishCancelAndClose ? "close" : "cancel"), ["prevent"]), ["enter"]))
                    }, [
                      createVNode(_component_el_icon, {
                        class: normalizeClass(_ctx.ns.e("close"))
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_close)
                        ]),
                        _: 1
                      }, 8, ["class"])
                    ], 42, _hoisted_2)) : createCommentVNode("v-if", true)
                  ], 2)) : createCommentVNode("v-if", true),
                  createElementVNode("div", {
                    id: _ctx.contentId,
                    class: normalizeClass(_ctx.ns.e("content"))
                  }, [
                    createElementVNode("div", {
                      class: normalizeClass(_ctx.ns.e("container"))
                    }, [
                      _ctx.iconComponent && !_ctx.center && _ctx.hasMessage ? (openBlock(), createBlock(_component_el_icon, {
                        key: 0,
                        class: normalizeClass([_ctx.ns.e("status"), _ctx.typeClass])
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(resolveDynamicComponent(_ctx.iconComponent)))
                        ]),
                        _: 1
                      }, 8, ["class"])) : createCommentVNode("v-if", true),
                      _ctx.hasMessage ? (openBlock(), createElementBlock("div", {
                        key: 1,
                        class: normalizeClass(_ctx.ns.e("message"))
                      }, [
                        renderSlot(_ctx.$slots, "default", {}, () => [
                          !_ctx.dangerouslyUseHTMLString ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.showInput ? "label" : "p"), {
                            key: 0,
                            for: _ctx.showInput ? _ctx.inputId : void 0
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(!_ctx.dangerouslyUseHTMLString ? _ctx.message : ""), 1)
                            ]),
                            _: 1
                          }, 8, ["for"])) : (openBlock(), createBlock(resolveDynamicComponent(_ctx.showInput ? "label" : "p"), {
                            key: 1,
                            for: _ctx.showInput ? _ctx.inputId : void 0,
                            innerHTML: _ctx.message
                          }, null, 8, ["for", "innerHTML"]))
                        ])
                      ], 2)) : createCommentVNode("v-if", true)
                    ], 2),
                    withDirectives(createElementVNode("div", {
                      class: normalizeClass(_ctx.ns.e("input"))
                    }, [
                      createVNode(_component_el_input, {
                        id: _ctx.inputId,
                        ref: "inputRef",
                        modelValue: _ctx.inputValue,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.inputValue = $event),
                        type: _ctx.inputType,
                        placeholder: _ctx.inputPlaceholder,
                        "aria-invalid": _ctx.validateError,
                        class: normalizeClass({ invalid: _ctx.validateError }),
                        onKeydown: withKeys(_ctx.handleInputEnter, ["enter"])
                      }, null, 8, ["id", "modelValue", "type", "placeholder", "aria-invalid", "class", "onKeydown"]),
                      createElementVNode("div", {
                        class: normalizeClass(_ctx.ns.e("errormsg")),
                        style: normalizeStyle({
                          visibility: !!_ctx.editorErrorMessage ? "visible" : "hidden"
                        })
                      }, toDisplayString(_ctx.editorErrorMessage), 7)
                    ], 2), [
                      [vShow, _ctx.showInput]
                    ])
                  ], 10, _hoisted_3),
                  createElementVNode("div", {
                    class: normalizeClass(_ctx.ns.e("btns"))
                  }, [
                    _ctx.showCancelButton ? (openBlock(), createBlock(_component_el_button, {
                      key: 0,
                      loading: _ctx.cancelButtonLoading,
                      class: normalizeClass([_ctx.cancelButtonClass]),
                      round: _ctx.roundButton,
                      size: _ctx.btnSize,
                      onClick: _cache[3] || (_cache[3] = ($event) => _ctx.handleAction("cancel")),
                      onKeydown: _cache[4] || (_cache[4] = withKeys(withModifiers(($event) => _ctx.handleAction("cancel"), ["prevent"]), ["enter"]))
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.cancelButtonText || _ctx.t("el.messagebox.cancel")), 1)
                      ]),
                      _: 1
                    }, 8, ["loading", "class", "round", "size"])) : createCommentVNode("v-if", true),
                    withDirectives(createVNode(_component_el_button, {
                      ref: "confirmRef",
                      type: "primary",
                      loading: _ctx.confirmButtonLoading,
                      class: normalizeClass([_ctx.confirmButtonClasses]),
                      round: _ctx.roundButton,
                      disabled: _ctx.confirmButtonDisabled,
                      size: _ctx.btnSize,
                      onClick: _cache[5] || (_cache[5] = ($event) => _ctx.handleAction("confirm")),
                      onKeydown: _cache[6] || (_cache[6] = withKeys(withModifiers(($event) => _ctx.handleAction("confirm"), ["prevent"]), ["enter"]))
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.confirmButtonText || _ctx.t("el.messagebox.confirm")), 1)
                      ]),
                      _: 1
                    }, 8, ["loading", "class", "round", "disabled", "size"]), [
                      [vShow, _ctx.showConfirmButton]
                    ])
                  ], 2)
                ], 6)
              ]),
              _: 3
            }, 8, ["trapped", "focus-trap-el", "focus-start-el", "onReleaseRequested"])
          ], 42, _hoisted_1)
        ]),
        _: 3
      }, 8, ["z-index", "overlay-class", "mask"]), [
        [vShow, _ctx.visible]
      ])
    ]),
    _: 3
  });
}
var MessageBoxConstructor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/message-box/src/index.vue"]]);
const messageInstance = /* @__PURE__ */ new Map();
const getAppendToElement = (props) => {
  let appendTo = document.body;
  if (props.appendTo) {
    if (isString(props.appendTo)) {
      appendTo = document.querySelector(props.appendTo);
    }
    if (isElement(props.appendTo)) {
      appendTo = props.appendTo;
    }
    if (!isElement(appendTo)) {
      appendTo = document.body;
    }
  }
  return appendTo;
};
const initInstance = (props, container, appContext = null) => {
  const vnode = createVNode(MessageBoxConstructor, props, isFunction(props.message) || isVNode(props.message) ? {
    default: isFunction(props.message) ? props.message : () => props.message
  } : null);
  vnode.appContext = appContext;
  render(vnode, container);
  getAppendToElement(props).appendChild(container.firstElementChild);
  return vnode.component;
};
const genContainer = () => {
  return document.createElement("div");
};
const showMessage = (options, appContext) => {
  const container = genContainer();
  options.onVanish = () => {
    render(null, container);
    messageInstance.delete(vm);
  };
  options.onAction = (action) => {
    const currentMsg = messageInstance.get(vm);
    let resolve;
    if (options.showInput) {
      resolve = { value: vm.inputValue, action };
    } else {
      resolve = action;
    }
    if (options.callback) {
      options.callback(resolve, instance.proxy);
    } else {
      if (action === "cancel" || action === "close") {
        if (options.distinguishCancelAndClose && action !== "cancel") {
          currentMsg.reject("close");
        } else {
          currentMsg.reject("cancel");
        }
      } else {
        currentMsg.resolve(resolve);
      }
    }
  };
  const instance = initInstance(options, container, appContext);
  const vm = instance.proxy;
  for (const prop in options) {
    if (hasOwn(options, prop) && !hasOwn(vm.$props, prop)) {
      vm[prop] = options[prop];
    }
  }
  vm.visible = true;
  return vm;
};
function MessageBox(options, appContext = null) {
  if (!isClient)
    return Promise.reject();
  let callback;
  if (isString(options) || isVNode(options)) {
    options = {
      message: options
    };
  } else {
    callback = options.callback;
  }
  return new Promise((resolve, reject) => {
    const vm = showMessage(options, appContext != null ? appContext : MessageBox._context);
    messageInstance.set(vm, {
      options,
      callback,
      resolve,
      reject
    });
  });
}
const MESSAGE_BOX_VARIANTS = ["alert", "confirm", "prompt"];
const MESSAGE_BOX_DEFAULT_OPTS = {
  alert: { closeOnPressEscape: false, closeOnClickModal: false },
  confirm: { showCancelButton: true },
  prompt: { showCancelButton: true, showInput: true }
};
MESSAGE_BOX_VARIANTS.forEach((boxType) => {
  MessageBox[boxType] = messageBoxFactory(boxType);
});
function messageBoxFactory(boxType) {
  return (message, title, options, appContext) => {
    let titleOrOpts = "";
    if (isObject(title)) {
      options = title;
      titleOrOpts = "";
    } else if (isUndefined(title)) {
      titleOrOpts = "";
    } else {
      titleOrOpts = title;
    }
    return MessageBox(Object.assign({
      title: titleOrOpts,
      message,
      type: "",
      ...MESSAGE_BOX_DEFAULT_OPTS[boxType]
    }, options, {
      boxType
    }), appContext);
  };
}
MessageBox.close = () => {
  messageInstance.forEach((_, vm) => {
    vm.doClose();
  });
  messageInstance.clear();
};
MessageBox._context = null;
const _MessageBox = MessageBox;
_MessageBox.install = (app) => {
  _MessageBox._context = app._context;
  app.config.globalProperties.$msgbox = _MessageBox;
  app.config.globalProperties.$messageBox = _MessageBox;
  app.config.globalProperties.$alert = _MessageBox.alert;
  app.config.globalProperties.$confirm = _MessageBox.confirm;
  app.config.globalProperties.$prompt = _MessageBox.prompt;
};
const ElMessageBox = _MessageBox;
const { MT, shuffle, randInt } = random;
const { convert, getCharset } = baseConverter;
const maskingCharsetGenerator = (_charset, mt) => {
  const charset = shuffle(_charset, mt);
  return () => {
    charset.push(charset.shift());
    return charset;
  };
};
const mask = (_string, charset = 16, level = 1, seed) => {
  const charsetNum = Number.isNaN(+charset) ? 64 : +charset;
  const realCharset = getCharset(charset);
  const seed1 = toSeed(seed !== void 0 ? seed : randInt(0, charsetNum));
  const mt1 = MT(seed1);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1e6, mt1)));
  const characters = typeof _string === "string" ? _string.split("") : _string;
  const result = [
    seed !== void 0 ? realCharset[randInt(0, charsetNum)] : convert(seed1, 10, charset),
    ...characters.map((char) => generator()[realCharset.indexOf(char)])
  ];
  if (--level < 1) {
    return result.join("");
  }
  return mask(result, charset, level, seed);
};
const { textToBase64, base64ToText, secureBase64 } = baseConverter;
function e(input, maskLevel = 1, seed) {
  if (typeof input === "object") {
    input = safeStringify(input);
  } else if (typeof input !== "string") {
    input = str(input);
  }
  return mask(secureBase64(textToBase64(input)), 64, maskLevel, seed);
}
function hx(input, algorithm = 512, seed) {
  const encrypted = e(input, 1, seed).substring(1);
  if (algorithm === "MD5") {
    return md5(encrypted).toString();
  }
  return sha3(encrypted, { outputLength: algorithm }).toString();
}
const device = {
  get isMobileScreen() {
    return false;
  },
  get isTouchScreen() {
    return false;
  }
};
function useDevice() {
  return device;
}
const customErrorCodes = /* @__PURE__ */ new Map([
  ["THINKING", "Please wait, I am answering another question..."]
]);
function validKeyValuePair(key, value) {
  switch (key) {
    case "model":
      if (["gpt3", "gpt4", "gpt-web", "claude-2", "claude-2-web", "gpt3-fga", "gpt4-fga"].includes(value)) {
        return true;
      }
      break;
    case "temperature":
      if (typeof value === "number") {
        if (value >= 0 && value <= 1) {
          return true;
        }
      }
      break;
    case "context":
      if (typeof value === "boolean") {
        return true;
      }
      break;
  }
  return false;
}
function tryParseJson(obj) {
  try {
    return JSON.parse(obj);
  } catch {
    return obj;
  }
}
function toStdConvConfig(obj) {
  try {
    const resultObj = {};
    for (const key in obj) {
      const value = tryParseJson(obj[key]);
      if (validKeyValuePair(key, value)) {
        resultObj[key] = value;
      }
    }
    return resultObj;
  } catch {
    return {};
  }
}
function parseConvConfig(objString) {
  try {
    return toStdConvConfig(qs.parse(objString));
  } catch {
    return {};
  }
}
function stringifyConvConfig(obj) {
  try {
    return qs.stringify(toStdConvConfig(obj));
  } catch {
    return "";
  }
}
const MIN_LEVEL = 0;
const models = [
  {
    name: "GPT-3.5-Turbo",
    value: "gpt3",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL
  },
  {
    name: "GPT-4",
    value: "gpt4",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL
  },
  {
    name: "GPT-Web",
    value: "gpt-web",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: false,
    permissionLevel: MIN_LEVEL,
    redirectTo: "gpt3"
  },
  {
    name: "Claude-2",
    value: "claude-2",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL
  },
  {
    name: "Claude-2 (Web)",
    value: "claude-2-web",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL
  },
  {
    name: "GPT-3.5-Turbo (stream)",
    value: "gpt3-fga",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL,
    redirectTo: "gpt3"
  },
  {
    name: "GPT-4 (stream)",
    value: "gpt4-fga",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL,
    redirectTo: "gpt4"
  }
];
let nuxtApp;
let lastModifiedConv = "";
const model = ref("gpt4");
const contextMode = ref(true);
const temperature = ref(0.5);
const messages = ref([]);
const conversations = ref([]);
const editingQuestion = ref();
const isEditingQuestion = ref(false);
const editingQuestionContent = ref("");
function callEditQuestionDialog(message) {
  isEditingQuestion.value = true;
  editingQuestion.value = message;
  editingQuestionContent.value = message.Q;
  setTimeout(() => _focusEditQuestionInput(), 0);
}
function _focusEditQuestionInput() {
  try {
    document.querySelector(".EditQuestionInput textarea").focus();
  } catch {
  }
}
watch(isEditingQuestion, (value) => !value ? focusInput() : null);
const editingAnswer = ref();
const isEditingAnswer = ref(false);
const editingAnswerContent = ref("");
function callEditAnswerDialog(message) {
  isEditingAnswer.value = true;
  editingAnswer.value = message;
  editingAnswerContent.value = message.A;
  setTimeout(() => _focusEditAnswerInput(), 0);
}
function _focusEditAnswerInput() {
  try {
    document.querySelector(".EditAnswerInput textarea").focus();
  } catch {
  }
}
watch(isEditingAnswer, (value) => !value ? focusInput() : null);
const focusInput = () => {
  try {
    if (false)
      ;
  } catch {
  }
};
const adjustConvesationListScroll = () => {
  try {
    const convParentEl = document.getElementById(getCurrentConvId()).parentElement;
    const convListEl = document.querySelector(".ConversationList");
    const maxScrollTop = convParentEl.offsetTop - convListEl.offsetTop - convParentEl.clientHeight / 2;
    const minScrollTop = maxScrollTop - convListEl.clientHeight + convParentEl.clientHeight * 2;
    if (convListEl.scrollTop > maxScrollTop) {
      convListEl.scrollTo({ left: 0, top: maxScrollTop, behavior: "smooth" });
    }
    if (convListEl.scrollTop < minScrollTop) {
      convListEl.scrollTo({ left: 0, top: minScrollTop, behavior: "smooth" });
    }
  } catch {
  }
};
const checkTokenAndGetConversations = () => {
  return new Promise((resolve, reject) => {
    $fetch("/api/curva/check", { method: "POST" }).then((_conversations) => {
      conversations.value = _conversations;
      adjustConvesationListScroll();
      resolve(true);
    }).catch((err) => {
      ElMessage.error("Initialization Failed");
      reject(err);
    });
  });
};
const _fetchHistory = (conv) => {
  return new Promise(async (resolve, reject) => {
    if (conv === null || conv === void 0) {
      return resolve([]);
    }
    const archived = await $fetch("/api/curva/history", {
      method: "POST",
      body: { id: conv }
    });
    if (!archived || archived.length === 0) {
      navigateTo("/c/");
    }
    try {
      resolve(archived.map((msg) => reactive({
        ...msg,
        t: new Date(msg.t),
        done: true
      })));
    } catch {
      navigateTo("/c/");
      resolve([]);
    }
  });
};
const _fetchSuggestions = async function(question) {
  return [];
};
const _loadSuggestions = async () => {
  try {
    const lastMessage = messages.value.at(-1);
    const suggestions = await _fetchSuggestions(lastMessage.Q);
    const isAtBottom = useScrollToBottom.isAtBottom();
    lastMessage.more = suggestions;
    if (isAtBottom)
      useScrollToBottom();
  } catch (err) {
    console.error(err);
  }
};
const resetConvConfig = (showElMessage = false) => {
  model.value = "gpt4";
  contextMode.value = true;
  temperature.value = 0.5;
  if (showElMessage) {
    ElMessage.success("Conversation settings have been reset.");
  }
};
resetConvConfig();
const openMenu = ref(false);
const openSidebarController = ref(openMenu.value);
const openDrawerController = ref(openMenu.value);
watch(openSidebarController, (value) => {
  openMenu.value = value;
});
watch(openDrawerController, (value) => {
  openMenu.value = value;
});
watch(openMenu, (value) => {
  const { isMobileScreen } = useDevice();
  openSidebarController.value = isMobileScreen ? false : value;
  openDrawerController.value = isMobileScreen ? value : false;
  setTimeout(() => focusInput(), 0);
});
const inputValue = ref("");
const inputMaxLength = computed(() => model.value.startsWith("gpt3") ? 16e3 : 32e3);
const createRequest = (() => {
  const getHashType = () => [77, 68, 53].map((c) => String.fromCharCode(c)).join("");
  const createHeaders = (messages2, t) => ({
    hash: hx(messages2, getHashType(), t),
    timestamp: str(t)
  });
  const createBody = (messages2, model2, temperature2, t, tz, regenerateId, streamId) => {
    let conv = getCurrentConvId();
    if (!conv) {
      conv = random.base64(8);
      conversations.value.unshift({ id: conv, name: "", mtime: Date.now(), config: "" });
      navigateTo(`/c/${conv}?feature=new`);
      setCurrentConvId(conv);
    }
    return { conv, messages: messages2, model: model2, temperature: temperature2, t, tz, id: regenerateId, streamId };
  };
  return async (message, streamId) => {
    const date = /* @__PURE__ */ new Date();
    const t = date.getTime();
    const tz = date.getTimezoneOffset() / 60 * -1;
    const formattedMessages = (() => {
      if (!contextMode.value) {
        return [{ role: "user", content: (message == null ? void 0 : message.Q) || "" }];
      }
      const endIndex = messages.value.lastIndexOf(message) + 1 || messages.value.length;
      let _formattedMessages = messages.value.slice(0, endIndex);
      _formattedMessages = _formattedMessages.slice(_formattedMessages.length - 100);
      return _formattedMessages.map((message2) => {
        return [
          { role: "user", content: message2.Q },
          { role: "assistant", content: message2.A }
        ].filter((m) => m.content);
      }).flat();
    })();
    try {
      const body = createBody(formattedMessages, model.value, temperature.value, t, tz, message == null ? void 0 : message.id, streamId);
      const headers = createHeaders(formattedMessages, t);
      return await $fetch("/api/curva/answer", { method: "POST", headers, body });
    } catch (err) {
      return { answer: "", error: (err == null ? void 0 : err.message) || "Error while sending request." };
    }
  };
})();
const createMessage = (Q = "", A = "", done = false) => {
  return reactive({
    done,
    Q,
    A,
    queries: [],
    urls: [],
    dt: void 0,
    t: /* @__PURE__ */ new Date()
  });
};
const chatLoadings = /* @__PURE__ */ new Set();
const clear = () => {
  conversations.value = [];
  messages.value = [];
  navigateTo("/c/");
  first = true;
};
let first = true;
const downloadTextFile = (filename, content) => {
  const a = document.createElement("a");
  a.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
  a.setAttribute("download", filename);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
};
const [currentConvIdComputed, getCurrentConvId, setCurrentConvId] = (() => {
  const currentConvIdComputed2 = ref("");
  return [
    computed(() => currentConvIdComputed2.value),
    () => currentConvIdComputed2.value,
    (value) => {
      var _a, _b;
      return currentConvIdComputed2.value = value === void 0 ? (_b = (_a = nuxtApp._route) == null ? void 0 : _a.params) == null ? void 0 : _b.conv : value;
    }
  ];
})();
const getCurrentConvName = () => {
  var _a;
  const currConvId = getCurrentConvId();
  return ((_a = conversations.value.find((conv) => conv.id === currConvId)) == null ? void 0 : _a.name) || "";
};
async function updateConversation(id, newname) {
  id = id || getCurrentConvId();
  if (!id) {
    return { cancel: true };
  }
  return await $fetch("/api/curva/conv", {
    method: "PUT",
    body: {
      id,
      name: newname || getCurrentConvName(),
      config: stringifyConvConfig({
        model: model.value,
        temperature: temperature.value,
        context: contextMode.value
      })
    }
  });
}
const loadConvConfig = (convId) => {
  var _a, _b;
  if (convId === void 0) {
    convId = getCurrentConvId();
  }
  if (convId === void 0 || convId === null) {
    return;
  }
  const config = parseConvConfig(((_a = conversations.value.find((conv) => conv.id === convId)) == null ? void 0 : _a.config) || "");
  const keys = Object.keys(config);
  if (keys.length === 0) {
    resetConvConfig();
  } else {
    try {
      for (const key of keys) {
        const value = config[key];
        switch (key) {
          case "model":
            const _redirectModel = (_b = models.find((m) => m.value === value)) == null ? void 0 : _b.redirectTo;
            model.value = _redirectModel || value;
            break;
          case "temperature":
            temperature.value = value;
            break;
          case "context":
            contextMode.value = value;
            break;
        }
      }
    } finally {
    }
  }
  ElMessage.info("Conversation settings have been loaded.");
};
setTimeout(() => {
  [model, contextMode, temperature].forEach((variable) => {
    watch(variable, (newValue, oldValue) => {
    });
  });
}, 1e3);
const updateMessage = (message, keyToBeCleared) => {
  if (keyToBeCleared !== void 0) {
    message[keyToBeCleared] = "";
  }
  const { id: base64MessageId, Q, A } = message;
  messages.value = messages.value.filter((msg) => msg.Q || msg.A);
  $fetch("/api/curva/message", {
    method: "PUT",
    body: {
      conv: getCurrentConvId(),
      id: base64MessageId,
      Q,
      A
    }
  }).then(() => ElMessage.info(`The message has been ${keyToBeCleared ? "deleted" : "saved"}.`)).catch(() => ElMessage.error(`An error occurred while ${keyToBeCleared ? "deleting" : "saving"} the message.`));
};
const exportAsMarkdown = () => {
  let i = 0;
  const filename = `${baseConverter.convert(getCurrentConvId(), "64w", 10)}.md`;
  const markdownContent = messages.value.map((message) => {
    i++;
    try {
      return (message.t ? `${new Date(message.t.getTime() - (message.dt || 0)).toLocaleString()}${message.dt === void 0 ? "" : " (\u0394t: " + message.dt.toString() + "ms)"}

` : "") + (message.Q ? `QUESTION ${i}:

${message.Q.replaceAll("\n", "\n\n")}` : "") + (message.Q && message.A ? "\n\n" : "") + (message.A ? `ANSWER ${i}:

${message.A}` : "");
    } catch {
      return "(Unknown message)";
    }
  }).join("\n\n---\n\n") + "\n\n---\n\n";
  downloadTextFile(filename, markdownContent);
};
const exportAsJson = () => {
  const openAiFormatMessages = messages.value.map((msg) => [
    { role: "user", content: msg.Q },
    { role: "assistant", content: msg.A }
  ]).flat().filter((m) => m.content);
  downloadTextFile(`${baseConverter.convert(getCurrentConvId(), "64w", 10)}.json`, JSON.stringify(openAiFormatMessages, null, 4));
};
const exportAsJsonDetailed = () => {
  const openAiFormatMessages = messages.value.map((msg) => {
    var _a, _b;
    return [
      {
        role: "user",
        content: msg.Q
      },
      {
        role: "assistant",
        content: msg.A,
        queries: ((_a = msg.queries) == null ? void 0 : _a.length) ? msg.queries : void 0,
        urls: ((_b = msg.urls) == null ? void 0 : _b.length) ? msg.urls : void 0,
        createdAt: new Date(msg.t.getTime()).toUTCString(),
        timeUsed: msg.dt || void 0
      }
    ];
  }).flat().filter((m) => m.content);
  downloadTextFile(`${baseConverter.convert(getCurrentConvId(), "64w", 10)}.json`, JSON.stringify(openAiFormatMessages, null, 4));
};
const showScrollToBottomButton = ref(false);
function useChat() {
  const { authEventTarget } = useAuth();
  const appName = useState("appName").value;
  const cookie = useUniCookie();
  ["temperature-suffix", "web-browsing", "temperature"].forEach((oldCookieName) => {
    cookie.delete(oldCookieName, { path: "/" });
    cookie.delete(oldCookieName);
  });
  nuxtApp = useNuxtApp();
  const refreshPageTitle = () => {
    setTimeout(() => {
      try {
        useTitle(`${getCurrentConvName() || _t("chat.title")} - ${appName}`);
      } catch (err) {
        useTitle(`${_t("chat.title")} - ${appName}`);
      }
    }, 0);
  };
  authEventTarget.addListener("login", clear);
  authEventTarget.addListener("logout", clear);
  const _loadChat = async (conv) => {
    setTimeout(() => {
    }, 0);
    messages.value = [];
    const loading = ElLoading.service({ text: _t("chat.ldConv") + "...", lock: true });
    try {
      const fetchingConvList = conv === null && conversations.value.length > 0 ? null : checkTokenAndGetConversations();
      const displayChatMessages = conv === null ? null : await _fetchHistory(conv);
      if (displayChatMessages !== null && getCurrentConvId() === conv) {
        messages.value = displayChatMessages;
        _loadSuggestions();
      }
      await Promise.all([fetchingConvList, useScrollToBottom(1e3)]);
      loadConvConfig(conv);
      setTimeout(() => refreshPageTitle(), 1e3);
    } finally {
      loading.close();
      await useScrollToBottom(500);
      focusInput();
      adjustConvesationListScroll();
      await useScrollToBottom(500);
    }
  };
  const loadChat = async (conv, isNew = false) => {
    setCurrentConvId(conv || "");
    const promise = Promise.all([...chatLoadings]);
    const chat = first && isNew ? new Promise(async (resolve) => {
      await _loadChat(conv);
      resolve(null);
    }) : isNew ? new Promise((resolve) => resolve(null)) : _loadChat(conv);
    first = false;
    chatLoadings.add(chat);
    try {
      await promise;
    } catch {
    }
    try {
      await chat;
    } finally {
      chatLoadings.delete(chat);
    }
  };
  const _t = useLocale().t;
  const version = useState("version");
  const sendMessage = async (forceMessage, regenerateId) => {
    if (!model.value) {
      ElMessage.info("Please select a model.");
      focusInput();
      return false;
    }
    const loadingMessagesAmount = document.querySelectorAll(".Message.T").length;
    if (loadingMessagesAmount > 0) {
      ElMessage.info("Please wait for the completion of the previous question.");
      focusInput();
      return false;
    }
    const messageText = (forceMessage !== void 0 ? forceMessage : inputValue.value).trim();
    if (forceMessage === void 0) {
      inputValue.value = "";
      if (messageText === "") {
        focusInput();
        return false;
      }
    }
    const message = (regenerateId ? messages.value.filter((msg) => msg.id === regenerateId).at(-1) : void 0) || createMessage(messageText, "", false);
    if (!messages.value.includes(message)) {
      messages.value.push(message);
    }
    const previousAnswer = message.A || "";
    message.done = false;
    message.Q = messageText;
    message.A = "";
    message.urls = [];
    message.queries = [];
    if (message.dt)
      message.dt = void 0;
    const suggestionsResponse = _fetchSuggestions();
    const isAtBottom = useScrollToBottom.isAtBottom();
    const convId = getCurrentConvId();
    if (isAtBottom)
      useScrollToBottom();
    focusInput();
    const typewriterSpeed = 1;
    let isDonePending = false;
    const streamId = await new Promise(async (resolve) => {
      var _a;
      if (!((_a = models.find((m) => m.value === model.value)) == null ? void 0 : _a.isStreamAvailable)) {
        return resolve(void 0);
      }
      const typewriter = [];
      const typewriterInterval = setInterval(() => {
        if (typewriter.length) {
          message.A += typewriter.shift();
          useScrollToBottom.keepAtBottom();
        }
        if (message.done) {
          clearInterval(typewriterInterval);
          controller.abort();
        }
      }, typewriterSpeed);
      const controller = new AbortController();
      const streamRes = await fetch("/api/curva/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
        signal: controller.signal
      });
      const decoder = new TextDecoder();
      const reader = streamRes.body.getReader();
      let idIsResolved = false;
      const readChunks = async () => {
        await reader.read().then(async ({ value, done }) => {
          if (done) {
            if (typewriter.length === 0) {
              message.done = true;
              return;
            }
            isDonePending = true;
            const donePending = setInterval(() => {
              if (typewriter.length === 0) {
                message.done = true;
                isDonePending = false;
                clearInterval(donePending);
              }
            }, typewriterSpeed);
            return;
          }
          const decodedValue = decoder.decode(value);
          if (idIsResolved) {
            typewriter.push(decodedValue);
          } else {
            resolve(decodedValue);
            idIsResolved = true;
          }
          readChunks();
        });
      };
      readChunks();
    });
    const response = await createRequest(message, streamId);
    if (lastModifiedConv !== convId) {
      checkTokenAndGetConversations().finally(() => {
        lastModifiedConv = getCurrentConvId();
      });
    }
    const { id, answer = "", error, urls = [], queries = [], dt = 0, version: _version } = response;
    if (isDonePending) {
      const donePending = setInterval(() => {
        if (!isDonePending) {
          message.done = true;
          if (message.A !== answer)
            message.A = answer || "";
          clearInterval(donePending);
        }
      }, typewriterSpeed);
    } else {
      message.done = true;
      if (message.A !== answer)
        message.A = answer || "";
    }
    message.t = /* @__PURE__ */ new Date();
    message.dt = dt || void 0;
    message.id = id || void 0;
    message.urls = urls || [];
    message.queries = queries || [];
    const isErrorExists = ((errorMessage) => {
      if (errorMessage) {
        if (errorMessage.type === "warning") {
          ElMessage.warning(errorMessage.content);
        } else {
          ElMessage.error(errorMessage.content);
        }
        message.A = "Oops! Something went wrong!";
        return true;
      }
      return false;
    })((() => {
      if (answer === "") {
        if (error) {
          const restoreInput = () => {
            if (regenerateId) {
              message.A = previousAnswer;
            } else {
              messages.value.pop();
              inputValue.value = messageText;
            }
          };
          if (typeof error === "string" && error.startsWith("You have tried too many times.")) {
            restoreInput();
            return { type: "warning", content: error };
          }
          switch (error) {
            case "THINKING":
              restoreInput();
              return { type: "warning", content: customErrorCodes.get(error) };
            default:
              return { type: "error", content: error };
          }
        }
        return { type: "error", content: _t("error.plzRefresh") };
      }
    })());
    setTimeout(async () => {
      if (_version && _version !== version.value) {
        const reloadTimeout = setTimeout(() => location.reload(), 3e3);
        ElMessageBox.confirm(_t("action.newVersion"), _t("message.notice"), {
          confirmButtonText: _t("message.ok"),
          cancelButtonText: _t("message.cancel"),
          type: "warning"
        }).then(() => focusInput()).catch(() => focusInput()).finally(() => {
          clearTimeout(reloadTimeout);
          ElLoading.service({ text: "Loading...", lock: true });
          location.reload();
        });
      }
    }, 0);
    suggestionsResponse.then((more) => {
      const isAtBottom2 = useScrollToBottom.isAtBottom();
      message.more = more;
      if (isAtBottom2)
        useScrollToBottom();
    });
    return isErrorExists;
  };
  const regenerateMessage = async (message) => {
    if (messages.value.length === 0) {
      return;
    }
    const { Q, id } = message || messages.value.pop();
    sendMessage(Q || "", id);
  };
  const refreshConversation = () => {
    loadChat(getCurrentConvId()).finally(() => focusInput());
  };
  const renameConversation = (id, defaultName = "") => {
    if (!id) {
      id = getCurrentConvId();
      defaultName = getCurrentConvName();
    }
    ElMessageBox.prompt(_t("message.renameConvHint"), _t("message.setting"), {
      confirmButtonText: _t("message.ok"),
      cancelButtonText: _t("message.cancel"),
      inputValue: defaultName,
      inputPlaceholder: baseConverter.convert(id, "64w", 10)
    }).then(async ({ value: name }) => {
      try {
        await updateConversation(id, name);
        ElMessage({
          type: "success",
          message: _t("message.renameSuccess")
        });
        await checkTokenAndGetConversations();
        refreshPageTitle();
      } catch {
        ElMessage({
          type: "error",
          message: "Oops! Something went wrong!"
        });
      }
    }).catch(() => {
    });
  };
  const deleteConversation = (targetConvId) => {
    const id = targetConvId ? targetConvId : getCurrentConvId();
    let nextConvId = "createNewChat";
    ElMessageBox.confirm(
      _t("message.deleteConvConfirm"),
      _t("message.warning"),
      {
        confirmButtonText: _t("message.ok"),
        cancelButtonText: _t("message.cancel"),
        type: "warning"
      }
    ).then(async () => {
      var _a;
      const loading = ElLoading.service({ text: _t("chat.dltConv") + "...", lock: true });
      try {
        await $fetch("/api/curva/conv", { method: "DELETE", body: { id } });
      } catch {
      }
      loading.close();
      if (targetConvId === getCurrentConvId()) {
        (_a = document.getElementById(nextConvId)) == null ? void 0 : _a.click();
      }
      conversations.value = conversations.value.filter((c) => c.id !== targetConvId);
    });
  };
  return {
    models,
    showScrollToBottomButton,
    // Edit Question
    isEditingQuestion,
    editingQuestion,
    editingQuestionContent,
    callEditQuestionDialog,
    // Edit Answer
    isEditingAnswer,
    editingAnswer,
    editingAnswerContent,
    callEditAnswerDialog,
    // ----------------
    model,
    conversations,
    messages,
    temperature,
    contextMode,
    openMenu,
    openSidebarController,
    openDrawerController,
    inputValue,
    inputMaxLength,
    currentConvIdComputed,
    getCurrentConvId,
    getCurrentConvName,
    checkTokenAndGetConversations,
    loadChat,
    sendMessage,
    updateMessage,
    regenerateMessage,
    focusInput,
    refreshConversation,
    renameConversation,
    deleteConversation,
    resetConvConfig,
    exportAsMarkdown,
    exportAsJson,
    exportAsJsonDetailed,
    clear
  };
}

const _sfc_main = {
  __name: "ConvMain",
  __ssrInlineRender: true,
  setup(__props) {
    const { showScrollToBottomButton, messages, openSidebarController, callEditQuestionDialog, callEditAnswerDialog, sendMessage, updateMessage, regenerateMessage, focusInput } = useChat();
    marked.setOptions({ headerIds: false, mangle: false });
    const more = reactive({
      start: 0,
      end: 3,
      step: 3,
      run(maxLength = 8) {
        if (more.end >= maxLength) {
          more.reset();
        } else {
          more.start += more.step;
          more.end += more.step;
        }
      },
      reset() {
        more.start = 0;
        more.end = more.step;
      }
    });
    watch(messages, () => more.reset());
    const loadingDots = ref(".");
    setInterval(() => {
      if (loadingDots.value.length < 4) {
        loadingDots.value += ".";
      } else {
        loadingDots.value = ".";
      }
    }, 500);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Chatbot/ConvMain.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main;

export { __nuxt_component_0 as _ };
//# sourceMappingURL=ConvMain-19e66af5.mjs.map
