import type { Guild } from 'discord.js'
import { AttachmentBuilder } from 'discord.js'

function createTextFile (filename: string, content: string) {
  return new AttachmentBuilder(Buffer.from(content, 'utf8'), { name: filename })
}

export {
  createTextFile,
}
