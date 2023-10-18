import { E as ElSelect, a as ElOption } from './index-a7ba4dff.mjs';
import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, unref, createBlock, withCtx, resolveDynamicComponent, createCommentVNode, renderSlot, useSSRContext, ref, mergeProps, isRef, Fragment, renderList, createTextVNode, toDisplayString } from 'vue';
import { b as buildProps, E as ElIcon, w as withInstall, i as iconPropType, _ as _export_sfc$1 } from './index-34341092.mjs';
import { f as useNamespace, _ as _export_sfc, d as useState } from '../server.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import '@vueuse/core';
import '@popperjs/core';
import './index-367a892e.mjs';
import 'lodash-unified';
import '@vue/shared';
import './aria-30c2b077.mjs';
import './focus-trap-80286605.mjs';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'cookie';
import 'vue-i18n';
import 'crypto-js/sha3.js';
import 'prismjs';
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
import 'http-graceful-shutdown';

const linkProps = buildProps({
  type: {
    type: String,
    values: ["primary", "success", "warning", "info", "danger", "default"],
    default: "default"
  },
  underline: {
    type: Boolean,
    default: true
  },
  disabled: { type: Boolean, default: false },
  href: { type: String, default: "" },
  icon: {
    type: iconPropType
  }
});
const linkEmits = {
  click: (evt) => evt instanceof MouseEvent
};
const _hoisted_1 = ["href"];
const __default__ = /* @__PURE__ */ defineComponent({
  name: "ElLink"
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...__default__,
  props: linkProps,
  emits: linkEmits,
  setup(__props, { emit }) {
    const props = __props;
    const ns = useNamespace("link");
    const linkKls = computed(() => [
      ns.b(),
      ns.m(props.type),
      ns.is("disabled", props.disabled),
      ns.is("underline", props.underline && !props.disabled)
    ]);
    function handleClick(event) {
      if (!props.disabled)
        emit("click", event);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        class: normalizeClass(unref(linkKls)),
        href: _ctx.disabled || !_ctx.href ? void 0 : _ctx.href,
        onClick: handleClick
      }, [
        _ctx.icon ? (openBlock(), createBlock(unref(ElIcon), { key: 0 }, {
          default: withCtx(() => [
            (openBlock(), createBlock(resolveDynamicComponent(_ctx.icon)))
          ]),
          _: 1
        })) : createCommentVNode("v-if", true),
        _ctx.$slots.default ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(unref(ns).e("inner"))
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2)) : createCommentVNode("v-if", true),
        _ctx.$slots.icon ? renderSlot(_ctx.$slots, "icon", { key: 2 }) : createCommentVNode("v-if", true)
      ], 10, _hoisted_1);
    };
  }
});
var Link = /* @__PURE__ */ _export_sfc$1(_sfc_main$1, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/link/src/link.vue"]]);
const ElLink = withInstall(Link);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ls",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedFilename = ref("");
    const lsList = ref([]);
    const lsTree = ref([]);
    async function fetchTree() {
      const tree = [];
      const res = await (await fetch(`https://api.cch137.link/ls/${selectedFilename.value}`)).json();
      function getChapterProblems(chapter) {
        for (const chap of tree) {
          if (chap.chapter === chapter) {
            return chap.problems;
          }
        }
        const problems = [];
        tree.push({ chapter, problems });
        return problems;
      }
      for (const item of res) {
        const [_, chapter, problem] = item.isbn_c_p.split("_");
        getChapterProblems(chapter).push({ p: problem, link: item.link });
      }
      lsTree.value = tree;
    }
    const appName = useState("appName");
    useTitle(`LS - ${appName.value}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_select = ElSelect;
      const _component_el_option = ElOption;
      const _component_el_link = ElLink;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8 flex-col gap-4 flex-center" }, _attrs))} data-v-1eda4a45><h1 class="m-0" data-v-1eda4a45>LS</h1><div class="px-4 w-full max-w-prose flex flex-col gap-4 justify-center" data-v-1eda4a45>`);
      _push(ssrRenderComponent(_component_el_select, {
        modelValue: unref(selectedFilename),
        "onUpdate:modelValue": ($event) => isRef(selectedFilename) ? selectedFilename.value = $event : null,
        onChange: ($event) => fetchTree()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(lsList), (item) => {
              _push2(ssrRenderComponent(_component_el_option, {
                key: item,
                label: item.replaceAll(".json", ""),
                value: item
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(lsList), (item) => {
                return openBlock(), createBlock(_component_el_option, {
                  key: item,
                  label: item.replaceAll(".json", ""),
                  value: item
                }, null, 8, ["label", "value"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="pb-20" data-v-1eda4a45><!--[-->`);
      ssrRenderList(unref(lsTree), (chap) => {
        _push(`<details data-v-1eda4a45><summary class="chapter-title" data-v-1eda4a45>${ssrInterpolate(chap.chapter)}</summary><div class="flex flex-wrap gap-2 pl-4 pt-2 pb-4" data-v-1eda4a45><!--[-->`);
        ssrRenderList(chap.problems, (prob) => {
          _push(ssrRenderComponent(_component_el_link, {
            href: prob.link,
            target: "_blank"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(prob.p)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(prob.p), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></details>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/ls.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ls = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1eda4a45"]]);

export { ls as default };
//# sourceMappingURL=ls-164f6b99.mjs.map
