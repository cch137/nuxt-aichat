const CONTEXT_MAX_TOKENS = 1024
const CONTEXT_MAX_LENGTH = 2048

const contexts: string[] = []

const check = () => {
  while (contexts.length > 1 && contexts.slice(1, contexts.length).join('').length > CONTEXT_MAX_LENGTH) {
    contexts.shift()
  }
}

const get = () => {
  check()
  return `Here are your replies, from newest to oldest:\n${
    [...contexts].reverse().join('\n---\n')
  }`.substring(0, CONTEXT_MAX_LENGTH)
}

const add = (...texts: string[]) => {
  contexts.push(...texts)
  check()
}

const clear = () => {
  contexts.splice(0, contexts.length)
}

export default function () {
  return {
    add,
    get,
    clear
  }
}
