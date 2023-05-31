import { d as useHead } from '../server.mjs';

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
//# sourceMappingURL=useTitle-8d70f262.mjs.map
