import { a as useHead } from '../server.mjs';

function useTitle(title) {
  useHead({
    title,
    meta: [
      { property: "og:title", content: title },
      { property: "twitter:title", content: title }
    ]
  });
}

export { useTitle as u };
//# sourceMappingURL=useTitle-dc6f5342.mjs.map
