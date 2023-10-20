import { E as ElInput } from './index-fa6727cb.mjs';
import { E as ElButton } from './index-02be6721.mjs';
import { d as useLocale, e as useState } from '../server.mjs';
import { defineComponent, ref, mergeProps, unref, isRef, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import '@vueuse/core';
import 'lodash-unified';
import './index-036fcace.mjs';
import '@vue/shared';
import './index-2b5c388d.mjs';
import './use-global-config-65a30ca3.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "qr-code",
  __ssrInlineRender: true,
  setup(__props) {
    const qrCodeInput = ref("Hello World!");
    function focusTextarea() {
      try {
        document.querySelector(".QRCodeInput textarea").focus();
      } catch {
      }
    }
    function getCanvasEl() {
      return document.getElementById("qrcode-canvas");
    }
    function downloadCanvas(format = "png", suffix = "png") {
      const qrcodeCanvas = getCanvasEl();
      const downloadLink = document.createElement("a");
      const canvasDataURL = qrcodeCanvas.toDataURL(`image/${format}`);
      downloadLink.href = canvasDataURL;
      downloadLink.download = `${qrCodeInput.value.substring(0, 256)}.${suffix}`;
      downloadLink.click();
      focusTextarea();
    }
    function downloadCanvasPng() {
      return downloadCanvas("png", "png");
    }
    function downloadCanvasJpg() {
      return downloadCanvas("jpeg", "jpg");
    }
    const _t = useLocale().t;
    const appName = useState("appName").value;
    useTitle(`${_t("page.qrCode")} - ${appName}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_input = ElInput;
      const _component_el_button = ElButton;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8 flex-col gap-4 flex-center" }, _attrs))}><h1>${ssrInterpolate(_ctx.$t("page.qrCode"))}</h1><div class="px-4 w-full flex justify-center">`);
      _push(ssrRenderComponent(_component_el_input, {
        modelValue: unref(qrCodeInput),
        "onUpdate:modelValue": ($event) => isRef(qrCodeInput) ? qrCodeInput.value = $event : null,
        class: "QRCodeInput",
        type: "textarea",
        autofocus: true,
        autosize: { minRows: 2, maxRows: 8 }
      }, null, _parent));
      _push(`</div><div class="qrcode-canvas-outter flex-center flex-wrap p-4 w-full"><canvas id="qrcode-canvas"></canvas></div><div class="mb-32">`);
      _push(ssrRenderComponent(_component_el_button, {
        onClick: ($event) => downloadCanvasPng()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("action.download"))} PNG`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("action.download")) + " PNG", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_el_button, {
        onClick: ($event) => downloadCanvasJpg()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("action.download"))} JPG`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("action.download")) + " JPG", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/qr-code.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=qr-code-917bb449.mjs.map
