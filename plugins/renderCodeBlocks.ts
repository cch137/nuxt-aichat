const renderCodeBlocks = (preElements: Element[]) => {
  const PROCESSED = 'CodeBlockAddedCopyButton'
  for (const preElement of preElements) {
    if (preElement.classList.contains(PROCESSED)) {
      continue
    }
    const codeElement = preElement.getElementsByTagName('code')[0]
    let language = 'plain text'
    for (const className of codeElement.classList) {
      if (className.startsWith('language-')) {
        language = className.replace('language-', '')
        break
      }
    }
    const codeBlockWrapper = document.createElement('pre')
    codeBlockWrapper.classList.add('CodeBlockWrapper', PROCESSED)
    const codeBlockHeader = document.createElement('div')
    codeBlockHeader.classList.add('CodeBlockHeader', 'flex-center')
    const copyCodeButton = document.createElement('div')
    copyCodeButton.classList.add('CopyCodeButton')
    copyCodeButton.innerText = 'copy'
    const languageNameTag = document.createElement('span')
    languageNameTag.classList.add('flex-1')
    languageNameTag.innerText = language
    preElement.classList.add(PROCESSED);
    (preElement.parentElement as HTMLElement).insertBefore(codeBlockWrapper, preElement)
    codeBlockWrapper.appendChild(codeBlockHeader)
    codeBlockWrapper.appendChild(preElement)
    codeBlockHeader.appendChild(languageNameTag)
    codeBlockHeader.appendChild(copyCodeButton)
    copyCodeButton.addEventListener('click', () => {
      useCopyToClipboard((preElement as HTMLElement).innerText)
    })
  }
}

const renderLinks = (aElements: HTMLLinkElement[]) => {
  const PROCESSED = '_BlankLink'
  for (const aElement of aElements) {
    if (aElement.classList.contains(PROCESSED)) {
      continue
    }
    aElement.setAttribute('target', '_blank')
    aElement.classList.add(PROCESSED)
  }
}

if (process.client) {
  let rendering = false
  new MutationObserver((mutationsList) => {
    if (rendering) {
      return
    }
    for(const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        rendering = true
        renderCodeBlocks([...document.querySelectorAll('.InnerMessage pre')])
        renderLinks([...document.querySelectorAll('.InnerMessage a')] as HTMLLinkElement[])
        rendering = false
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
