import { E as ElInput } from './index-e64e1996.mjs';
import { E as ElButton } from './index-8d90ea71.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-c659c711.mjs';
import { _ as __nuxt_component_0$1 } from './client-only-f67cc156.mjs';
import { d as useLocale, e as useState, _ as _export_sfc } from '../server.mjs';
import { defineComponent, ref, watch, mergeProps, unref, isRef, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-91a53f8d.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import '@vueuse/core';
import 'lodash-unified';
import './index-40342afc.mjs';
import '@vue/shared';
import './typescript-f58cd02a.mjs';
import './use-form-item-5a5c18c7.mjs';
import './use-global-config-bcc1ef91.mjs';
import '@ctrl/tinycolor';
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
import './index-e8f7e5e8.mjs';
import './aria-30c2b077.mjs';

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
    const { email, username, authlvl, changeUsername } = useAuth();
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
      _push(`</div><h3>Permission Level</h3><div class="opacity-60">`);
      _push(ssrRenderComponent(_component_el_input, {
        modelValue: unref(authlvl),
        "onUpdate:modelValue": ($event) => isRef(authlvl) ? authlvl.value = $event : null,
        type: "text",
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
//# sourceMappingURL=profile-beb46535.mjs.map
