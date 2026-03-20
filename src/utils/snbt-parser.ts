import { parse, stringify } from '@ironm00n/nbt-ts'
import { StreamLanguage } from '@codemirror/language'

// 簡易的なSNBT用のストリームパーサー
const snbtStreamParser = {
  token(stream: any) {
    // 空白をスキップ
    if (stream.eatSpace()) return null

    // コメント
    if (stream.match('//')) {
      stream.skipToEnd()
      return 'comment'
    }

    // 数値 (byte, short, int, long, float, double)
    if (stream.match(/^-?\d+[bBsSlLfFdD]?\b/)) {
      return 'number'
    }

    // 浮動小数点数
    if (stream.match(/^-?\d*\.\d+[fFdD]?\b/)) {
      return 'number'
    }

    // 文字列 (ダブルクォート)
    if (stream.match(/^"(?:[^"\\]|\\.)*"/)) {
      return 'string'
    }

    // 文字列 (シングルクォート)
    if (stream.match(/^'(?:[^'\\]|\\.)*'/)) {
      return 'string'
    }

    // 引用符なし文字列 (プロパティ名など)
    if (stream.match(/^[a-zA-Z0-9_\-\+\.]+/)) {
      return 'propertyName'
    }

    // 配列タイプ
    if (stream.match(/^\[([BIL]);/)) {
      return 'className'
    }

    // 括弧
    if (stream.match(/^[\{\}\[\]]/)) {
      return 'bracket'
    }

    // 演算子とセパレータ
    if (stream.match(/^[,:]/)) {
      return 'operator'
    }

    // その他
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
    // 改行とタブを削除（nbt-tsのバグ回避）
    const cleanedText = text.replace(/[\t\r\n]/g, '')
    parse(cleanedText)
  } catch (e: any) {
    const errorMessage = String(e.message || e)

    // エラー位置を推定
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
    // 改行とタブを削除（nbt-tsのバグ回避）
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
    throw e // エラーを上位に伝播
  }
}
