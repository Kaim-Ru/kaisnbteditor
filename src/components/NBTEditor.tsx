import { useEffect, useRef } from 'react'
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter,
} from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from '@codemirror/language'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/autocomplete'
import { linter, lintKeymap } from '@codemirror/lint'
import type { Diagnostic } from '@codemirror/lint'
import { snbt } from '../utils/snbt-language'
import { validateSNBT } from '../utils/snbt-parser'
import { formatSNBT } from '../utils/nbt-converter'

interface NBTEditorProps {
  value: string
  onChange: (value: string) => void
  onAddTemplate?: () => void
  onChangeIcon?: () => void
}

export default function NBTEditor({
  value,
  onChange,
  onAddTemplate,
  onChangeIcon,
}: NBTEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)

  // onChangeの最新の値を保持
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // 整形ボタンのクリック処理
  const handleFormat = () => {
    try {
      const formatted = formatSNBT(value)
      onChangeRef.current(formatted)
    } catch (error) {
      console.error('Format error:', error)
      alert(
        `整形に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  useEffect(() => {
    if (!editorRef.current) return

    // SNBT Linter
    const snbtLinter = linter((view) => {
      const diagnostics: Diagnostic[] = []
      const text = view.state.doc.toString()
      const errors = validateSNBT(text)

      for (const error of errors) {
        diagnostics.push({
          from: error.from,
          to: error.to,
          severity: error.severity,
          message: error.message,
        })
      }

      return diagnostics
    })

    // CodeMirrorの初期化
    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap,
        ]),
        snbt(),
        snbtLinter,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
            backgroundColor: 'rgb(var(--type-2))',
            color: 'rgb(var(--primary-700))',
          },
          '.cm-content': {
            fontFamily: 'Consolas, Monaco, monospace',
            padding: '10px 0',
          },
          '.cm-gutters': {
            backgroundColor: 'rgb(var(--type-2))',
            color: 'rgb(var(--primary-600))',
            border: 'none',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgb(var(--type-1))',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgb(var(--type-1))',
          },
          '.cm-selectionMatch': {
            backgroundColor: 'rgba(var(--primary-500), 0.3)',
          },
          '.cm-focused .cm-cursor': {
            borderLeftColor: 'rgb(var(--primary-300))',
          },
          '.cm-scroller': {
            overflow: 'auto',
            fontFamily: 'Consolas, Monaco, monospace',
          },
        }),
      ],
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [])

  // 外部からのvalue変更に対応
  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString()
      if (currentValue !== value) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        })
      }
    }
  }, [value])

  return (
    <div className="flex flex-col w-full my-4 h-100 md:h-[70%] md:mt-5 bg-type-1 md:my-0">
      <div className="flex items-center justify-between gap-2 px-4 py-1">
        <div className="text-[20px] md:text-[24px]">NBTEditor</div>
        <div className="flex flex-row-reverse gap-3">
          <button
            onClick={handleFormat}
            className="px-3 py-1 text-sm transition-opacity bg-type-1-button hover:opacity-80 font-bai-jamjuree"
          >
            Format
          </button>
          <button
            onClick={onAddTemplate}
            className="px-3 py-1 text-sm transition-opacity bg-type-1-button hover:opacity-80 font-bai-jamjuree"
          >
            T
          </button>
          {onChangeIcon && (
            <button
              onClick={onChangeIcon}
              className="px-3 py-1 text-sm transition-opacity bg-type-1-button hover:opacity-80 font-bai-jamjuree"
            >
              I
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 p-3 overflow-hidden">
        <div ref={editorRef} className="w-full h-full"></div>
      </div>
    </div>
  )
}
