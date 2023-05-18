/**
 * @see {@link https://www.npmjs.com/package/zhconvertor}
 * @author wniko
 */

import table1 from './data/table1'
import table2 from './data/table2'

export enum ConvertType {
  dont = 0,
  s2t = 1,
  t2s = 2
}

const zhConverter = {
  /**
   * Convert SimpCh to TradCh
   * @param text
   * @return
   */
  s2t (text: string): string {
    if (text.length === 0) {
      return ''
    }

    const tmptext: string = text
    const result: string[] = Array(text.length)

    if (text.length > 1) {
      table2.forEach((couple: [string, string]) => {
        for (let i = 0; i < tmptext.length - 1; i++) {
          if (tmptext.substring(i, i + 2) === couple[1] && result[i] === undefined) {
            result[i] = couple[0].charAt(0)
            result[i + 1] = couple[0].charAt(1)
          }
        }
      })
    }

    table1.forEach((couple: [string, string]) => {
      for (let i = 0; i < tmptext.length; i++) {
        if (tmptext.substring(i, i + 1) === couple[1] && result[i] === undefined) {
          result[i] = couple[0].charAt(0)
        }
      }
    })

    for (let i = 0; i < result.length; i++) {
      if (result[i] === undefined) {
        result[i] = tmptext.charAt(i)
      }
    }

    return result.join('')
  },

  /**
   * Convert TradCh to SimpCh
   * @param text
   * @returns
   */
  t2s (text: string): string {
    if (text.length === 0) {
      return ''
    }

    let resText = text
    table1.forEach((charSet) => {
      resText = resText.replace(new RegExp(charSet[0], 'g'), charSet[1])
    })
    return resText
  },

  /**
   * Convert TC to SC or SC to TC
   * @param text
   * @param convertType 0: don't convert, 1: S->T, 2: T->S
   * @returns
   */
  convert (text: string, convertType: ConvertType): string {
    switch (convertType) {
      case ConvertType.dont:
        return text
      case ConvertType.s2t:
        return zhConverter.s2t(text)
      case ConvertType.t2s:
        return zhConverter.t2s(text)
      default:
        return text
    }
  }
}

export default zhConverter
