import { formatSNBT } from './utils/nbt-converter'

const templateData = [
  [
    `{Count: 1b,Name: "minecraft:diamond_sword"}`,
    'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20/assets/minecraft/textures/item/diamond_sword.png',
  ],
  [
    `{Count: 1b,Name: "minecraft:diamond_sword"}`,
    'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20/assets/minecraft/textures/item/diamond_sword.png',
  ],
]

export const DEFAULT_TEMPLATES = templateData.map((item) => formatSNBT(item[0]))

export const DEFAULT_CUSTOM_IMAGES = templateData.reduce(
  (acc, item, index) => {
    acc[`template_${index}`] = item[1]
    return acc
  },
  {} as Record<string, string>
)
