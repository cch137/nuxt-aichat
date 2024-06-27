import { readBody } from "h3";
import { ObjectId } from "mongodb";
import { message as messagesCollection } from "~/server/services/mongoose/index";
import { getUidByToken } from "~/server/services/token";
import baseConverter from "~/utils/baseConverter";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // @ts-ignore
  if (!body) {
    return { error: 1 };
  }
  let { conv, id, Q, A } = body;
  // @ts-ignore
  if (!conv || !id || typeof Q !== "string" || typeof A !== "string") {
    return { error: 2 };
  }
  Q = Q.trim();
  A = A.trim();
  const uid = getUidByToken(event);
  // Validate token
  if (typeof uid !== "string") {
    return { error: 3 };
  }
  try {
    const _id = new ObjectId(baseConverter.convert(id, "64", 16));
    // 二者皆空，移除 message
    if (Q || A) {
      if (Q) {
        await messagesCollection.updateOne(
          { _id, conv, uid },
          { $set: { Q, A } }
        );
      } else {
        await messagesCollection.updateOne(
          { _id, conv, uid },
          {
            $set: { Q, A },
            $unset: { urls: "", queries: "", more: "", dt: "" },
          }
        );
      }
    } else {
      await messagesCollection.updateOne(
        { _id, conv, uid },
        { $set: { uid: `~${uid}` } }
      );
    }
    return {};
  } catch (err) {
    return { error: 4 };
  }
});
