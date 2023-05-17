import { _ as __nuxt_component_0$1 } from './client-only-29ef7f45.mjs';
import { E as ElMessage } from './el-message-defaaacd.mjs';
import { useSSRContext, ref, watch } from 'vue';
import { a as useState } from '../server.mjs';
import { ssrRenderComponent } from 'vue/server-renderer';
import { marked } from 'marked';

const copyToClipboard = (text) => new Promise((resolve, reject) => {
  navigator.clipboard.writeText(text).then((_) => resolve(text)).catch((err) => {
    try {
      const txArea = document.createElement("textarea");
      txArea.value = text;
      document.body.appendChild(txArea);
      txArea.select();
      document.execCommand("copy");
      txArea.remove();
      resolve(text);
    } catch (er) {
      reject([err, er]);
    }
  });
});
const _sfc_main = {
  __name: "ChatCore",
  __ssrInlineRender: true,
  setup(__props) {
    const copyTextContent = (text) => {
      copyToClipboard(text).then(() => ElMessage.success("Copied!")).catch(() => ElMessage.error("Copy failed."));
    };
    marked.setOptions({ headerIds: false, mangle: false });
    const loadingDots = ref(".");
    setInterval(() => {
      if (loadingDots.value.length < 4) {
        loadingDots.value += ".";
      } else {
        loadingDots.value = ".";
      }
    }, 500);
    const messages = useState("messages", () => []);
    watch(messages, () => {
      setTimeout(() => {
        const preElements = document.querySelectorAll(".InnerMessage pre");
        for (const preElement of preElements) {
          const codeElement = preElement.getElementsByTagName("code")[0];
          let language = "Plain text";
          for (const className of codeElement.classList) {
            if (className.startsWith("language-")) {
              language = className.replace("language-", "");
              break;
            }
          }
          const codeBlockWrapper = document.createElement("pre");
          codeBlockWrapper.classList.add("CodeBlockWrapper");
          const codeBlockHeader = document.createElement("div");
          codeBlockHeader.classList.add("CodeBlockHeader", "flex-center");
          const copyCodeButton = document.createElement("div");
          copyCodeButton.classList.add("CopyCodeButton");
          copyCodeButton.innerText = "copy";
          const languageNameTag = document.createElement("span");
          languageNameTag.classList.add("flex-1");
          languageNameTag.innerText = language;
          preElement.parentElement.insertBefore(codeBlockWrapper, preElement);
          codeBlockWrapper.appendChild(codeBlockHeader);
          codeBlockWrapper.appendChild(preElement);
          codeBlockHeader.appendChild(languageNameTag);
          codeBlockHeader.appendChild(copyCodeButton);
          copyCodeButton.addEventListener("click", () => {
            copyTextContent(preElement.innerText);
          });
        }
      }, 1e3);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatCore.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main;

export { __nuxt_component_0 as _ };
//# sourceMappingURL=ChatCore-4fa52b3a.mjs.map
