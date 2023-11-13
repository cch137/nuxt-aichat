import { AttachmentBuilder, codeBlock } from 'discord.js'

function createTextFile (filename: string, content: string) {
  return new AttachmentBuilder(Buffer.from(content, 'utf8'), { name: filename })
}

function toCodeBlocks(input: string, maxLength = 1992) {
  const blocks: string[] = []
  for (let i = 0; i < input.length; i += maxLength) {
    blocks.push(codeBlock(input.substring(i, i + maxLength)))
  }
  return blocks;
}

export {
  createTextFile,
  toCodeBlocks,
}
