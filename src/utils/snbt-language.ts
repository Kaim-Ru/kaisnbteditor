import { parser } from './snbt-parser'
import { LanguageSupport } from '@codemirror/language'

export function snbt() {
  return new LanguageSupport(parser)
}
