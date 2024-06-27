const findThePath = (
  obj: Object | any,
  key: string,
  inherited: {
    path?: string[];
    checkedObj?: Set<Object>;
    found?: Map<string[], any>;
  } = {}
): Map<string[], any> => {
  const { path = [], checkedObj = new Set(), found = new Map() } = inherited;
  if (checkedObj.has(obj)) {
    return found;
  }
  const isInit = checkedObj.size === 0;
  checkedObj.add(obj);
  for (const k in obj) {
    try {
      if (k === key) {
        console.log("Found:", [...path, k].join("."), obj);
        found.set([...path, k], obj);
      }
      if (typeof obj === "object" && obj !== null) {
        findThePath(obj[k], key, {
          path: [...path, k],
          checkedObj,
          found,
        });
      }
    } catch (err) {
      console.warn("Find the path error:", err);
      continue;
    }
  }
  if (isInit) {
    const message = ["Found result:\n"];
    found.forEach((value, key) => {
      message.push(key.join("."), "\n", value);
    });
    console.log(...message);
  }
  return found;
};

export default findThePath;
