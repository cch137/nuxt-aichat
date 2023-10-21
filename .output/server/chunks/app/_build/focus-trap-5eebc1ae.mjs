import { isClient } from '@vueuse/core';
import { x as componentSizes, _ as _export_sfc } from './index-965dbacb.mjs';
import { ref, defineComponent, provide, watch, unref, renderSlot } from 'vue';
import { isNil } from 'lodash-unified';
import { E as EVENT_CODE } from './aria-30c2b077.mjs';

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
function scrollIntoView(container, selected) {
  if (!isClient)
    return;
  if (!selected) {
    container.scrollTop = 0;
    return;
  }
  const offsetParents = [];
  let pointer = selected.offsetParent;
  while (pointer !== null && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = pointer.offsetParent;
  }
  const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
  const bottom = top + selected.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;
  if (top < viewRectTop) {
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}
const isValidComponentSize = (val) => ["", ...componentSizes].includes(val);
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
  const first = getVisibleElement(focusable, container);
  const last = getVisibleElement(focusable.reverse(), container);
  return [first, last];
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
const _sfc_main = /* @__PURE__ */ defineComponent({
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
    const onKeydown = (e) => {
      if (!props.loop && !props.trapped)
        return;
      const { key, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e;
      const { loop } = props;
      const isTabbing = key === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;
      const currentFocusingEl = document.activeElement;
      if (isTabbing && currentFocusingEl) {
        const container = currentTarget;
        const [first, last] = getEdges(container);
        const isTabbable = first && last;
        if (!isTabbable) {
          if (currentFocusingEl === container) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason2.value
            });
            emit("focusout-prevented", focusoutPreventedEvent);
            if (!focusoutPreventedEvent.defaultPrevented) {
              e.preventDefault();
            }
          }
        } else {
          if (!shiftKey && currentFocusingEl === last) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason2.value
            });
            emit("focusout-prevented", focusoutPreventedEvent);
            if (!focusoutPreventedEvent.defaultPrevented) {
              e.preventDefault();
              if (loop)
                tryFocus(first, true);
            }
          } else if (shiftKey && [first, container].includes(currentFocusingEl)) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason2.value
            });
            emit("focusout-prevented", focusoutPreventedEvent);
            if (!focusoutPreventedEvent.defaultPrevented) {
              e.preventDefault();
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
    const onFocusIn = (e) => {
      const trapContainer = unref(forwardRef);
      if (!trapContainer)
        return;
      const target = e.target;
      const relatedTarget = e.relatedTarget;
      const isFocusedInTrap = target && trapContainer.contains(target);
      if (!props.trapped) {
        relatedTarget && trapContainer.contains(relatedTarget);
      }
      if (isFocusedInTrap)
        emit("focusin", e);
      if (props.trapped) {
        if (isFocusedInTrap) {
          lastFocusAfterTrapped = target;
        } else {
          tryFocus(lastFocusAfterTrapped, true);
        }
      }
    };
    const onFocusOut = (e) => {
      const trapContainer = unref(forwardRef);
      if (!trapContainer)
        return;
      if (props.trapped) {
        const relatedTarget = e.relatedTarget;
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
        const target = e.target;
        const isFocusedInTrap = target && trapContainer.contains(target);
        if (!isFocusedInTrap)
          emit("focusout", e);
      }
    };
    return {
      onKeydown
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
}
var ElFocusTrap = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/focus-trap/src/focus-trap.vue"]]);

export { ElFocusTrap as E, getScrollBarWidth as g, isValidComponentSize as i, scrollIntoView as s };
//# sourceMappingURL=focus-trap-5eebc1ae.mjs.map
