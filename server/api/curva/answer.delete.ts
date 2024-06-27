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
  const { conv, id } = body;
  // @ts-ignore
  if (!conv || !id) {
    return { error: 2 };
  }
  const uid = getUidByToken(event);
  // Validate token
  if (typeof uid !== "string") {
    return { error: 3 };
  }
  try {
    const _id = new ObjectId(baseConverter.convert(id, "64", 16));
    await messagesCollection.updateOne(
      { _id, conv, uid },
      { $set: { uid: `~${uid}` } }
    );
    return {};
  } catch (err) {
    return { error: 4 };
  }
});
