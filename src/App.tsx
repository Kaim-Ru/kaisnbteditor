import { useState, useRef, useEffect } from 'react'
import logo from './assets/logo.svg'
import ChestPreview from './components/ChestPreview'
import TemplateBox from './components/TemplateBox'
import NBTEditor from './components/NBTEditor'
import {
  mcstructureToSNBT,
  snbtToMcstructure,
  extractItemFromSNBT,
  extractAllItemsFromSNBT,
  updateItemInSNBT,
} from './utils/nbt-converter'
import { DEFAULT_TEMPLATES, type TemplateData } from './defaultTemplates'
import {
  getCustomTemplates,
  addCustomTemplate,
  deleteCustomTemplate,
} from './utils/idb'

const DEFAULT_SNBT = `{
    format_version: 1,
    size: [
        1,
        1,
        1
    ],
    structure: {
        block_indices: [
            [0],
            [-1]
        ],
        entities: [],
        palette: {
            default: {
                block_palette: [
                    {
                        name: "minecraft:chest",
                        states: {
                            "minecraft:cardinal_direction": "east"
                        },
                        version: 18168865
                    }
                ],
                block_position_data: {
                    0: {
                        block_entity_data: {
                            Findable: 0b,
                            Items: [
                            ],
                            id: "Chest"
                        }
                    }
                }
            }
        }
    },
    structure_world_origin: [
        -2,
        -59,
        5
    ]
}`

