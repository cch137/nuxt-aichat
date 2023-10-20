import { watch, unref } from 'vue';

const useDeprecated = ({ from, replacement, scope, version, ref, type = "API" }, condition) => {
  watch(() => unref(condition), (val) => {
  }, {
    immediate: true
  });
};

export { useDeprecated as u };
//# sourceMappingURL=index-2b5c388d.mjs.map
