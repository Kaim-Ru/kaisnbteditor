import { useState, useEffect } from 'react'
import { getPreviewImage } from './ChestPreview'
import * as NBT from 'nbtify'
import JSZip from 'jszip'
import trashcanIcon from '../assets/trashcan.svg'
import exportIcon from '../assets/export.svg'

interface TemplateBoxProps {
  templates?: string[]
  defaultTemplates?: string[]
  onTemplateSelect?: (template: string, index: number) => void
  onTemplateDelete?: (index: number) => void
  customImages?: Record<string, string>
}

export default function TemplateBox({
  templates = [],
  defaultTemplates = [],
  onTemplateSelect,
  onTemplateDelete,
  customImages = {},
}: TemplateBoxProps) {
  const combinedTemplates = [...defaultTemplates, ...templates]
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8
  const maxPage = Math.max(
    0,
    Math.ceil(combinedTemplates.length / itemsPerPage) - 1
  )

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

  const handleExport = async (
    template: string,
    item: any,
    imageUrl: string
  ) => {
    try {
      const zip = new JSZip()
      zip.file('item.snbt', template)

      if (imageUrl) {
        try {
          const resp = await fetch(imageUrl)
          const blob = await resp.blob()
          let ext = 'png'
          if (blob.type === 'image/svg+xml' || imageUrl.endsWith('.svg'))
            ext = 'svg'
          else if (
            blob.type === 'image/jpeg' ||
            imageUrl.endsWith('.jpg') ||
            imageUrl.endsWith('.jpeg')
          )
            ext = 'jpg'
          else if (blob.type === 'image/webp' || imageUrl.endsWith('.webp'))
            ext = 'webp'
          zip.file(`image.${ext}`, blob)
        } catch (e) {
          console.error('Failed to fetch image for export:', e)
        }
      }

      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'STORE', // 無圧縮
      })

      const itemName = item?.Name?.valueOf?.() || item?.Name || 'template'
      const safeName =
        typeof itemName === 'string'
          ? itemName.replace(
              /[^a-zA-Z0-9_\-\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g,
              '_'
            )
          : 'template'

      const a = document.createElement('a')
      a.href = URL.createObjectURL(content)
      a.download = `${safeName}.knezip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(a.href)
    } catch (e) {
      console.error('Failed to export:', e)
    }
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
            {combinedTemplates.length > itemsPerPage &&
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
            const template = combinedTemplates[actualIndex]
            const isDefault = actualIndex < defaultTemplates.length
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
                    template &&
                    onTemplateSelect &&
                    onTemplateSelect(template, actualIndex)
                  }
                  title={
                    template ? 'クリックしてエディタに適用' : '空きスロット'
                  }
                >
                  <div className="aspect-square w-[min(100%,100vh)] max-w-12 md:max-w-none bg-type-2-hover relative">
                    {previewItem && (
                      <>
                        <img
                          src={getPreviewImage(
                            previewItem,
                            `template_${actualIndex}`,
                            customImages
                          )}
                          alt="template preview"
                          className="absolute inset-0 w-full h-full p-1 pointer-events-none"
                        />
                        {!isDefault && (
                          <button
                            className="absolute left-0 bottom-0 items-center justify-center w-[45%] h-[45%] max-w-7 max-h-7 p-0.5 leading-none transition-colors bg-blue-300 border border-blue-300 hover:bg-blue-300 opacity-40 z-10 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleExport(
                                template,
                                previewItem,
                                getPreviewImage(
                                  previewItem,
                                  `template_${actualIndex}`,
                                  customImages
                                )
                              )
                            }}
                            title="export"
                          >
                            <img
                              src={exportIcon}
                              alt="export"
                              className="w-full h-full pointer-events-none"
                            />
                          </button>
                        )}
                        {!isDefault && (
                          <button
                            className="absolute right-0 items-center justify-center w-[45%] h-[45%] max-w-7 max-h-7 p-0.5 leading-none transition-colors bottom-0 bg-red-300 border border-red-300 hover:bg-red-300 opacity-40 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (onTemplateDelete) {
                                onTemplateDelete(
                                  actualIndex - defaultTemplates.length
                                )
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
                        )}
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
