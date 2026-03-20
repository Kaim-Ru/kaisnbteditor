import { useState, useEffect } from 'react'
import { getPreviewImage } from './ChestPreview'
import * as NBT from 'nbtify'
import trashcanIcon from '../assets/trashcan.svg'
import exportIcon from '../assets/export.svg'

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
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8
  const maxPage = Math.max(0, Math.ceil(templates.length / itemsPerPage) - 1)

  useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(maxPage)
    }
  }, [maxPage, currentPage])

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(maxPage, prev + 1))
  }

  return (
    <div className="w-full h-20 md:h-[20%] bg-type-1 flex flex-col min-h-22 md:min-h-28">
      <div className="relative flex items-center justify-center w-full h-8">
        <button
          className={`absolute text-[20px] left-1 top-1 ${currentPage === 0 ? 'bg-type-1-button-disabled' : 'bg-type-1-button'}`}
          onClick={handlePrevPage}
          disabled={currentPage === 0}
        >
          ◀
        </button>
        <div className="text-[20px] md:text-[24px] relative top-1">
          Templates{' '}
          <span className="text-[14px]">
            {templates.length > itemsPerPage &&
              `(${currentPage + 1}/${maxPage + 1})`}
          </span>
        </div>
        <button
          className={`absolute text-[20px] right-1 top-1 ${currentPage >= maxPage ? 'bg-type-1-button-disabled' : 'bg-type-1-button'}`}
          onClick={handleNextPage}
          disabled={currentPage >= maxPage}
        >
          ▶
        </button>
      </div>
      <div className="z-10 flex-1">
        <div className="grid grid-cols-8 w-full h-full gap-0.5 md:gap-1">
          {Array.from({ length: itemsPerPage }).map((_, i) => {
            const actualIndex = currentPage * itemsPerPage + i
            const template = templates[actualIndex]
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
              <div key={actualIndex} className="p-1">
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
                          className="absolute left-0 bottom-0 items-center justify-center w-[50%] h-[50%] max-w-7 max-h-7 p-0.5 leading-none transition-colors bg-blue-300 border border-blue-300 hover:bg-blue-300 opacity-50 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          title="export"
                        >
                          <img
                            src={exportIcon}
                            alt="export"
                            className="w-full h-full pointer-events-none"
                          />
                        </button>
                        <button
                          className="absolute right-0 items-center justify-center w-[50%] h-[50%] max-w-7 max-h-7 p-0.5 leading-none transition-colors bottom-0 bg-red-300 border border-red-300 hover:bg-red-300 opacity-50 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onTemplateDelete) {
                              onTemplateDelete(actualIndex)
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
