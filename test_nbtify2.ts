import * as NBT from 'nbtify';
const snbt = `{
    format_version: 1,
    size: [1, 1, 1],
    structure: {
        palette: {
            default: {
                block_position_data: {
                    0: {
                        block_entity_data: {
                            Items: [
                                { Count: 1b, Name: "minecraft:stone", Slot: 0b }
                            ]
                        }
                    }
                }
            }
        }
    }
}`;
const nbtData = NBT.parse(snbt);
console.log(nbtData);

console.log("NBT.Byte:", new NBT.Byte(2));
const item = NBT.parse('{ Count: 1b, Name: "minecraft:stone", Slot: 0b }');
item.Slot = new NBT.Byte(2);
console.log(item);

const updatedSnbt = NBT.stringify(nbtData, { space: 2 });
console.log(updatedSnbt);
