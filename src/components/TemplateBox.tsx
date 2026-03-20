import { getPreviewImage } from './ChestPreview'
import * as NBT from 'nbtify'
import trashcanIcon from '../assets/trashcan.svg'

interface TemplateBoxProps {
  templates?: string[]
  onTemplateSelect?: (template: string) => void
  onTemplateDelete?: (index: number) => void
  customImages?: Record<string, string>
}

export default function TemplateBox({
  templates = [],
  onTemplateSelect,
  onTemplateDelete,
  customImages = {},
}: TemplateBoxProps) {
  return (
    <div className="w-full h-20 md:h-[20%] bg-type-1 flex flex-col min-h-22 md:min-h-28">
      <div className="relative flex items-center justify-center w-full h-8">
        <div className="absolute text-[20px] left-1 top-1 bg-type-1-button">
          ◀
        </div>
        <div className="text-[20px] md:text-[24px] relative top-1">
          Templates
        </div>
        <div className="absolute text-[20px] right-1 top-1 bg-type-1-button">
          ▶
        </div>
      </div>
      <div className="z-10 flex-1">
        <div className="grid grid-cols-8 w-full h-full gap-0.5 md:gap-1">
          {Array.from({ length: 8 }).map((_, i) => {
            const template = templates[i]
            let previewItem = null

            if (template) {
              try {
                previewItem = NBT.parse(template)
              } catch (e) {
                // Parse error, ignore and fall back to fallback image
                previewItem = {}
              }
            }

            return (
              <div key={i} className="p-1">
                <div
                  className={`flex items-center justify-center w-full h-full relative group ${template ? 'cursor-pointer hover:opacity-80' : ''}`}
                  onClick={() =>
                    template && onTemplateSelect && onTemplateSelect(template)
                  }
                  title={
                    template ? 'クリックしてエディタに適用' : '空きスロット'
                  }
                >
                  <div className="aspect-square w-[min(100%,100vh)] max-w-12 md:max-w-none bg-type-2-hover relative">
                    {previewItem && (
                      <>
                        <img
                          src={getPreviewImage(previewItem, customImages)}
                          alt="template preview"
                          className="absolute inset-0 w-full h-full p-1 pointer-events-none"
                        />
                        <button
                          className="absolute right-0 items-center justify-center w-[50%] h-[50%] max-w-7 max-h-7 p-0.5 leading-none transition-colors bottom-0 bg-red-300 border border-red-300 hover:bg-red-300 opacity-50 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onTemplateDelete) {
                              onTemplateDelete(i)
                            }
                          }}
                          title="delete"
                        >
                          <img
                            src={trashcanIcon}
                            alt="delete"
                            className="w-full h-full pointer-events-none"
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
