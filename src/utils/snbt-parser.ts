import { parse, stringify } from '@ironm00n/nbt-ts'
import { StreamLanguage } from '@codemirror/language'

// 簡易的なSNBT用のストリームパーサー
const snbtStreamParser = {
  token(stream: any) {
    if (stream.eatSpace()) return null

    if (stream.match(/^-?\d+[bBsSlLfFdD]?\b/)) {
      return 'number'
    }

    if (stream.match(/^-?\d*\.\d+[fFdD]?\b/)) {
      return 'number'
    }

    if (stream.match(/^"(?:[^"\\]|\\.)*"/)) {
      return 'string'
    }

    if (stream.match(/^'(?:[^'\\]|\\.)*'/)) {
      return 'string'
    }

    if (stream.match(/^[a-zA-Z0-9_\-\+\.]+/)) {
      return 'propertyName'
    }

    if (stream.match(/^\[([BIL]);/)) {
      return 'className'
    }

    if (stream.match(/^[\{\}\[\]]/)) {
      return 'bracket'
    }

    if (stream.match(/^[,:]/)) {
      return 'operator'
    }

    stream.next()
    return null
  },
}

export const parser = StreamLanguage.define(snbtStreamParser)

export interface ValidationError {
  message: string
  from: number
  to: number
  severity: 'error' | 'warning'
}

/**
 * SNBTをパースして検証する
 */
export function validateSNBT(text: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!text.trim()) {
    return errors
  }

  try {
    const cleanedText = text.replace(/[\t\r\n]/g, '')
    parse(cleanedText)
  } catch (e: any) {
    const errorMessage = String(e.message || e)

    let position = 0
    const positionMatch = errorMessage.match(/position (\d+)/i)
    if (positionMatch) {
      position = parseInt(positionMatch[1], 10)
    }

    errors.push({
      message: errorMessage,
      from: Math.max(0, position - 1),
      to: Math.min(text.length, position + 10),
      severity: 'error',
    })
  }

  return errors
}

/**
 * SNBTを整形する
 */
export function formatSNBT(text: string, tabSize: number = 2): string | null {
  try {
    const cleanedText = text.replace(/[\t\r\n]/g, '')
    const nbt = parse(cleanedText)
    const formatted = stringify(nbt, {
      pretty: true,
      breakLength: tabSize,
    })
    return formatted
  } catch (e: any) {
    console.error('Format error:', e)
    console.error('Error message:', e.message)
    console.error('Error stack:', e.stack)
    throw e
  }
}
