import { b as useState, g as useUniCookie, h as useLocale, n as navigateTo, i as useNuxtApp, e as useId, t as throwError, d as useNamespace } from '../server.mjs';
import { ref, watch, nextTick, reactive, createApp, toRefs, isRef, defineComponent, h as h$1, Transition, withCtx, withDirectives, createVNode, vShow, isVNode, render, computed, resolveComponent, openBlock, createBlock, createElementVNode, normalizeClass, normalizeStyle, withModifiers, createElementBlock, resolveDynamicComponent, createCommentVNode, toDisplayString, withKeys, renderSlot, createTextVNode, onScopeDispose, provide, unref } from 'vue';
import { u as useTitle } from './useTitle-90f4e537.mjs';
import sha3 from 'crypto-js/sha3.js';
import md5 from 'crypto-js/md5.js';
import qs from 'qs';
import { b as buildProps, d as definePropType, g as getStyle, a as addClass, r as removeClass, E as ElMessage, u as useGlobalComponentSettings, i as isUndefined, _ as _export_sfc, c as isElement, e as ElButton, f as ElInput, h as ElIcon, T as TypeComponents, j as TypeComponentsMap, k as componentSizes, l as hasClass, m as EVENT_CODE } from './index-d9ebd305.mjs';
import { isString, isObject, hyphenate, hasOwn, isFunction, NOOP } from '@vue/shared';
import { isNil } from 'lodash-unified';
import { computed as computed$1 } from '@vue/reactivity';
import { isClient } from '@vueuse/core';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const FOCUSABLE_ELEMENT_SELECTORS = `a[href],button:not([disabled]),button:not([hidden]),:not([tabindex="-1"]),input:not([disabled]),input:not([type="hidden"]),select:not([disabled]),textarea:not([disabled])`;
const isVisible = (element) => {
  const computed2 = getComputedStyle(element);
  return computed2.position === "fixed" ? false : element.offsetParent !== null;
};
const obtainAllFocusableElements$1 = (element) => {
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
let scrollBarWidth;
const getScrollBarWidth = (namespace) => {
  var _a;
  if (!isClient)
    return 0;
  if (scrollBarWidth !== void 0)
    return scrollBarWidth;
  const outer = document.createElement("div");
  outer.className = `${namespace}-scrollbar__wrap`;
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.position = "absolute";
  outer.style.top = "-9999px";
  document.body.appendChild(outer);
  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";
  const inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);
  const widthWithScroll = inner.offsetWidth;
  (_a = outer.parentNode) == null ? void 0 : _a.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;
  return scrollBarWidth;
};
const isValidComponentSize = (val) => ["", ...componentSizes].includes(val);
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
  let scrollBarWidth2 = 0;
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
    scrollBarWidth2 = getScrollBarWidth(ns.namespace.value);
    const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
    const bodyOverflowY = getStyle(document.body, "overflowY");
    if (scrollBarWidth2 > 0 && (bodyHasOverflow || bodyOverflowY === "scroll") && withoutHiddenClass) {
      document.body.style.width = `calc(100% - ${scrollBarWidth2}px)`;
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
const FOCUSOUT_PREVENTED = "focus-trap.focusout-prevented";
const FOCUSOUT_PREVENTED_OPTS = {
  cancelable: true,
  bubbles: false
};
const ON_TRAP_FOCUS_EVT = "focusAfterTrapped";
const ON_RELEASE_FOCUS_EVT = "focusAfterReleased";
const FOCUS_TRAP_INJECTION_KEY = Symbol("elFocusTrap");
const focusReason = ref();
const lastUserFocusTimestamp = ref(0);
const lastAutomatedFocusTimestamp = ref(0);
const obtainAllFocusableElements = (element) => {
  const nodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput)
        return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 || node === document.activeElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode())
    nodes.push(walker.currentNode);
  return nodes;
};
const getVisibleElement = (elements, container) => {
  for (const element of elements) {
    if (!isHidden(element, container))
      return element;
  }
};
const isHidden = (element, container) => {
  if (getComputedStyle(element).visibility === "hidden")
    return true;
  while (element) {
    if (container && element === container)
      return false;
    if (getComputedStyle(element).display === "none")
      return true;
    element = element.parentElement;
  }
  return false;
};
const getEdges = (container) => {
  const focusable = obtainAllFocusableElements(container);
  const first2 = getVisibleElement(focusable, container);
  const last = getVisibleElement(focusable.reverse(), container);
  return [first2, last];
};
const isSelectable = (element) => {
  return element instanceof HTMLInputElement && "select" in element;
};
const tryFocus = (element, shouldSelect) => {
  if (element && element.focus) {
    const prevFocusedElement = document.activeElement;
    element.focus({ preventScroll: true });
    lastAutomatedFocusTimestamp.value = window.performance.now();
    if (element !== prevFocusedElement && isSelectable(element) && shouldSelect) {
      element.select();
    }
  }
};
const useFocusReason = () => {
  return {
    focusReason,
    lastUserFocusTimestamp,
    lastAutomatedFocusTimestamp
  };
};
const createFocusOutPreventedEvent = (detail) => {
  return new CustomEvent(FOCUSOUT_PREVENTED, {
    ...FOCUSOUT_PREVENTED_OPTS,
    detail
  });
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  name: "ElFocusTrap",
  inheritAttrs: false,
  props: {
    loop: Boolean,
    trapped: Boolean,
    focusTrapEl: Object,
    focusStartEl: {
      type: [Object, String],
      default: "first"
    }
  },
  emits: [
    ON_TRAP_FOCUS_EVT,
    ON_RELEASE_FOCUS_EVT,
    "focusin",
    "focusout",
    "focusout-prevented",
    "release-requested"
  ],
  setup(props, { emit }) {
    const forwardRef = ref();
    let lastFocusAfterTrapped;
    const { focusReason: focusReason2 } = useFocusReason();
    const onKeydown = (e2) => {
      if (!props.loop && !props.trapped)
        return;
      const { key, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e2;
      const { loop } = props;
      const isTabbing = key === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;
      const currentFocusingEl = document.activeElement;
      if (isTabbing && currentFocusingEl) {
        const container = currentTarget;
        const [first2, last] = getEdges(container);
        const isTabbable = first2 && last;
        if (!isTabbable) {
          if (currentFocusingEl === container) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason2.value
            });
            emit("focusout-prevented", focusoutPreventedEvent);
            if (!focusoutPreventedEvent.defaultPrevented) {
              e2.preventDefault();
            }
          }
        } else {
          if (!shiftKey && currentFocusingEl === last) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason2.value
            });
            emit("focusout-prevented", focusoutPreventedEvent);
            if (!focusoutPreventedEvent.defaultPrevented) {
              e2.preventDefault();
              if (loop)
                tryFocus(first2, true);
            }
          } else if (shiftKey && [first2, container].includes(currentFocusingEl)) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason2.value
            });
            emit("focusout-prevented", focusoutPreventedEvent);
            if (!focusoutPreventedEvent.defaultPrevented) {
              e2.preventDefault();
              if (loop)
                tryFocus(last, true);
            }
          }
        }
      }
    };
    provide(FOCUS_TRAP_INJECTION_KEY, {
      focusTrapRef: forwardRef,
      onKeydown
    });
    watch(() => props.focusTrapEl, (focusTrapEl) => {
      if (focusTrapEl) {
        forwardRef.value = focusTrapEl;
      }
    }, { immediate: true });
    watch([forwardRef], ([forwardRef2], [oldForwardRef]) => {
      if (forwardRef2) {
        forwardRef2.addEventListener("keydown", onKeydown);
        forwardRef2.addEventListener("focusin", onFocusIn);
        forwardRef2.addEventListener("focusout", onFocusOut);
      }
      if (oldForwardRef) {
        oldForwardRef.removeEventListener("keydown", onKeydown);
        oldForwardRef.removeEventListener("focusin", onFocusIn);
        oldForwardRef.removeEventListener("focusout", onFocusOut);
      }
    });
    const onFocusIn = (e2) => {
      const trapContainer = unref(forwardRef);
      if (!trapContainer)
        return;
      const target = e2.target;
      const relatedTarget = e2.relatedTarget;
      const isFocusedInTrap = target && trapContainer.contains(target);
      if (!props.trapped) {
        relatedTarget && trapContainer.contains(relatedTarget);
      }
      if (isFocusedInTrap)
        emit("focusin", e2);
      if (props.trapped) {
        if (isFocusedInTrap) {
          lastFocusAfterTrapped = target;
        } else {
          tryFocus(lastFocusAfterTrapped, true);
        }
      }
    };
    const onFocusOut = (e2) => {
      const trapContainer = unref(forwardRef);
      if (!trapContainer)
        return;
      if (props.trapped) {
        const relatedTarget = e2.relatedTarget;
        if (!isNil(relatedTarget) && !trapContainer.contains(relatedTarget)) {
          setTimeout(() => {
            if (props.trapped) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                tryFocus(lastFocusAfterTrapped, true);
              }
            }
          }, 0);
        }
      } else {
        const target = e2.target;
        const isFocusedInTrap = target && trapContainer.contains(target);
        if (!isFocusedInTrap)
          emit("focusout", e2);
      }
    };
    return {
      onKeydown
    };
  }
});
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
}
var ElFocusTrap = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/focus-trap/src/focus-trap.vue"]]);
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
    el[FOCUSABLE_CHILDREN] = obtainAllFocusableElements$1(el);
    FOCUS_STACK.push(el);
    if (FOCUS_STACK.length <= 1) {
      document.addEventListener("keydown", FOCUS_HANDLER);
    }
  },
  updated(el) {
    nextTick(() => {
      el[FOCUSABLE_CHILDREN] = obtainAllFocusableElements$1(el);
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
      }, [renderSlot(slots, "default")], PatchFlags.STYLE | PatchFlags.CLASS | PatchFlags.PROPS, ["onClick", "onMouseup", "onMousedown"]) : h$1("div", {
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
function createLoadingComponent(options) {
  let afterLeaveTimer;
  const afterLeaveFlag = ref(false);
  const data = reactive({
    ...options,
    originalPosition: "",
    originalOverflow: "",
    visible: false
  });
  function setText(text) {
    data.text = text;
  }
  function destroySelf() {
    const target = data.parent;
    const ns = vm.ns;
    if (!target.vLoadingAddClassList) {
      let loadingNumber = target.getAttribute("loading-number");
      loadingNumber = Number.parseInt(loadingNumber) - 1;
      if (!loadingNumber) {
        removeClass(target, ns.bm("parent", "relative"));
        target.removeAttribute("loading-number");
      } else {
        target.setAttribute("loading-number", loadingNumber.toString());
      }
      removeClass(target, ns.bm("parent", "hidden"));
    }
    removeElLoadingChild();
    loadingInstance.unmount();
  }
  function removeElLoadingChild() {
    var _a, _b;
    (_b = (_a = vm.$el) == null ? void 0 : _a.parentNode) == null ? void 0 : _b.removeChild(vm.$el);
  }
  function close() {
    var _a;
    if (options.beforeClose && !options.beforeClose())
      return;
    afterLeaveFlag.value = true;
    clearTimeout(afterLeaveTimer);
    afterLeaveTimer = window.setTimeout(handleAfterLeave, 400);
    data.visible = false;
    (_a = options.closed) == null ? void 0 : _a.call(options);
  }
  function handleAfterLeave() {
    if (!afterLeaveFlag.value)
      return;
    const target = data.parent;
    afterLeaveFlag.value = false;
    target.vLoadingAddClassList = void 0;
    destroySelf();
  }
  const elLoadingComponent = /* @__PURE__ */ defineComponent({
    name: "ElLoading",
    setup(_, { expose }) {
      const { ns, zIndex } = useGlobalComponentSettings("loading");
      expose({
        ns,
        zIndex
      });
      return () => {
        const svg = data.spinner || data.svg;
        const spinner = h$1("svg", {
          class: "circular",
          viewBox: data.svgViewBox ? data.svgViewBox : "0 0 50 50",
          ...svg ? { innerHTML: svg } : {}
        }, [
          h$1("circle", {
            class: "path",
            cx: "25",
            cy: "25",
            r: "20",
            fill: "none"
          })
        ]);
        const spinnerText = data.text ? h$1("p", { class: ns.b("text") }, [data.text]) : void 0;
        return h$1(Transition, {
          name: ns.b("fade"),
          onAfterLeave: handleAfterLeave
        }, {
          default: withCtx(() => [
            withDirectives(createVNode("div", {
              style: {
                backgroundColor: data.background || ""
              },
              class: [
                ns.b("mask"),
                data.customClass,
                data.fullscreen ? "is-fullscreen" : ""
              ]
            }, [
              h$1("div", {
                class: ns.b("spinner")
              }, [spinner, spinnerText])
            ]), [[vShow, data.visible]])
          ])
        });
      };
    }
  });
  const loadingInstance = createApp(elLoadingComponent);
  const vm = loadingInstance.mount(document.createElement("div"));
  return {
    ...toRefs(data),
    setText,
    removeElLoadingChild,
    close,
    handleAfterLeave,
    vm,
    get $el() {
      return vm.$el;
    }
  };
}
let fullscreenInstance = void 0;
const Loading = function(options = {}) {
  if (!isClient)
    return void 0;
  const resolved = resolveOptions(options);
  if (resolved.fullscreen && fullscreenInstance) {
    return fullscreenInstance;
  }
  const instance = createLoadingComponent({
    ...resolved,
    closed: () => {
      var _a;
      (_a = resolved.closed) == null ? void 0 : _a.call(resolved);
      if (resolved.fullscreen)
        fullscreenInstance = void 0;
    }
  });
  addStyle(resolved, resolved.parent, instance);
  addClassList(resolved, resolved.parent, instance);
  resolved.parent.vLoadingAddClassList = () => addClassList(resolved, resolved.parent, instance);
  let loadingNumber = resolved.parent.getAttribute("loading-number");
  if (!loadingNumber) {
    loadingNumber = "1";
  } else {
    loadingNumber = `${Number.parseInt(loadingNumber) + 1}`;
  }
  resolved.parent.setAttribute("loading-number", loadingNumber);
  resolved.parent.appendChild(instance.$el);
  nextTick(() => instance.visible.value = resolved.visible);
  if (resolved.fullscreen) {
    fullscreenInstance = instance;
  }
  return instance;
};
const resolveOptions = (options) => {
  var _a, _b, _c, _d;
  let target;
  if (isString(options.target)) {
    target = (_a = document.querySelector(options.target)) != null ? _a : document.body;
  } else {
    target = options.target || document.body;
  }
  return {
    parent: target === document.body || options.body ? document.body : target,
    background: options.background || "",
    svg: options.svg || "",
    svgViewBox: options.svgViewBox || "",
    spinner: options.spinner || false,
    text: options.text || "",
    fullscreen: target === document.body && ((_b = options.fullscreen) != null ? _b : true),
    lock: (_c = options.lock) != null ? _c : false,
    customClass: options.customClass || "",
    visible: (_d = options.visible) != null ? _d : true,
    target
  };
};
const addStyle = async (options, parent, instance) => {
  const { nextZIndex } = instance.vm.zIndex || instance.vm._.exposed.zIndex;
  const maskStyle = {};
  if (options.fullscreen) {
    instance.originalPosition.value = getStyle(document.body, "position");
    instance.originalOverflow.value = getStyle(document.body, "overflow");
    maskStyle.zIndex = nextZIndex();
  } else if (options.parent === document.body) {
    instance.originalPosition.value = getStyle(document.body, "position");
    await nextTick();
    for (const property of ["top", "left"]) {
      const scroll = property === "top" ? "scrollTop" : "scrollLeft";
      maskStyle[property] = `${options.target.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] - Number.parseInt(getStyle(document.body, `margin-${property}`), 10)}px`;
    }
    for (const property of ["height", "width"]) {
      maskStyle[property] = `${options.target.getBoundingClientRect()[property]}px`;
    }
  } else {
    instance.originalPosition.value = getStyle(parent, "position");
  }
  for (const [key, value] of Object.entries(maskStyle)) {
    instance.$el.style[key] = value;
  }
};
const addClassList = (options, parent, instance) => {
  const ns = instance.vm.ns || instance.vm._.exposed.ns;
  if (!["absolute", "fixed", "sticky"].includes(instance.originalPosition.value)) {
    addClass(parent, ns.bm("parent", "relative"));
  } else {
    removeClass(parent, ns.bm("parent", "relative"));
  }
  if (options.fullscreen && options.lock) {
    addClass(parent, ns.bm("parent", "hidden"));
  } else {
    removeClass(parent, ns.bm("parent", "hidden"));
  }
};
const INSTANCE_KEY = Symbol("ElLoading");
const createInstance = (el, binding) => {
  var _a, _b, _c, _d;
  const vm = binding.instance;
  const getBindingProp = (key) => isObject(binding.value) ? binding.value[key] : void 0;
  const resolveExpression = (key) => {
    const data = isString(key) && (vm == null ? void 0 : vm[key]) || key;
    if (data)
      return ref(data);
    else
      return data;
  };
  const getProp = (name) => resolveExpression(getBindingProp(name) || el.getAttribute(`element-loading-${hyphenate(name)}`));
  const fullscreen = (_a = getBindingProp("fullscreen")) != null ? _a : binding.modifiers.fullscreen;
  const options = {
    text: getProp("text"),
    svg: getProp("svg"),
    svgViewBox: getProp("svgViewBox"),
    spinner: getProp("spinner"),
    background: getProp("background"),
    customClass: getProp("customClass"),
    fullscreen,
    target: (_b = getBindingProp("target")) != null ? _b : fullscreen ? void 0 : el,
    body: (_c = getBindingProp("body")) != null ? _c : binding.modifiers.body,
    lock: (_d = getBindingProp("lock")) != null ? _d : binding.modifiers.lock
  };
  el[INSTANCE_KEY] = {
    options,
    instance: Loading(options)
  };
};
const updateOptions = (newOptions, originalOptions) => {
  for (const key of Object.keys(originalOptions)) {
    if (isRef(originalOptions[key]))
      originalOptions[key].value = newOptions[key];
  }
};
const vLoading = {
  mounted(el, binding) {
    if (binding.value) {
      createInstance(el, binding);
    }
  },
  updated(el, binding) {
    const instance = el[INSTANCE_KEY];
    if (binding.oldValue !== binding.value) {
      if (binding.value && !binding.oldValue) {
        createInstance(el, binding);
      } else if (binding.value && binding.oldValue) {
        if (isObject(binding.value))
          updateOptions(binding.value, instance.options);
      } else {
        instance == null ? void 0 : instance.instance.close();
      }
    }
  },
  unmounted(el) {
    var _a;
    (_a = el[INSTANCE_KEY]) == null ? void 0 : _a.instance.close();
  }
};
const ElLoading = {
  install(app) {
    app.directive("loading", vLoading);
    app.config.globalProperties.$loading = Loading;
  },
  directive: vLoading,
  service: Loading
};
const _sfc_main = /* @__PURE__ */ defineComponent({
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
var MessageBoxConstructor = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/message-box/src/index.vue"]]);
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
const getScrollTop = () => {
  return Math.ceil(document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
};
async function useScrollToBottom(delayMs = 0) {
  return await new Promise((resolve, reject) => {
    {
      resolve(null);
    }
  });
}
const device = {
  get isMobileScreen() {
    return window.innerWidth < 600;
  },
  get isTouchScreen() {
    return false;
  }
};
function useDevice() {
  return device;
}
const webBrowsing = "web-browsing";
const temperatureSuffix = "temperature-suffix";
const temperature$1 = "temperature";
const str = (obj) => {
  try {
    if ((obj == null ? void 0 : obj.toString) === void 0) {
      return `${obj}`;
    } else {
      const _str = obj.toString();
      return _str.startsWith("[object ") && _str.endsWith("]") ? JSON.stringify(obj) : _str;
    }
  } catch {
    return "";
  }
};
const lower = (o) => {
  return str(o).toLowerCase();
};
const BASE2_CHARSET = "01";
const BASE10_CHARSET$1 = "0123456789";
const BASE16_CHARSET$1 = "0123456789abcdef";
const BASE36_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";
const BASE62_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE64_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const BASE64WEB_CHARSET$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const getCharset$1 = (radix) => {
  if (typeof radix !== "string") {
    radix = lower(radix);
  }
  switch (radix) {
    case "2":
      return BASE2_CHARSET;
    case "10":
      return BASE10_CHARSET$1;
    case "16":
      return BASE16_CHARSET$1;
    case "36":
      return BASE36_CHARSET;
    case "62":
      return BASE62_CHARSET;
    case "64":
      return BASE64_CHARSET;
    case "64w":
    case "64+":
      return BASE64WEB_CHARSET$1;
    default:
      return radix;
  }
};
const convert$1 = (value, fromCharset, toCharset, minLen = 0) => {
  if (typeof value !== "string") {
    value = str(value);
  }
  let decimalValue = BigInt(0);
  fromCharset = getCharset$1(fromCharset);
  const baseFrom = fromCharset.length;
  for (let i = 0; i < value.length; i++) {
    decimalValue += BigInt(fromCharset.indexOf(value[i]) * Math.pow(baseFrom, value.length - 1 - i));
  }
  let result = "";
  toCharset = getCharset$1(toCharset);
  if (result === "") {
    const baseTo = BigInt(toCharset.length);
    while (decimalValue > 0) {
      result = toCharset.charAt(+BigInt(decimalValue % baseTo).toString()) + result;
      decimalValue = BigInt(decimalValue / baseTo);
    }
  }
  return (result === "" ? toCharset.charAt(0) : result).padStart(minLen, toCharset[0]);
};
const textToBase64$1 = (text) => {
  const input = text.split("").map((c) => c.charCodeAt(0));
  const output = [];
  let i = 0;
  while (i < input.length) {
    const [char1, char2 = 0, char3 = 0] = input.slice(i, i += 3);
    const triplet = (char1 << 16) + (char2 << 8) + char3;
    const char4 = triplet >> 18;
    const char5 = triplet >> 12 & 63;
    const char6 = triplet >> 6 & 63;
    const char7 = triplet & 63;
    output.push(BASE64_CHARSET[char4], BASE64_CHARSET[char5], BASE64_CHARSET[char6], BASE64_CHARSET[char7]);
  }
  const paddingLength = input.length % 3;
  return output.join("").slice(0, 1 + output.length - paddingLength) + (paddingLength === 2 ? "==" : paddingLength === 1 ? "=" : "");
};
const secureBase64RegEx = /[^A-Za-z0-9+/]/g;
const secureBase64$1 = (str2) => str2.replace(secureBase64RegEx, "");
const fromCharCode = (str2) => String.fromCharCode(+str2);
const base64ToText$1 = (str2) => {
  const input = secureBase64$1(str2).split("");
  const output = [];
  let i = 0;
  while (i < input.length) {
    const [char1, char2, char3, char4] = input.slice(i, i += 4).map((l) => BASE64_CHARSET.indexOf(l));
    output.push(fromCharCode(char1 << 2 | char2 >> 4));
    if (char3 !== 64) {
      output.push(fromCharCode((char2 & 15) << 4 | char3 >> 2));
    }
    if (char4 !== 64) {
      output.push(fromCharCode((char3 & 3) << 6 | char4));
    }
  }
  return output.join("").replaceAll("\0", "");
};
const baseConverter = {
  BASE2_CHARSET,
  BASE10_CHARSET: BASE10_CHARSET$1,
  BASE16_CHARSET: BASE16_CHARSET$1,
  BASE36_CHARSET,
  BASE62_CHARSET,
  BASE64_CHARSET,
  BASE64WEB_CHARSET: BASE64WEB_CHARSET$1,
  convert: convert$1,
  getCharset: getCharset$1,
  secureBase64: secureBase64$1,
  textToBase64: textToBase64$1,
  base64ToText: base64ToText$1
};
function sum(...args) {
  return args.reduce((a, b) => a + b, 0);
}
function isIterable(obj) {
  try {
    return typeof obj[Symbol == null ? void 0 : Symbol.iterator] === "function";
  } catch {
    return false;
  }
}
function safeStringify(obj) {
  const seenObjects = /* @__PURE__ */ new Set();
  const reviver = (_, value) => {
    if (typeof value === "object" && value !== null) {
      if (seenObjects.has(value)) {
        return void 0;
      }
      seenObjects.add(value);
      if (isIterable(value)) {
        value = [...value];
      }
    }
    return value;
  };
  return JSON.stringify(obj, reviver);
}
const sha256 = (message) => {
  return sha3(message, { outputLength: 256 }).toString();
};
const binaryStrRegex = /0b[0-1]+/i;
function toSeed(seed) {
  if (typeof seed === "number") {
    return Math.round(seed);
  } else if (seed instanceof Object) {
    seed = safeStringify(seed);
  }
  if (typeof seed === "string") {
    if (binaryStrRegex.test(seed)) {
      return parseInt(seed.substring(2, seed.length - 1), 2);
    }
    const num = parseInt(seed);
    if (Number.isNaN(num)) {
      return num;
    } else {
      return sum(parseInt(sha256(seed), 16));
    }
  } else {
    return Date.now();
  }
}
const N = 624;
const M = 397;
const MATRIX_A = 2567483615;
const UPPER_MASK = 2147483648;
const LOWER_MASK = 2147483647;
class MersenneTwister {
  /** @param {Number} [seed] */
  constructor(seed) {
    __publicField(this, "mt", new Array(N));
    __publicField(this, "mti", N + 1);
    __publicField(this, "seed");
    this.seed = seed = toSeed(seed);
    if (Array.isArray(seed)) {
      this.init_by_array(seed, seed.length);
    } else {
      this.init_seed(seed);
    }
    return this;
  }
  init_seed(s) {
    this.mt[0] = s >>> 0;
    for (this.mti = 1; this.mti < N; this.mti++) {
      s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
      this.mt[this.mti] = (((s & 4294901760) >>> 16) * 1812433253 << 16) + (s & 65535) * 1812433253 + this.mti;
      this.mt[this.mti] >>>= 0;
    }
  }
  init_by_array(initKey, keyLength) {
    let i, j, k;
    this.init_seed(19650218);
    i = 1;
    j = 0;
    k = N > keyLength ? N : keyLength;
    for (; k !== 0; k--) {
      const s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
      this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1664525 << 16) + (s & 65535) * 1664525) + initKey[j] + j;
      this.mt[i] >>>= 0;
      i++;
      j++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
      if (j >= keyLength) {
        j = 0;
      }
    }
    for (k = N - 1; k !== 0; k--) {
      const s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
      this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1566083941 << 16) + (s & 65535) * 1566083941) - i;
      this.mt[i] >>>= 0;
      i++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
    }
    this.mt[0] = 2147483648;
  }
  random_int() {
    let y;
    const mag01 = new Array(0, MATRIX_A);
    if (this.mti >= N) {
      let kk;
      if (this.mti === N + 1) {
        this.init_seed(5489);
      }
      for (kk = 0; kk < N - M; kk++) {
        y = this.mt[kk] & UPPER_MASK | this.mt[kk + 1] & LOWER_MASK;
        this.mt[kk] = this.mt[kk + M] ^ y >>> 1 ^ mag01[y & 1];
      }
      for (; kk < N - 1; kk++) {
        y = this.mt[kk] & UPPER_MASK | this.mt[kk + 1] & LOWER_MASK;
        this.mt[kk] = this.mt[kk + (M - N)] ^ y >>> 1 ^ mag01[y & 1];
      }
      y = this.mt[N - 1] & UPPER_MASK | this.mt[0] & LOWER_MASK;
      this.mt[N - 1] = this.mt[M - 1] ^ y >>> 1 ^ mag01[y & 1];
      this.mti = 0;
    }
    y = this.mt[this.mti++];
    y ^= y >>> 11;
    y ^= y << 7 & 2636928640;
    y ^= y << 15 & 4022730752;
    y ^= y >>> 18;
    return y >>> 0;
  }
  random_int31() {
    return this.random_int() >>> 1;
  }
  random_incl() {
    return this.random_int() * (1 / 4294967295);
  }
  random() {
    return this.random_int() * (1 / 4294967296);
  }
  random_excl() {
    return (this.random_int() + 0.5) * (1 / 4294967296);
  }
  random_long() {
    return ((this.random_int() >>> 5) * 67108864 + (this.random_int() >>> 6)) * (1 / 9007199254740992);
  }
}
function MT$1(seed) {
  return new MersenneTwister(seed);
}
const {
  BASE10_CHARSET,
  BASE16_CHARSET,
  BASE64WEB_CHARSET
} = baseConverter;
const _MT = MT$1();
const rand = (mt = _MT) => {
  return mt.random();
};
const randInt$1 = (start, end, mt) => {
  if (end === void 0 || end === 0) {
    end = start;
    start = 0;
  }
  return Math.floor(start + rand(mt) * end);
};
const choice = (array, mt) => {
  return array[randInt$1(0, array.length, mt)];
};
const choices = (array, amount = 1, mt) => {
  const result = [];
  const options = [];
  for (let i = 0; i < amount; i++) {
    if (options.length === 0) {
      options.push(...array);
    }
    result.push(options.splice(randInt$1(0, options.length, mt), 1)[0]);
  }
  return result;
};
const shuffle$1 = (array, mt) => {
  return choices(array, array.length, mt);
};
const charset = (charset2, len = 8, mt) => {
  return new Array(len).fill(0).map((_) => choice(charset2, mt)).join("");
};
const random = {
  MT: MT$1,
  toSeed,
  rand,
  randInt: randInt$1,
  charset,
  choice,
  choices,
  shuffle: shuffle$1,
  base10: (len = 6, mt) => {
    return charset(BASE10_CHARSET, len, mt);
  },
  base16: (len = 32, mt) => {
    return charset(BASE16_CHARSET, len, mt);
  },
  base64: (len = 32, mt) => {
    return charset(BASE64WEB_CHARSET, len, mt);
  },
  /** Linear Congruential Generator */
  lcg(_seed) {
    let seed = toSeed(_seed);
    return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  }
};
const { MT, shuffle, randInt } = random;
const { convert, getCharset } = baseConverter;
const maskingCharsetGenerator = (_charset, mt) => {
  const charset2 = shuffle(_charset, mt);
  return () => {
    charset2.push(charset2.shift());
    return charset2;
  };
};
const mask = (_string, charset2 = 16, level = 1, seed) => {
  const charsetNum = Number.isNaN(+charset2) ? 64 : +charset2;
  const realCharset = getCharset(charset2);
  const seed1 = toSeed(seed !== void 0 ? seed : randInt(0, charsetNum));
  const mt1 = MT(seed1);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1e6, mt1)));
  const characters = typeof _string === "string" ? _string.split("") : _string;
  const result = [
    seed !== void 0 ? realCharset[randInt(0, charsetNum)] : convert(seed1, 10, charset2),
    ...characters.map((char) => generator()[realCharset.indexOf(char)])
  ];
  if (--level < 1) {
    return result.join("");
  }
  return mask(result, charset2, level, seed);
};
const unmask = (string, charset2 = 16, level = 1, seed) => {
  const realCharset = getCharset(charset2);
  const seed1 = toSeed(seed !== void 0 ? seed : +convert(string[0], charset2, 10));
  const mt1 = MT(seed1);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1e6, mt1)));
  const characters = (typeof string === "string" ? string.split("") : string).slice(1, string.length);
  const result = characters.map((char) => realCharset[generator().indexOf(char)]);
  if (--level < 1) {
    return result.join("");
  }
  return unmask(result, charset2, level, seed);
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
function d(input, maskLevel = 1, seed, tryParseJSON = true) {
  input = base64ToText(unmask(input, 64, maskLevel, seed));
  if (!tryParseJSON) {
    return input;
  }
  try {
    return JSON.parse(input);
  } catch (err) {
    return input;
  }
}
function h(input, algorithm = 512, seed) {
  const encrypted = e(input, 1, seed).substring(1);
  if (algorithm === "MD5") {
    return md5(encrypted).toString();
  }
  return sha3(encrypted, { outputLength: algorithm }).toString();
}
const troll = { e, d, h };
const customErrorCodes = /* @__PURE__ */ new Map([
  ["THINKING", "Please wait, I am answering another question..."]
]);
function validKeyValuePair(key, value) {
  switch (key) {
    case "model":
      if (["gpt3", "gpt4", "gpt-web", "claude-2-web", "gpt3-fga"].includes(value)) {
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
const focusInput = () => {
  try {
    document.querySelector(".InputBox textarea").focus();
  } catch {
  }
};
const checkTokenAndGetConversations = () => {
  return new Promise((resolve, reject) => {
    $fetch("/api/curva/check", { method: "POST" }).then((_conversations) => {
      const { list, saved } = _conversations;
      conversations.value = list.sort().map((id) => {
        var _a, _b, _c;
        return {
          id,
          name: (_a = saved[id]) == null ? void 0 : _a.name,
          config: ((_b = saved[id]) == null ? void 0 : _b.config) || "",
          mtime: ((_c = saved[id]) == null ? void 0 : _c.mtime) || ""
        };
      });
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
        done: Boolean(msg.A)
      })));
    } catch {
      navigateTo("/c/");
      resolve([]);
    }
  });
};
const _fetchSuggestions = async function(question) {
  return await $fetch("/api/curva/suggestions", { method: "POST", body: { question } });
};
const _loadSuggestions = async () => {
  try {
    const lastMessage = messages.value.at(-1);
    const suggestions = await _fetchSuggestions(lastMessage.Q);
    const isAtBottom = getScrollTop() >= document.body.clientHeight;
    lastMessage.more = suggestions;
    if (isAtBottom) {
      useScrollToBottom();
    }
  } catch (err) {
    console.error(err);
  }
};
let nuxtApp;
const model = ref("gpt4");
const contextMode = ref(true);
const temperature = ref(0.5);
const messages = ref([]);
const conversations = ref([]);
const resetConvConfig = () => {
  model.value = "gpt4";
  contextMode.value = true;
  temperature.value = 0.5;
};
resetConvConfig();
const openMenu = ref(false);
const openSidebar = ref(openMenu.value);
const openDrawer = ref(openMenu.value);
const inputValue = ref("");
const createRequest = (() => {
  const { h: createHash } = troll;
  const getHashType = () => [77, 68, 53].map((c) => String.fromCharCode(c)).join("");
  const createHeaders = (messages2, t) => ({
    hash: createHash(messages2, getHashType(), t),
    timestamp: str(t)
  });
  const createBody = (messages2, model2, temperature2, t, tz, regenerateId) => {
    let conv = getCurrentConvId();
    if (!conv) {
      conv = random.base64(8);
      conversations.value.push({ id: conv, name: void 0 });
      navigateTo(`/c/${conv}?feature=new`);
    }
    return { conv, messages: messages2, model: model2, temperature: temperature2, t, tz, id: regenerateId };
  };
  return (regenerateId) => {
    var _a;
    const date = /* @__PURE__ */ new Date();
    const t = date.getTime();
    const tz = date.getTimezoneOffset() / 60 * -1;
    let formattedMessages = contextMode.value ? messages.value.map((message) => {
      const { Q, A } = message;
      if (Q) {
        if (A) {
          return [{ role: "user", content: Q }, { role: "assistant", content: A }];
        }
        return [{ role: "user", content: Q }];
      } else if (A) {
        return [{ role: "assistant", content: A }];
      }
      return [];
    }).flat() : [{ role: "user", content: ((_a = messages.value.at(-1)) == null ? void 0 : _a.Q) || "" }];
    formattedMessages = formattedMessages.slice(formattedMessages.length - 100);
    const body = createBody(formattedMessages, model.value, temperature.value, t, tz, regenerateId);
    const headers = createHeaders(formattedMessages, t);
    return $fetch("/api/curva/answer", { method: "POST", headers, body });
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
const getCurrentConvId = () => {
  var _a, _b;
  return (_b = (_a = nuxtApp._route) == null ? void 0 : _a.params) == null ? void 0 : _b.conv;
};
const getCurrentConvName = () => {
  var _a;
  const currentConvId = getCurrentConvId();
  return ((_a = conversations.value.filter((conv) => conv.id === currentConvId)[0]) == null ? void 0 : _a.name) || "";
};
async function updateConversation(id, newname) {
  return await $fetch("/api/curva/conv", {
    method: "PUT",
    body: {
      id: id || getCurrentConvId(),
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
  var _a;
  if (convId === void 0) {
    convId = getCurrentConvId();
  }
  if (convId === void 0 || convId === null) {
    return;
  }
  const config = parseConvConfig(((_a = conversations.value.filter((conv) => conv.id === convId)[0]) == null ? void 0 : _a.config) || "");
  const keys = Object.keys(config);
  if (keys.length === 0) {
    resetConvConfig();
  } else {
    try {
      for (const key of keys) {
        const value = config[key];
        switch (key) {
          case "model":
            model.value = value;
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
const deleteMessage = (base64MessageId) => {
  messages.value = messages.value.filter((msg) => msg.id !== base64MessageId);
  $fetch("/api/curva/answer", {
    method: "DELETE",
    body: {
      conv: getCurrentConvId(),
      id: base64MessageId
    }
  }).then(() => ElMessage.info("The message has been deleted.")).catch(() => ElMessage.error("An error occurred while deleting the message."));
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
  downloadTextFile(`${baseConverter.convert(getCurrentConvId(), "64w", 10)}.json`, JSON.stringify(messages.value.map((msg) => ({
    question: msg.Q,
    answer: msg.A,
    created: new Date(msg.t.getTime()).toUTCString(),
    timeUsed: msg.dt || void 0,
    queries: msg.queries || void 0,
    urls: msg.urls || void 0
  })), null, 4));
};
function useChat() {
  const appName = useState("appName").value;
  const cookie = useUniCookie();
  const previousTemperature = +(cookie.has(temperature$1) ? cookie.get(temperature$1) : 0.5);
  cookie.delete(webBrowsing, { path: "/" });
  cookie.delete(webBrowsing);
  cookie.delete(temperatureSuffix, { path: "/" });
  cookie.delete(temperatureSuffix);
  if (previousTemperature >= 0 && previousTemperature <= 1) {
    temperature.value = previousTemperature;
  }
  watch(temperature, (newValue) => {
    temperature.value = Math.round(newValue * 10) / 10;
    cookie.set(temperature$1, `${newValue}`, {
      path: "/"
    });
  });
  nuxtApp = useNuxtApp();
  watch(openMenu, (value) => {
    if (useDevice().isMobileScreen) {
      openSidebar.value = false;
      if (openDrawer.value !== value) {
        openDrawer.value = value;
      }
    } else {
      openDrawer.value = false;
      if (openSidebar.value !== value) {
        openSidebar.value = value;
      }
    }
    setTimeout(() => {
      try {
        focusInput();
      } catch {
      }
    }, 0);
  });
  watch(openDrawer, (value) => {
    openMenu.value = value;
  });
  watch(openSidebar, (value) => {
    openMenu.value = value;
  });
  const _loadChat = async (conv) => {
    if (useDevice().isMobileScreen) {
      openMenu.value = false;
    }
    messages.value = [];
    const loading = ElLoading.service();
    try {
      const archived = await Promise.all([
        conv === null && conversations.value.length > 0 ? null : checkTokenAndGetConversations(),
        conv === null ? null : _fetchHistory(conv)
      ]);
      loadConvConfig(conv);
      const displayChatMessages = archived[1];
      if (displayChatMessages !== null && getCurrentConvId() === conv) {
        messages.value = displayChatMessages;
        _loadSuggestions();
      }
    } finally {
      try {
        useTitle(`${getCurrentConvName() || "Chat"} - ${appName}`);
      } catch {
        useTitle(`Chat - ${appName}`);
      }
      useScrollToBottom();
      if (loading !== null) {
        try {
          await useScrollToBottom(500);
        } finally {
          loading.close();
          try {
            await useScrollToBottom(500);
          } finally {
          }
        }
      }
    }
    setTimeout(() => focusInput(), 500);
  };
  const loadChat = async (conv, isNew = false) => {
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
  const sendMessage = (forceMessage, regenerateId) => {
    const loadingMessagesAmount = document.querySelectorAll(".Message.T").length;
    if (loadingMessagesAmount > 0) {
      ElMessage.info("Thinking too many questions.");
      return false;
    }
    const _messageText = forceMessage === void 0 ? inputValue.value : forceMessage;
    const messageText = _messageText.trim();
    if (_messageText === inputValue.value) {
      inputValue.value = "";
      if (messageText === "") {
        return false;
      }
    }
    const message = createMessage(messageText, "", false);
    messages.value.push(message);
    useScrollToBottom();
    setTimeout(() => {
      focusInput();
    }, 500);
    const more = _fetchSuggestions(messageText);
    createRequest(regenerateId).then((res) => {
      const isAtBottom = getScrollTop() >= document.body.clientHeight;
      const id = res.id;
      const answer = res.answer;
      const error = res.error;
      const urls = res.urls;
      const queries = res.queries;
      const dt = res.dt;
      const _version = res.version;
      if (id) {
        message.id = id;
      }
      if (!answer) {
        if (error) {
          const msgIndex = messages.value.indexOf(message);
          switch (error) {
            case "THINKING":
              messages.value.splice(msgIndex, 1);
              ElMessage.warning(customErrorCodes.get(error));
              inputValue.value = messageText;
              return;
            default:
              throw error;
          }
        }
        throw _t("error.plzRefresh");
      }
      message.A = answer;
      message.urls = urls || [];
      message.queries = queries || [];
      message.dt = dt || void 0;
      if (_version !== version.value) {
        ElMessageBox.confirm(
          _t("action.newVersion"),
          _t("message.notice"),
          {
            confirmButtonText: _t("message.ok"),
            cancelButtonText: _t("message.cancel"),
            type: "warning"
          }
        ).then(() => {
          location.reload();
        }).finally(() => {
          focusInput();
        });
      }
      if (isAtBottom) {
        useScrollToBottom();
      }
      more.then((more2) => {
        const isAtBottom2 = getScrollTop() >= document.body.clientHeight;
        message.more = more2;
        if (isAtBottom2) {
          useScrollToBottom();
        }
      }).catch(() => {
      });
    }).catch((err) => {
      ElMessage.error(err || "Oops! Something went wrong!");
      message.A = "Oops! Something went wrong!";
    }).finally(() => {
      message.done = true;
      message.t = /* @__PURE__ */ new Date();
    });
    return true;
  };
  const regenerateMessage = async () => {
    const lastMessage = messages.value.pop();
    if (lastMessage === void 0) {
      return;
    }
    if (!sendMessage(lastMessage.Q, lastMessage.id)) {
      messages.value.push(lastMessage);
    }
  };
  const refreshConversation = () => {
    loadChat(getCurrentConvId());
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
        try {
          useTitle(`${getCurrentConvName() || "Chat"} - ${appName}`);
        } catch {
          useTitle(`Chat - ${appName}`);
        }
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
    var _a, _b;
    const id = targetConvId ? targetConvId : getCurrentConvId();
    const _conversations = [...conversations.value];
    let currentConvIndex = -1;
    let nextConvId = "createNewChat";
    for (let i = 0; i < _conversations.length; i++) {
      if (_conversations[i].id === id) {
        currentConvIndex = i;
        break;
      }
    }
    if (currentConvIndex !== -1) {
      const beforeConv = (_a = _conversations[currentConvIndex - 1]) == null ? void 0 : _a.id;
      const afterConv = (_b = _conversations[currentConvIndex + 1]) == null ? void 0 : _b.id;
      if (beforeConv !== void 0) {
        nextConvId = beforeConv;
      } else if (afterConv !== void 0) {
        nextConvId = afterConv;
      }
    }
    ElMessageBox.confirm(
      _t("message.deleteConvConfirm"),
      _t("message.warning"),
      {
        confirmButtonText: _t("message.ok"),
        cancelButtonText: _t("message.cancel"),
        type: "warning"
      }
    ).then(() => {
      const loading = ElLoading.service();
      $fetch("/api/curva/conv", {
        method: "DELETE",
        body: { id }
      }).finally(async () => {
        var _a2;
        loading.close();
        if (targetConvId === getCurrentConvId()) {
          (_a2 = document.getElementById(nextConvId)) == null ? void 0 : _a2.click();
        } else {
          await checkTokenAndGetConversations();
        }
      });
    });
  };
  return {
    model,
    conversations,
    messages,
    temperature,
    contextMode,
    openMenu,
    openSidebar,
    openDrawer,
    inputValue,
    getCurrentConvId,
    getCurrentConvName,
    checkTokenAndGetConversations,
    loadChat,
    sendMessage,
    deleteMessage,
    regenerateMessage,
    focusInput,
    refreshConversation,
    renameConversation,
    deleteConversation,
    resetConvConfig,
    exportAsMarkdown,
    exportAsJson,
    clear
  };
}

export { ElLoading as E, useChat as u };
//# sourceMappingURL=useChat-92b3a945.mjs.map
