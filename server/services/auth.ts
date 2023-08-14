import sha3 from 'crypto-js/sha3.js'
import mailer from '~/server/services/mailer'
import { user as userCollection, message as messageCollection } from './mongoose/index'
import random from '~/utils/random'

const sha256 = (message: string): string => {
  return sha3(message, { outputLength: 256 }).toString()
}

interface EmailAddressVerifier {
  verify: (code: string) => boolean;
  resend: () => Promise<boolean>;
}

const appName = 'CH4'

const verificationVerifierMap = new Map<string, EmailAddressVerifier>()

const sendVerificationCodeMail = async (toEmailAddress: string, code: string) => {
  return await mailer.sendText(toEmailAddress, `Verification code - ${appName}`, `Here is your ${appName} verification code:\n\n${code}\n\nDo not share this information with anyone.\nThe verification code is valid for 5 minutes.\nIf you are unsure of the intended purpose of this code, kindly disregard this email.\nThis is an automated email. Please do not reply.`)
}

const createEmailVerification = async (email: string) => {
  const realCode = random.base10(6)
  let timeout: NodeJS.Timeout
  let resendTries = 0
  let verifyTries = 0
  const clear = () => {
    clearTimeout(timeout)
    verificationVerifierMap.delete(email)
  }
  const send = async () => {
    await sendVerificationCodeMail(email, realCode)
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      clear()
    }, 5 * 60 * 1000)
  }
  verificationVerifierMap.set(email, {
    verify (code: string) {
      if (code === realCode) {
        clear()
        return true
      }
      if (++verifyTries >= 10) {
        clear()
        throw 'Verification code has expired.'
      }
      return false
    },
    async resend () {
      if (resendTries >= 3) {
        throw 'Too many resends.'
      }
      await send()
      return true
    }
  })
  await send()
}

const verifyEmail = (email: string, code: string) => {
  const verifier = verificationVerifierMap.get(email)
  if (!verifier) {
    throw 'Verification code has expired.'
  }
  return verifier.verify(code)
}

const resendVerificationCode = async (email: string) => {
  const verifier = verificationVerifierMap.get(email)
  if (!verifier) {
    throw 'Verification code has expired.'
  }
  return await verifier.resend()
}

const toValidUsername = (username: string) => {
  if (username.length < 5) {
    throw 'Username length must be at least 5'
  }
  return username.replace(/[^\w]+/g, '').substring(0, 32)
}

const createUser = async (uid: string, email: string, username: string, password: string) => {
  const hashedPassword = sha256(password)
  username = toValidUsername(username)
  const checkId = userCollection.findOne({ uid })
  const checkEmail = userCollection.findOne({ email })
  const checkUsername = userCollection.findOne({ username })
  if (Boolean(await checkId)) {
    throw 'User ID already exists.'
  }
  if (Boolean(await checkEmail)) {
    throw 'This email address is already in use.'
  }
  if (Boolean(await checkUsername)) {
    throw 'This username is already in use.'
  }
  await userCollection.create({
    uid,
    email,
    username,
    password: hashedPassword,
  })
}

const resetPassword = async (email: string, newPassword: string) => {
  const hashedNewPassword = sha256(newPassword)
  await userCollection.updateOne({ email }, {
    $set: { password: hashedNewPassword }
  })
}

const getUid = async (usernameOrEmail: string, password: string) => {
  const hashedPassword = sha256(password)
  const user = await userCollection.findOne({
    $or: [
      { email: usernameOrEmail, password: hashedPassword },
      { username: usernameOrEmail, password: hashedPassword },
    ]
  })
  return user?.uid || false
}

const getUser = async (uid: string): Promise<{ username: string }> => {
  // @ts-ignore
  return await userCollection.findOne({ uid }, { _id: 0, username: 1 })
}

const mergeUser = async (uidToBeRetained: string, uidToBeRemoved: string) => {
  if (typeof uidToBeRetained !== 'string') {
    throw 'uidToBeRetained is not a string'
  }
  if (typeof uidToBeRemoved !== 'string') {
    throw 'uidToBeRemoved is not a string'
  }
  await messageCollection.updateMany({ user: uidToBeRemoved }, { $set: { user: uidToBeRetained } })
}

const changeUsername = async (uid: string, username: string) => {
  username = toValidUsername(username)
  const isExistUser = await userCollection.findOne({ username }, { uid: 1 })
  if (isExistUser?.uid === uid) {
    return { username }
  }
  if (Boolean(isExistUser)) {
    throw 'This username is already in use.'
  }
  await userCollection.updateOne({ uid }, {
    $set: { username }
  })
  return { username }
}

const auth = {
  createEmailVerification,
  verifyEmail,
  resendVerificationCode,
  createUser,
  resetPassword,
  getUid,
  getUser,
  mergeUser,
  changeUsername,
}

export default auth
