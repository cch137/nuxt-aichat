import nodemailer from 'nodemailer'
import { config } from 'dotenv'

config()

const MY_EMAIL_ADDRESS = process.env.NODEMAILER_EMAIL

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: MY_EMAIL_ADDRESS,
    pass: process.env.NODEMAILER_PASSWORD
  }
})

const sendMail = async (
  toEmailAddress: string,
  subject: string,
  message: string,
  type: 'text' | 'html' = 'text'
) => {
  return await new Promise<boolean>((resolve, reject) => {
    transporter.sendMail({
      from: MY_EMAIL_ADDRESS,
      to: toEmailAddress,
      subject,
      [type]: message
    }, (err, info) => {
      if (err) {
        return reject(err)
      }
      console.log(`Email sent: (${subject}) ${info.response}`)
      resolve(true)
    })
  })
}

const sendText = async (toEmailAddress: string, subject: string, content: string) => {
  return await sendMail(toEmailAddress, subject, content, 'text')
}

const sendHtml = async (toEmailAddress: string, subject: string, content: string) => {
  return await sendMail(toEmailAddress, subject, content, 'html')
}

const mailer = {
  transporter,
  sendText,
  sendHtml,
}

export default mailer
