import * as NBT from 'nbtify'
import { parse as parseSNBT } from '@ironm00n/nbt-ts'

const parsed = parseSNBT('{Count: 1b, Name: "minecraft:stone", Slot: 0b}')
console.log(parsed)
try {
  console.log(NBT.stringify({ test: parsed }))
} catch (e) {
  console.error(e)
}
