import { d as defineEventHandler } from './nitro/node-server.mjs';
import qs from 'qs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

function formatBytes(fileSizeByte = 0, toFix = 2, spaceBfrUnit = true) {
  const d = parseInt(`${Math.log(fileSizeByte) / Math.log(1024)}`) || 0;
  return `${(fileSizeByte / Math.pow(1024, d > 5 ? 5 : d)).toFixed(toFix)}${spaceBfrUnit ? " " : ""}${["", ..."KMGTP"][d > 5 ? 5 : d]}B`;
}

const memory = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const format = qs.parse((_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.url) == null ? void 0 : _c.split("?")[1]).format;
  const memory = process.memoryUsage();
  if (format === "json") {
    return memory;
  }
  if (format === "table") {
    const result = [];
    for (const i in memory) {
      result.push(`<tr><td>${i}</td><td>${formatBytes(memory[i])}</td></tr>`);
    }
    return `<pre><table>${result.join("")}</table></pre>`;
  }
});

export { memory as default };
//# sourceMappingURL=memory.mjs.map
