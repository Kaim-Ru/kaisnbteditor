import blockPreview from '../assets/block_preview.svg'
import ingotPreview from '../assets/ingot_preview.svg'
import stickPreview from '../assets/stick_preview.svg'

interface ChestPreviewProps {
  onSlotSelect?: (slot: number) => void
  selectedSlot?: number | null
  items?: Record<number, any>
}

/**
 * アイテムに応じて適切なプレビュー画像を取得
 */
function getPreviewImage(item: any): string {
  // Blockプロパティがあるか確認
  if (item.Block) {
    return blockPreview
  }
  
  // Nameフィールドを取得
  const name = item.Name?.valueOf?.() || item.Name || ''
  
  // Ingotが含まれているか確認
  if (typeof name === 'string' && name.toLowerCase().includes('ingot')) {
    return ingotPreview
  }
  
  // デフォルトはstick
  return stickPreview
}

export default function ChestPreview({
  onSlotSelect,
  selectedSlot,
  items = {},
}: ChestPreviewProps) {
  return (
    <div className="w-full h-[80%] md:h-[75%] min-h-52 flex flex-col justify-between">
      <div className="w-full h-[15%] bg-type-1 flex items-center justify-center">
        <div className="absolute w-3 h-8 mt-8 md:mt-16 md:h-13 md:w-7 bg-type-2"></div>
      </div>
      <div className="w-full h-[82%] bg-type-1 flex items-center justify-center">
        <div className="grid w-full grid-cols-9 grid-rows-3 gap-1 p-0.5 md:p-2 lg:w-full aspect-3/1 md:gap-2 max-w-125 md:max-w-none">
          {Array.from({ length: 27 }).map((_, i) => {
            const item = items[i]
            const hasItem = !!item
            
            return (
              <div
                key={i}
                className={`w-full cursor-pointer relative ${selectedSlot === i ? 'bg-type-2-selected' : 'bg-type-2-hover'}`}
                onClick={() => onSlotSelect?.(i)}
              >
                {hasItem && (
                  <img
                    src={getPreviewImage(item)}
                    alt="item preview"
                    className="absolute inset-0 w-full h-full p-1 pointer-events-none"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
