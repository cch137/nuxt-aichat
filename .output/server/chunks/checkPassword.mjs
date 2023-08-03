import { readBody } from 'h3';

async function checkPassword(event) {
  const body = await readBody(event);
  const password = body == null ? void 0 : body.passwd;
  return password === process.env.ADMIN_PASSWORD;
}

export { checkPassword as c };
//# sourceMappingURL=checkPassword.mjs.map
