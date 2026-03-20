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
  const [templates, setTemplates] = useState<string[]>([])
  const [customImages, setCustomImages] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const iconInputRef = useRef<HTMLInputElement>(null)

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

    const item = items[selectedSlot]
    const name = item?.Name?.valueOf?.() || item?.Name || ''
    if (!name) return

    const url = URL.createObjectURL(file)
    setCustomImages((prev) => ({ ...prev, [name]: url }))

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

  // テンプレート追加処理
  const handleAddTemplate = () => {
    if (currentItemSnbt.trim()) {
      setTemplates([...templates, currentItemSnbt])
    }
  }

  // テンプレート削除処理
  const handleDeleteTemplate = (index: number) => {
    setTemplates(templates.filter((_, i) => i !== index))
  }

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
              templates={templates}
              onTemplateSelect={handleItemChange}
              onTemplateDelete={handleDeleteTemplate}
              customImages={customImages}
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
