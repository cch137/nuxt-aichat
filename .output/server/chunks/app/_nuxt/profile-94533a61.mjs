import { E as ElInput } from './index-2c3bf239.mjs';
import { E as ElButton } from './index-2f37e1b5.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-744fccd2.mjs';
import { _ as __nuxt_component_0$1 } from './client-only-29ef7f45.mjs';
import { b as useLocale, d as useState, _ as _export_sfc } from '../server.mjs';
import { defineComponent, ref, watch, mergeProps, unref, isRef, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-1e3a0d84.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import '@vueuse/core';
import 'lodash-unified';
import './index-2fec569f.mjs';
import '@vue/shared';
import './index-7b40ad86.mjs';
import '@ctrl/tinycolor';
import 'ufo';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'cookie';
import 'vue-i18n';
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

const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_ClientOnly = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-2" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CommonSettings.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const i18n = useLocale();
    const _t = i18n.t;
    const { email, username, changeUsername } = useAuth();
    const usernameIsNotSaved = ref(false);
    const usernameIsSaving = ref(false);
    const newUsername = ref(username.value);
    const saveUsername = async () => {
      usernameIsSaving.value = true;
      try {
        const isChanged = await changeUsername(newUsername.value);
        usernameIsNotSaved.value = !isChanged;
        if (isChanged) {
          newUsername.value = username.value;
        }
      } finally {
        usernameIsSaving.value = false;
      }
    };
    watch(newUsername, (value) => {
      usernameIsNotSaved.value = value !== username.value;
    });
    useTitle(`${_t("auth.profile")} - ${useState("appName").value}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_input = ElInput;
      const _component_el_button = ElButton;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CommonSettings = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "flex-col w-full max-w-prose p-4 m-auto",
        style: { "height": "calc(100vh - 56px)" }
      }, _attrs))}><h1>${ssrInterpolate(_ctx.$t("auth.title"))}</h1><h3>${ssrInterpolate(_ctx.$t("auth.username"))}</h3><div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_el_input, {
        modelValue: unref(newUsername),
        "onUpdate:modelValue": ($event) => isRef(newUsername) ? newUsername.value = $event : null,
        type: "text",
        formatter: (
          //@ts-ignore
          (v) => v.replace(/[^\w]+/g, "")
        ),
        parser: (v) => v.replace(/[^\w]+/g, "")
      }, null, _parent));
      _push(ssrRenderComponent(_component_el_button, {
        type: unref(usernameIsNotSaved) ? "primary" : "",
        disabled: !unref(usernameIsNotSaved),
        loading: unref(usernameIsSaving),
        onClick: ($event) => saveUsername()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("action.save"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("action.save")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><h3>${ssrInterpolate(_ctx.$t("auth.passwd"))}</h3>`);
      _push(ssrRenderComponent(_component_NuxtLink, { href: "/acc/reset-password" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_el_button, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.$t("auth.resetPw"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.$t("auth.resetPw")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_el_button, null, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.$t("auth.resetPw")), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h3>${ssrInterpolate(_ctx.$t("auth.email"))}</h3><div class="opacity-60">`);
      _push(ssrRenderComponent(_component_el_input, {
        modelValue: unref(email),
        "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
        type: "email",
        disabled: "",
        class: "pointer-events-none"
      }, null, _parent));
      _push(`</div><h1>${ssrInterpolate(_ctx.$t("settings.appearance"))}</h1>`);
      _push(ssrRenderComponent(_component_CommonSettings, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/acc/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-94533a61.mjs.map
