import { defineComponent, shallowRef, ref, computed, watch, watchEffect, openBlock, createElementBlock, normalizeClass, unref, normalizeStyle, createElementVNode, renderSlot, useSSRContext, withCtx, isRef, createTextVNode, createVNode } from 'vue';
import { useWindowSize, useElementBounding, useEventListener } from '@vueuse/core';
import { b as buildProps, n as addUnit, w as withInstall, d as definePropType, o as isNumber, p as isBoolean, C as CHANGE_EVENT, _ as _export_sfc, E as ElMessage, f as ElInput, e as ElButton } from './index-e055d37d.mjs';
import { b as useNamespace, u as useState } from '../server.mjs';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as __nuxt_component_0$1 } from './client-only-29ef7f45.mjs';
import 'lodash-unified';
import '@vue/shared';
import '@ctrl/tinycolor';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'h3';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'ufo';
import 'cookie';
import 'vue-i18n';
import 'defu';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';

const affixProps = buildProps({
  zIndex: {
    type: definePropType([Number, String]),
    default: 100
  },
  target: {
    type: String,
    default: ""
  },
  offset: {
    type: Number,
    default: 0
  },
  position: {
    type: String,
    values: ["top", "bottom"],
    default: "top"
  }
});
const affixEmits = {
  scroll: ({ scrollTop, fixed }) => isNumber(scrollTop) && isBoolean(fixed),
  [CHANGE_EVENT]: (fixed) => isBoolean(fixed)
};
const COMPONENT_NAME = "ElAffix";
const __default__ = /* @__PURE__ */ defineComponent({
  name: COMPONENT_NAME
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  ...__default__,
  props: affixProps,
  emits: affixEmits,
  setup(__props, { expose, emit }) {
    const props = __props;
    const ns = useNamespace("affix");
    const target = shallowRef();
    const root = shallowRef();
    const scrollContainer = shallowRef();
    const { height: windowHeight } = useWindowSize();
    const {
      height: rootHeight,
      width: rootWidth,
      top: rootTop,
      bottom: rootBottom,
      update: updateRoot
    } = useElementBounding(root, { windowScroll: false });
    const targetRect = useElementBounding(target);
    const fixed = ref(false);
    const scrollTop = ref(0);
    const transform = ref(0);
    const rootStyle = computed(() => {
      return {
        height: fixed.value ? `${rootHeight.value}px` : "",
        width: fixed.value ? `${rootWidth.value}px` : ""
      };
    });
    const affixStyle = computed(() => {
      if (!fixed.value)
        return {};
      const offset = props.offset ? addUnit(props.offset) : 0;
      return {
        height: `${rootHeight.value}px`,
        width: `${rootWidth.value}px`,
        top: props.position === "top" ? offset : "",
        bottom: props.position === "bottom" ? offset : "",
        transform: transform.value ? `translateY(${transform.value}px)` : "",
        zIndex: props.zIndex
      };
    });
    const update = () => {
      if (!scrollContainer.value)
        return;
      scrollTop.value = scrollContainer.value instanceof Window ? document.documentElement.scrollTop : scrollContainer.value.scrollTop || 0;
      if (props.position === "top") {
        if (props.target) {
          const difference = targetRect.bottom.value - props.offset - rootHeight.value;
          fixed.value = props.offset > rootTop.value && targetRect.bottom.value > 0;
          transform.value = difference < 0 ? difference : 0;
        } else {
          fixed.value = props.offset > rootTop.value;
        }
      } else if (props.target) {
        const difference = windowHeight.value - targetRect.top.value - props.offset - rootHeight.value;
        fixed.value = windowHeight.value - props.offset < rootBottom.value && windowHeight.value > targetRect.top.value;
        transform.value = difference < 0 ? -difference : 0;
      } else {
        fixed.value = windowHeight.value - props.offset < rootBottom.value;
      }
    };
    const handleScroll = () => {
      updateRoot();
      emit("scroll", {
        scrollTop: scrollTop.value,
        fixed: fixed.value
      });
    };
    watch(fixed, (val) => emit("change", val));
    useEventListener(scrollContainer, "scroll", handleScroll);
    watchEffect(update);
    expose({
      update,
      updateRoot
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "root",
        ref: root,
        class: normalizeClass(unref(ns).b()),
        style: normalizeStyle(unref(rootStyle))
      }, [
        createElementVNode("div", {
          class: normalizeClass({ [unref(ns).m("fixed")]: fixed.value }),
          style: normalizeStyle(unref(affixStyle))
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 6)
      ], 6);
    };
  }
});
var Affix = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/affix/src/affix.vue"]]);
const ElAffix = withInstall(Affix);
const _sfc_main$1 = {
  __name: "AdminHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const key = ref("");
    const tree = useState("tree", () => []);
    let fetching = false;
    const buildTree = () => {
      if (fetching) {
        return;
      }
      fetching = true;
      $fetch("/api/perspective/messages", {
        method: "POST",
        body: {
          key: key.value
        }
      }).then((res) => {
        const _res = [];
        for (const item of res) {
          const _conv = [];
          for (const _c of item == null ? void 0 : item.conv) {
            _conv.push(...[
              {
                label: `CONV: ${_c.conv}
`,
                children: []
              },
              {
                label: `QUESTION: ${_c.Q}
`,
                children: []
              },
              {
                label: `ANSWER: ${_c.A}
`,
                children: []
              }
            ]);
          }
          _res.push({ label: item == null ? void 0 : item.user, children: _conv });
        }
        tree.value = _res;
      }).catch(ElMessage.error).finally(() => {
        fetching = false;
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_affix = ElAffix;
      const _component_el_input = ElInput;
      const _component_el_button = ElButton;
      _push(ssrRenderComponent(_component_el_affix, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="PageHeader w-full px-4 gap-4 flex items-stretch"${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_el_input, {
              modelValue: unref(key),
              "onUpdate:modelValue": ($event) => isRef(key) ? key.value = $event : null,
              placeholder: "Secret"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_el_button, { onClick: buildTree }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Go`);
                } else {
                  return [
                    createTextVNode("Go")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "PageHeader w-full px-4 gap-4 flex items-stretch" }, [
                createVNode("div", null, [
                  createVNode(_component_el_input, {
                    modelValue: unref(key),
                    "onUpdate:modelValue": ($event) => isRef(key) ? key.value = $event : null,
                    placeholder: "Secret"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", null, [
                  createVNode(_component_el_button, { onClick: buildTree }, {
                    default: withCtx(() => [
                      createTextVNode("Go")
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main$1;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "perspective",
  __ssrInlineRender: true,
  setup(__props) {
    useState("tree", () => []);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminHeader = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_AdminHeader, null, null, _parent));
      _push(`<div class="px-4 py-8">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/perspective.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=perspective-dca15fc0.mjs.map