function App() {
  const [snbtContent, setSnbtContent] = useState(DEFAULT_SNBT)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [currentItemSnbt, setCurrentItemSnbt] = useState('')
  const [items, setItems] = useState<Record<number, any>>({})
  const [customTemplates, setCustomTemplates] = useState<TemplateData[]>([])
  const [customImages, setCustomImages] = useState<Record<string, string>>({})
  const customImagesRef = useRef<Record<string, string>>(customImages)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const iconInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // IndexedDBからカスタムテンプレートを読み込む
    getCustomTemplates().then(setCustomTemplates)
  }, [])

  useEffect(() => {
    customImagesRef.current = customImages
  }, [customImages])

  // snbtContentが変更されたときにアイテムデータを更新
  useEffect(() => {
    const itemMap = extractAllItemsFromSNBT(snbtContent)
    setItems(itemMap)
  }, [snbtContent])

  // ファイル選択時の処理
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const snbt = await mcstructureToSNBT(file)
      setSnbtContent(snbt)
    } catch (error) {
      console.error('Import error:', error)
      alert(
        `ファイルの読み込みに失敗しました: ${error instanceof Error ? error.message : String(error)}`
      )
    }

    //初期化
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Importボタンのクリック処理
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  // アイコン画像選択時の処理
  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || selectedSlot === null) return

    const key = `slot_${selectedSlot}`

    const url = URL.createObjectURL(file)
    setCustomImages((prev) => ({ ...prev, [key]: url }))

    if (iconInputRef.current) {
      iconInputRef.current.value = ''
    }
  }

  // Exportボタンのクリック処理
  const handleExportClick = async () => {
    if (!snbtContent.trim()) {
      alert('エクスポートするSNBTデータがありません')
      return
    }

    try {
      const uint8Array = await snbtToMcstructure(snbtContent)

      //download
      const blob = new Blob([new Uint8Array(uint8Array)], {
        type: 'application/octet-stream',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${crypto.randomUUID()}.mcstructure`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert(
        `エクスポートに失敗しました: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  // スロット選択時の処理
  const handleSlotSelect = (slot: number) => {
    setSelectedSlot(slot)

    if (!snbtContent.trim()) {
      setCurrentItemSnbt('')
      return
    }

    const itemSnbt = extractItemFromSNBT(snbtContent, slot)
    setCurrentItemSnbt(itemSnbt || '')
  }

  // アイテム編集時の処理
  const handleItemChange = (newItemSnbt: string) => {
    setCurrentItemSnbt(newItemSnbt)

    if (!newItemSnbt.trim() || selectedSlot === null || !snbtContent.trim()) {
      return
    }

    try {
      const updatedSnbt = updateItemInSNBT(
        snbtContent,
        selectedSlot,
        newItemSnbt
      )
      setSnbtContent(updatedSnbt)
    } catch (error) {
      console.error('Update item error:', error)
    }
  }

  // テンプレート選択からアイテムへの適用処理
  const handleTemplateSelect = async (template: TemplateData) => {
    if (selectedSlot === null) return

    let modifiedTemplate = template.snbt
    const slotKey = `slot_${selectedSlot}`

    if (template.image) {
      setCustomImages((prev) => ({
        ...prev,
        [slotKey]: template.image!,
      }))
    }

    handleItemChange(modifiedTemplate)
  }

  // テンプレート追加処理
  const handleAddTemplate = async () => {
    if (currentItemSnbt.trim()) {
      const slotKey = `slot_${selectedSlot}`
      const newTemplate: TemplateData = {
        id: crypto.randomUUID(),
        snbt: currentItemSnbt,
        image: customImagesRef.current[slotKey],
        isDefault: false,
      }

      await addCustomTemplate(newTemplate)
      setCustomTemplates((prev) => [...prev, newTemplate])
    }
  }

  // テンプレート削除処理
  const handleDeleteTemplate = async (templateId: string) => {
    await deleteCustomTemplate(templateId)
    setCustomTemplates((prev) => prev.filter((t) => t.id !== templateId))
  }

  // ドラッグ＆ドロップでの機能追加 (.knezip)
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer?.files
      if (!files) return

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.name.endsWith('.knezip')) {
          try {
            const JSZip = (await import('jszip')).default
            const zip = await JSZip.loadAsync(file)

            // snbtを検索
            let snbtContentTemp = ''
            const snbtFile = zip.file('item.snbt')
            if (snbtFile) {
              snbtContentTemp = await snbtFile.async('string')
            }

            // 画像を検索
            const imgFile =
              zip.file(/image\.(png|svg|jpg|jpeg|webp)$/i)[0] ||
              zip.file(/.+\.(png|svg|jpg|jpeg|webp)$/i)[0]

            if (snbtContentTemp) {
              const newTemplate: TemplateData = {
                id: crypto.randomUUID(),
                snbt: snbtContentTemp,
                isDefault: false,
              }

              if (imgFile) {
                const uint8Array = await imgFile.async('uint8array')
                let mimeType = 'image/png'
                const lowerName = imgFile.name.toLowerCase()
                if (lowerName.endsWith('.svg')) mimeType = 'image/svg+xml'
                else if (
                  lowerName.endsWith('.jpg') ||
                  lowerName.endsWith('.jpeg')
                )
                  mimeType = 'image/jpeg'
                else if (lowerName.endsWith('.webp')) mimeType = 'image/webp'

                const blob = new Blob([new Uint8Array(uint8Array)], {
                  type: mimeType,
                })
                const reader = new FileReader()
                reader.readAsDataURL(blob)
                reader.onloadend = async () => {
                  newTemplate.image = reader.result as string
                  await addCustomTemplate(newTemplate)
                  setCustomTemplates((prev) => [...prev, newTemplate])
                }
              } else {
                await addCustomTemplate(newTemplate)
                setCustomTemplates((prev) => [...prev, newTemplate])
              }
            }
          } catch (err) {
            console.error('Failed to load .kne.zip:', err)
          }
        }
      }
    }

    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('drop', handleDrop)
    return () => {
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('drop', handleDrop)
    }
  }, [])

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".mcstructure,.nbt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        ref={iconInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleIconChange}
      />
      <header className="flex items-center justify-start flex-none w-full h-10 bg-type-1">
        <img src={logo} alt="Logo" className="inline w-8 mx-1" />
        <span className="-mb-1 text-[1.6rem] font-bai-jamjuree text-primary-300">
          <span className="text-[1.7rem]">K</span>ais
          <span className="text-[1.7rem]">NBTE</span>ditor
        </span>
      </header>
      <main className="flex items-center justify-center w-full h-[calc(100vh-40px)] bg-primary-800 font-bai-jamjuree text-primary-300">
        <div className="w-[95%] h-[90%] md:w-[85%] md:h-[80%] flex items-center justify-start md:justify-center gap-3 md:gap-10 flex-col md:flex-row">
          <div className="h-full w-[90%] md:w-[50%] flex flex-col justify-between">
            <ChestPreview
              onSlotSelect={handleSlotSelect}
              selectedSlot={selectedSlot}
              items={items}
              customImages={customImages}
            />
            <div className="w-full h-[30%] md:h-[16%] flex justify-between pt-2">
              <div
                className="w-[48%] h-full bg-type-1-button flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleImportClick}
              >
                <span className="text-[22px] md:text-[24px]">Import</span>
              </div>
              <div
                className="w-[48%] h-full bg-type-1-button flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleExportClick}
              >
                <span className="text-[22px] md:text-[24px]">Export</span>
              </div>
            </div>
          </div>
          <div className="md:h-full w-[90%] md:w-[50%] flex flex-col justify-start md:justify-between">
            <TemplateBox
              templates={[...DEFAULT_TEMPLATES, ...customTemplates]}
              onTemplateSelect={handleTemplateSelect}
              onTemplateDelete={handleDeleteTemplate}
            />
            <NBTEditor
              value={currentItemSnbt}
              onChange={handleItemChange}
              onAddTemplate={handleAddTemplate}
              onChangeIcon={
                selectedSlot !== null && items[selectedSlot]
                  ? () => iconInputRef.current?.click()
                  : undefined
              }
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default App
