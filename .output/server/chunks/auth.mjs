import sha3 from 'crypto-js/sha3.js';
import { m as mailer } from './mailer.mjs';
import './index2.mjs';
import { r as random } from './random.mjs';
import { model, Schema } from 'mongoose';
import { m as message } from './message.mjs';

const userCollection = model("User", new Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
}, {
  versionKey: false,
  strict: "throw"
}), "users");

const sha256 = (message) => {
  return sha3(message, { outputLength: 256 }).toString();
};
const appName = "CH4";
const verificationVerifierMap = /* @__PURE__ */ new Map();
const sendVerificationCodeMail = async (toEmailAddress, code) => {
  return await mailer.sendText(toEmailAddress, `Verification code - ${appName}`, `Here is your ${appName} verification code:

${code}

Do not share this information with anyone.
The verification code is valid for 5 minutes.
If you are unsure of the intended purpose of this code, kindly disregard this email.
This is an automated email. Please do not reply.`);
};
const createEmailVerification = async (email) => {
  const realCode = random.base10(6);
  let timeout;
  let verifyTries = 0;
  const clear = () => {
    clearTimeout(timeout);
    verificationVerifierMap.delete(email);
  };
  const send = async () => {
    await sendVerificationCodeMail(email, realCode);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      clear();
    }, 5 * 60 * 1e3);
  };
  verificationVerifierMap.set(email, {
    verify(code) {
      if (code === realCode) {
        clear();
        return true;
      }
      if (++verifyTries >= 10) {
        clear();
        throw "Verification code has expired.";
      }
      return false;
    },
    async resend() {
      await send();
      return true;
    }
  });
  await send();
};
const verifyEmail = (email, code) => {
  const verifier = verificationVerifierMap.get(email);
  if (!verifier) {
    throw "Verification code has expired.";
  }
  return verifier.verify(code);
};
const resendVerificationCode = async (email) => {
  const verifier = verificationVerifierMap.get(email);
  if (!verifier) {
    throw "Verification code has expired.";
  }
  return await verifier.resend();
};
const toValidUsername = (username) => {
  if (username.length < 5) {
    throw "Username length must be at least 5";
  }
  return username.replace(/[^\w]+/g, "").substring(0, 32);
};
const createUser = async (uid, email, username, password) => {
  const hashedPassword = sha256(password);
  username = toValidUsername(username);
  const checkId = userCollection.findOne({ uid });
  const checkEmail = userCollection.findOne({ email });
  const checkUsername = userCollection.findOne({ username });
  if (Boolean(await checkId)) {
    throw "User ID already exists.";
  }
  if (Boolean(await checkEmail)) {
    throw "This email address is already in use.";
  }
  if (Boolean(await checkUsername)) {
    throw "This username is already in use.";
  }
  await userCollection.create({
    uid,
    email,
    username,
    password: hashedPassword
  });
};
const resetPassword = async (email, newPassword) => {
  const hashedNewPassword = sha256(newPassword);
  await userCollection.updateOne({ email }, {
    $set: { password: hashedNewPassword }
  });
};
const getUid = async (usernameOrEmail, password) => {
  const hashedPassword = sha256(password);
  const user = await userCollection.findOne({
    $or: [
      { email: usernameOrEmail, password: hashedPassword },
      { username: usernameOrEmail, password: hashedPassword }
    ]
  });
  return (user == null ? void 0 : user.uid) || false;
};
const getUser = async (uid) => {
  return await userCollection.findOne({ uid }, { _id: 0, username: 1, email: 1 });
};
const mergeUser = async (uidToBeRetained, uidToBeRemoved) => {
  if (typeof uidToBeRetained !== "string") {
    throw "uidToBeRetained is not a string";
  }
  if (typeof uidToBeRemoved !== "string") {
    throw "uidToBeRemoved is not a string";
  }
  await message.updateMany({ uid: uidToBeRemoved }, { $set: { uid: uidToBeRetained } });
};
const changeUsername = async (uid, username) => {
  username = toValidUsername(username);
  const isExistUser = await userCollection.findOne({ username }, { uid: 1 });
  if ((isExistUser == null ? void 0 : isExistUser.uid) === uid) {
    return { username };
  }
  if (Boolean(isExistUser)) {
    throw "This username is already in use.";
  }
  await userCollection.updateOne({ uid }, {
    $set: { username }
  });
  return { username };
};
const auth = {
  createEmailVerification,
  verifyEmail,
  resendVerificationCode,
  createUser,
  resetPassword,
  getUid,
  getUser,
  mergeUser,
  changeUsername
};
const auth$1 = auth;

export { auth$1 as a };
//# sourceMappingURL=auth.mjs.map
