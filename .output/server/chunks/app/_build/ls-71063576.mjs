import { E as ElSelect, a as ElOption } from './index-11a8230f.mjs';
import { E as ElLink } from './index-1a8df0f7.mjs';
import { _ as _export_sfc, e as useState, r as random } from '../server.mjs';
import { useSSRContext, defineComponent, ref, mergeProps, unref, isRef, withCtx, openBlock, createBlock, Fragment, renderList, createTextVNode, toDisplayString } from 'vue';
import { E as ElLoading } from './index-d1178361.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { E as ElMessage } from './index-06917876.mjs';
import '@vueuse/core';
import '@popperjs/core';
import './index-fa6727cb.mjs';
import 'lodash-unified';
import './index-036fcace.mjs';
import '@vue/shared';
import './aria-30c2b077.mjs';
import './use-global-config-65a30ca3.mjs';
import './focus-trap-4a5f0f0d.mjs';
import './index-2b5c388d.mjs';
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

const _useLoadingLock = () => {
  const getScrollTop = () => {
    if ("pageYOffset" in window) {
      return window.pageYOffset;
    }
    if ("scrollTop" in document.documentElement) {
      return document.documentElement.scrollTop;
    }
    if ("scrollTop" in document.body) {
      return document.body.scrollTop;
    }
    return 0;
  };
  let isScrollDisable = false;
  let scrollTopWhenDisable = 0;
  const disableScrollListener = () => {
    document.documentElement.scrollTop = scrollTopWhenDisable;
  };
  const lock = {
    lock() {
      if (isScrollDisable) {
        return;
      }
      scrollTopWhenDisable = getScrollTop();
      document.addEventListener("scroll", disableScrollListener);
      isScrollDisable = true;
      document.body.classList.add("loading-lock");
    },
    unlock() {
      document.removeEventListener("scroll", disableScrollListener);
      isScrollDisable = false;
      document.body.classList.remove("loading-lock");
    }
  };
  return lock;
};
function useElLoading(options = {}) {
  if (typeof options === "string") {
    options = {
      text: options
    };
  }
  const isLock = (options == null ? void 0 : options.lock) === void 0 || (options == null ? void 0 : options.lock) === null ? true : options.lock;
  const lock = isLock ? _useLoadingLock() : null;
  if (lock !== null) {
    lock.lock();
  }
  const loadingInstance = ElLoading.service(options);
  const { close: closeLoading } = loadingInstance;
  loadingInstance.close = () => {
    if (lock !== null) {
      lock.unlock();
    }
    closeLoading();
  };
  return loadingInstance;
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ls",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedFilename = ref("");
    const lsList = ref([]);
    const lsTree = ref([]);
    function back() {
      if (history.length > 1) {
        history.back();
      } else {
        ElMessage.info(random.choice([
          "Oh~dear, you shouldn't click this.",
          "Back? Where do you want to go?",
          "I don't want you to go anywhere else.",
          "Stay here!",
          "You are lost."
        ]));
      }
    }
    async function fetchTree() {
      const tree = [];
      lsTree.value = [];
      const loading = useElLoading();
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
      loading.close();
    }
    const appName = useState("appName");
    useTitle(`LS - ${appName.value}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_select = ElSelect;
      const _component_el_option = ElOption;
      const _component_el_link = ElLink;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8 flex-col gap-4 flex-center" }, _attrs))} data-v-47dd5703><h1 class="m-0" data-v-47dd5703>LS</h1><div class="px-4 w-full max-w-prose flex flex-col gap-4 justify-center" data-v-47dd5703>`);
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
      _push(`<div class="pb-16" data-v-47dd5703><!--[-->`);
      ssrRenderList(unref(lsTree), (chap) => {
        _push(`<details data-v-47dd5703><summary class="chapter-title" data-v-47dd5703>${ssrInterpolate(chap.chapter)}</summary><div class="flex flex-wrap gap-2 pl-4 pt-2 pb-4" data-v-47dd5703><!--[-->`);
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
      _push(`<!--]--></div><div class="flex-center pb-16" data-v-47dd5703>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/ls.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ls = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-47dd5703"]]);

export { ls as default };
//# sourceMappingURL=ls-71063576.mjs.map