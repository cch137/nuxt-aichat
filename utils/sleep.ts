export default async function (timeoutMs = 0) {
  return await new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), timeoutMs);
  });
}
