import './index3.mjs';
import { m as message } from './message.mjs';

async function deleteConversation(user, conv) {
  if (!(user && conv)) {
    return [];
  }
  return await message.updateMany({
    user,
    conv
  }, {
    $set: {
      user: `~${user}`
    }
  }, {
    projection: { _id: 0 }
  }).exec();
}

export { deleteConversation as d };
//# sourceMappingURL=deleteConversation.mjs.map
