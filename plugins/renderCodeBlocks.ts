import Prism from 'prismjs'

const CODE_PROCESSED_CLASS = 'CodeBlockAddedCopyButton'
const LINK_PROCESSED_CLASS = '_BlankLink'

const getAllPreBlocks = () => {
  return [...document.querySelectorAll('.InnerMessage pre')] as HTMLPreElement[]
}

const getAllLinks = () => {
  return [...document.querySelectorAll('.InnerMessage a')] as HTMLLinkElement[]
}

const emptyLanguage = 'plain text'
const loadedLanguages = new Set(['javascript', 'html', 'css', emptyLanguage])

const renderCodeBlock = async (preElement: HTMLPreElement) => {
  if (preElement.classList.contains(CODE_PROCESSED_CLASS)) {
    return
  }
  return await new Promise((resolve) => {
    const codeElement = preElement.getElementsByTagName('code')[0]
    let language = emptyLanguage
    for (const className of codeElement.classList) {
      if (className.startsWith('language-')) {
        language = className.replace('language-', '')
        break
      }
    }
    const codeBlockWrapper = document.createElement('pre')
    codeBlockWrapper.classList.add('CodeBlockWrapper', CODE_PROCESSED_CLASS)
    const codeBlockHeader = document.createElement('div')
    codeBlockHeader.classList.add('CodeBlockHeader', 'flex-center')
    const copyCodeButton = document.createElement('div')
    copyCodeButton.classList.add('CopyCodeButton')
    copyCodeButton.innerText = 'copy'
    const languageNameTag = document.createElement('span')
    languageNameTag.classList.add('flex-1')
    languageNameTag.innerText = language
    preElement.style.marginTop = '0'
    preElement.classList.add(CODE_PROCESSED_CLASS);
    (preElement.parentElement as HTMLElement).insertBefore(codeBlockWrapper, preElement)
    codeBlockWrapper.appendChild(codeBlockHeader)
    codeBlockWrapper.appendChild(preElement)
    codeBlockHeader.appendChild(languageNameTag)
    codeBlockHeader.appendChild(copyCodeButton)
    const fontSize = '.9rem'
    codeBlockWrapper.style.fontSize = fontSize
    codeElement.style.fontSize = fontSize
    preElement.style.fontSize = fontSize
    copyCodeButton.addEventListener('click', () => {
      useCopyToClipboard((preElement as HTMLElement).innerText)
    })
    setTimeout(async () => {
      await new Promise((resolve) => {
        if (loadedLanguages.has(language)) {
          resolve(true)
          return
        }
        const script = document.createElement('script')
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-${language}.min.js`
        script.addEventListener('load', () => resolve(true))
        script.addEventListener('error', () => resolve(true))
        document.head.appendChild(script)
      })
      Prism.highlightElement(codeElement, false)
      resolve(true)
    }, 0)
  })
}

const renderCodeBlocks = async (preElements: HTMLPreElement[]) => {
  return await Promise.all(preElements.map((preElement) => renderCodeBlock(preElement)))
}

const renderLinks = async (aElements: HTMLLinkElement[]) => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      for (const aElement of aElements) {
        if (aElement.classList.contains(LINK_PROCESSED_CLASS)) {
          continue
        }
        aElement.setAttribute('target', '_blank')
        aElement.classList.add(LINK_PROCESSED_CLASS)
      }
      resolve(true)
    }, 0)
  })
}

const tasks = [] as any[]

const mutationHandler = () => {
  if (tasks.length === 0) {
    return
  }
  Promise.all([
    renderCodeBlocks(getAllPreBlocks()),
    renderLinks(getAllLinks())
  ])
    .finally(() => {
      tasks.pop()
      setTimeout(() => mutationHandler(), 0)
    })
}

if (process.client) {
  new MutationObserver(async (mutationsList) => {
    for(const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (tasks.length === 0) {
          tasks.push(1)
          mutationHandler()
        } else {
          tasks.push(1)
        }
      }
    }
  }).observe(document, {
    childList: true,
    subtree: true,
  })
}

export default defineNuxtPlugin(() => {
  return {}
})
