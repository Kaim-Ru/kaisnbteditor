import * as NBT from 'nbtify'

/**
 * mcstructure形式のNBTデータの型定義
 */
interface McstructureNBT {
  structure: {
    palette: {
      default: {
        block_position_data: {
          [key: string]: any
        }
        [key: string]: any
      }
      [key: string]: any
    }
    [key: string]: any
  }
  [key: string]: any
}

/**
 * NBTデータがmcstructure形式かどうかを検証
 * @param nbtData NBTデータ
 * @returns mcstructure形式であればtrue
 */
function isMcstructureFormat(nbtData: any): nbtData is McstructureNBT {
  // NBTData.dataからデータを取得
  const data = nbtData.data

  if (!data || typeof data !== 'object') {
    return false
  }

  if (
    !('structure' in data) ||
    !data.structure ||
    typeof data.structure !== 'object'
  ) {
    return false
  }

  if (
    !('palette' in data.structure) ||
    !data.structure.palette ||
    typeof data.structure.palette !== 'object'
  ) {
    return false
  }

  if (
    !('default' in data.structure.palette) ||
    !data.structure.palette.default ||
    typeof data.structure.palette.default !== 'object'
  ) {
    return false
  }

  // block_paletteの検証
  if (
    !('block_palette' in data.structure.palette.default) ||
    !Array.isArray(data.structure.palette.default.block_palette) ||
    data.structure.palette.default.block_palette.length === 0
  ) {
    return false
  }

  // block_paletteの中にminecraft:chestが含まれているか確認
  const hasChest = data.structure.palette.default.block_palette.some(
    (block: any) =>
      block &&
      typeof block === 'object' &&
      'name' in block &&
      block.name?.valueOf() === 'minecraft:chest'
  )

  if (!hasChest) {
    return false
  }

  if (
    !('block_position_data' in data.structure.palette.default) ||
    !data.structure.palette.default.block_position_data ||
    typeof data.structure.palette.default.block_position_data !== 'object'
  ) {
    return false
  }

  return true
}

/**
 * mcstructureファイル（リトルエンディアンNBT）をSNBTに変換
 * @param file mcstructureファイル
 * @returns SNBT文字列
 */
export async function mcstructureToSNBT(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  const nbtData = await NBT.read(uint8Array, {
    endian: 'little',
    compression: null,
  })

  if (!isMcstructureFormat(nbtData)) {
    throw new Error(
      'Invalid mcstructure format: The file does not have the expected structure'
    )
  }

  // SNBTに変換（整形あり）
  const snbt = NBT.stringify(nbtData, { space: 2 })
  return snbt
}

/**
 * SNBTをmcstructureファイル（リトルエンディアンNBT）に変換
 * @param snbtText SNBT文字列
 * @returns mcstructureファイルのUint8Array
 */
export async function snbtToMcstructure(snbtText: string): Promise<Uint8Array> {
  const nbtData = NBT.parse(snbtText)

  const uint8Array = await NBT.write(nbtData, {
    endian: 'little',
    compression: null,
  })

  return uint8Array
}

/**
 * SNBTを整形して返す
 * @param snbtText SNBT文字列
 * @returns 整形されたSNBT文字列
 */
export function formatSNBT(snbtText: string): string {
  const nbtData = NBT.parse(snbtText)
  return NBT.stringify(nbtData, { space: 2 })
}

/**
 * SNBTの検証
 * @param snbtText SNBT文字列
 * @returns エラーメッセージ（エラーがない場合はnull）
 */
export function validateSNBT(snbtText: string): string | null {
  try {
    NBT.parse(snbtText)
    return null
  } catch (error) {
    return error instanceof Error ? error.message : String(error)
  }
}

/**
 * mcstructure SNBTから指定スロットのアイテムを抽出
 * @param snbtText mcstructure全体のSNBT文字列
 * @param slotNumber スロット番号（0-26）
 * @returns アイテムのSNBT文字列、存在しない場合はnull
 */
export function extractItemFromSNBT(
  snbtText: string,
  slotNumber: number
): string | null {
  try {
    const nbtData = NBT.parse(snbtText) as McstructureNBT
    // NBT.parseは通常のオブジェクトを返すので、.dataは不要
    const data = nbtData.data || nbtData

    const blockPositionData = data.structure.palette.default.block_position_data
    const firstKey = Object.keys(blockPositionData)[0]
    const items = blockPositionData[firstKey].block_entity_data.Items

    const item = items.find((item: any) => item.Slot?.valueOf() === slotNumber)

    if (!item) {
      return null
    }

    return NBT.stringify(item, { space: 2 })
  } catch (error) {
    console.error('Extract item error:', error)
    return null
  }
}

/**
 * mcstructure SNBTの指定スロットのアイテムを更新
 * @param snbtText mcstructure全体のSNBT文字列
 * @param slotNumber スロット番号（0-26）
 * @param itemSnbt 更新するアイテムのSNBT文字列
 * @returns 更新されたmcstructure全体のSNBT文字列
 */
export function updateItemInSNBT(
  snbtText: string,
  slotNumber: number,
  itemSnbt: string
): string {
  const nbtData = NBT.parse(snbtText) as McstructureNBT
  const itemData = NBT.parse(itemSnbt)
  // NBT.parseは通常のオブジェクトを返すので、.dataは不要
  const data = nbtData.data || nbtData

  const blockPositionData = data.structure.palette.default.block_position_data
  const firstKey = Object.keys(blockPositionData)[0]
  const items = blockPositionData[firstKey].block_entity_data.Items

  const itemIndex = items.findIndex(
    (item: any) => item.Slot?.valueOf() === slotNumber
  )

  if (itemIndex !== -1) {
    items[itemIndex] = itemData
  } else {
    items.push(itemData)
  }

  // SNBTに変換して返す
  return NBT.stringify(data, { space: 2 })
}
