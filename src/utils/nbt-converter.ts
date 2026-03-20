import * as NBT from 'nbtify'

/**
 * mcstructureファイル（リトルエンディアンNBT）をSNBTに変換
 * @param file mcstructureファイル
 * @returns SNBT文字列
 */
export async function mcstructureToSNBT(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  // リトルエンディアンNBTを読み込み
  const nbtData = await NBT.read(uint8Array, {
    endian: 'little',
    compression: null,
  })

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
  // SNBTをパース
  const nbtData = NBT.parse(snbtText)

  // リトルエンディアンNBTに変換
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
