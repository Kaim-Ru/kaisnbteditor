import { formatSNBT } from './utils/nbt-converter'

export type TemplateData = {
  id: string
  snbt: string
  image?: string
  isDefault?: boolean
}

const templateData = [
  [
    `{Count: 1b,Damage: 0s,Name: "minecraft:stick",Slot: 0b,WasPickedUp: 0b}`,
    'https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/stick.png',
  ],
  [
    `{Block:{name:"minecraft:stone",states:{},version:18168865},Count:1b,Damage:0s,Name:"minecraft:stone",Slot:1b,WasPickedUp:0b}`,
    'https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/blocks/stone.png',
  ],
  //GOD NETHERITE SWORD
  [
    `{Count:1b,Damage:0s,Name:"minecraft:netherite_sword",Slot:2b,WasPickedUp:0b,tag:{display:{Name:"GODNETHERITEHESWORD"},ench:[{id:9s,lvl:32767s},{id:13s,lvl:32767s},{id:14s,lvl:32767s},{id:17s,lvl:32767s},{id:12s,lvl:32767s}]}}`,
    'https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/netherite_sword.png',
  ],
  [
    `{Count:1b,Damage:0s,Name:"minecraft:netherite_helmet",Slot:3b,WasPickedUp:0b,tag:{display:{Name:"GODNETHERITEHELMET"},ench:[{id:0s,lvl:32767s},{id:2s,lvl:32767s},{id:5s,lvl:32767s},{id:6s,lvl:32767s},{id:7s,lvl:32767s},{id:8s,lvl:32767s},{id:17s,lvl:32767s}]}}`,
    'https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/netherite_helmet.png',
  ],
  [
    `{Block:{name:"minecraft:moving_block",states:{},version:18168865},Count:1b,Damage:0s,Name:"minecraft:moving_block",Slot:4b,WasPickedUp:0b,tag:{RepairCost:0,display:{Name:"Barrelinglass"},ench:[],"minecraft:keep_on_death":1b,movingBlock:{name:"minecraft:barrel",states:{},version:17760256},movingBlockExtra:{name:"minecraft:glass",states:{},version:18168865}}}`,
    `https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/blocks/missing_tile.png`,
  ],
  [
    `{Block:{name:"minecraft:beehive",states:{direction:0,honey_level:0},version:18168865},Count:1b,Damage:0s,Name:"minecraft:beehive",Slot:5b,WasPickedUp:0b,tag:{Occupants:[{ActorIdentifier:"minecraft:villager<>",SaveData:{Air:300s,Armor:[{Count:0b,Damage:0s,Name:"",WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",WasPickedUp:0b}],Attributes:[{Base:20.0f,Current:20.0f,DefaultMax:20.0f,DefaultMin:0.0f,Max:20.0f,Min:0.0f,Name:"minecraft:health"},{Base:128.0f,Current:128.0f,DefaultMax:2048.0f,DefaultMin:0.0f,Max:2048.0f,Min:0.0f,Name:"minecraft:follow_range"},{Base:0.0f,Current:0.0f,DefaultMax:1.0f,DefaultMin:0.0f,Max:1.0f,Min:0.0f,Name:"minecraft:knockback_resistance"},{Base:0.5f,Current:0.5f,DefaultMax:"3.4028230607370965e+38.0f",DefaultMin:0.0f,Max:"3.4028230607370965e+38.0f",Min:0.0f,Name:"minecraft:movement"},{Base:0.019999999552965164f,Current:0.019999999552965164f,DefaultMax:"3.4028230607370965e+38.0f",DefaultMin:0.0f,Max:"3.4028230607370965e+38.0f",Min:0.0f,Name:"minecraft:underwater_movement"},{Base:0.019999999552965164f,Current:0.019999999552965164f,DefaultMax:"3.4028230607370965e+38.0f",DefaultMin:0.0f,Max:"3.4028230607370965e+38.0f",Min:0.0f,Name:"minecraft:lava_movement"},{Base:0.0f,Current:0.0f,DefaultMax:16.0f,DefaultMin:0.0f,Max:16.0f,Min:0.0f,Name:"minecraft:absorption"},{Base:0.0f,Current:0.0f,DefaultMax:1024.0f,DefaultMin:-1024.0f,Max:1024.0f,Min:-1024.0f,Name:"minecraft:luck"}],ChestItems:[{Count:0b,Damage:0s,Name:"",Slot:0b,WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",Slot:1b,WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",Slot:2b,WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",Slot:3b,WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",Slot:4b,WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",Slot:5b,WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",Slot:6b,WasPickedUp:0b},{Count:0b,Damage:0s,Name:"",Slot:7b,WasPickedUp:0b}],Chested:0b,Color:0b,Color2:0b,Dead:0b,DeathTime:0s,DwellingUniqueID:"00000000-0000-0000-0000-000000000000",FallDistance:0.0f,HighTierCuredDiscount:0,HurtTime:0s,InventoryVersion:"1.26.3",Invulnerable:0b,IsAngry:0b,IsAutonomous:0b,IsBaby:0b,IsEating:0b,IsGliding:0b,IsGlobal:0b,IsIllagerCaptain:0b,IsInRaid:0b,IsOrphaned:0b,IsOutOfControl:0b,IsPregnant:0b,IsRoaring:0b,IsScared:0b,IsStunned:0b,IsSwimming:0b,IsTamed:0b,IsTrusting:0b,LeasherID:-1l,LootDropped:0b,LowTierCuredDiscount:0,Mainhand:[{Count:0b,Damage:0s,Name:"",WasPickedUp:0b}],MarkVariant:0,NaturalSpawn:0b,NearbyCuredDiscount:0,NearbyCuredDiscountTimeStamp:0,Offers:{Recipes:[{buyA:{Count:1b,Damage:32767s,Name:"minecraft:emerald",WasPickedUp:0b},buyCountA:1,buyCountB:0,demand:0,maxUses:99999,priceMultiplierA:0.05000000074505806f,priceMultiplierB:0.0f,rewardExp:1b,sell:{Count:1b,Damage:0s,Name:"minecraft:diamond",WasPickedUp:0b},tier:0,traderExp:2,uses:0},{buyA:{Count:1b,Damage:32767s,Name:"minecraft:diamond",WasPickedUp:0b},buyCountA:1,buyCountB:0,demand:0,maxUses:99999,priceMultiplierA:0.05000000074505806f,priceMultiplierB:0.0f,rewardExp:1b,sell:{Count:1b,Damage:0s,Name:"minecraft:emerald",WasPickedUp:0b},tier:0,traderExp:1,uses:0}],TierExpRequirements:[{0:0}]},Offhand:[{Count:0b,Damage:0s,Name:"",WasPickedUp:0b}],OnGround:1b,OwnerNew:-1l,Persistent:1b,PortalCooldown:0,Pos:[7.619551181793213f,-59.0f,12.699999809265137f],PreferredProfession:"fisherman",ReactToBell:0b,RewardPlayersOnFirstFounding:1b,Riches:0,Rotation:[136.7353973388672f,18.705659866333008f],Saddled:0b,Sheared:0b,ShowBottom:0b,Sitting:0b,SkinID:1,SlotDropChances:[{DropChance:0.0f,Slot:"mainhand"}],Strength:0,StrengthMax:0,Surface:0b,Tags:[],TargetID:-1l,TradeExperience:0,TradeTablePath:"trading/economy_trades/fisherman_trades.json",TradeTier:0,UniqueID:-25769803748l,Variant:2,Willing:0b,boundX:0,boundY:0,boundZ:0,canPickupItems:0b,definitions:["+minecraft:villager_v2","+villager_skin_1","+adult","+fisherman","+behavior_peasant","+basic_schedule","-job_specific_goals","-play_schedule_villager","-trade_resupply_component_group","+make_and_receive_love","+wander_schedule_villager"],hasBoundOrigin:0b,hasSetCanPickupItems:1b,identifier:"minecraft:villager_v2",internalComponents:{}},TicksLeftToStay:0}],ShouldSpawnBees:0b,display:{Name:"MODDEDVILLAGER"}}}`,
    `https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/blocks/beehive_front.png`,
  ],
]

export const DEFAULT_TEMPLATES: TemplateData[] = templateData.map(
  (item, index) => ({
    id: `default_${index}`,
    snbt: formatSNBT(item[0]),
    image: item[1],
    isDefault: true,
  })
)
