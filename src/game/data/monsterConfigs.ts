import { MonsterConfig, MonsterType } from '../components/MonsterComponent'

/**
 * 怪物配置数据
 */
export const MONSTER_CONFIGS: { [key: string]: MonsterConfig } = {
  [MonsterType.NORMAL]: {
    id: MonsterType.NORMAL,
    name: '普通怪',
    type: MonsterType.NORMAL,
    baseHP: 50,
    moveSpeed: 50,
    physicalResist: 0.0,
    magicalResist: 0.0,
    reward: 10
  },

  [MonsterType.FAST]: {
    id: MonsterType.FAST,
    name: '快速怪',
    type: MonsterType.FAST,
    baseHP: 30,
    moveSpeed: 80,
    physicalResist: 0.0,
    magicalResist: 0.0,
    reward: 12
  },

  [MonsterType.HEAVY]: {
    id: MonsterType.HEAVY,
    name: '重甲怪',
    type: MonsterType.HEAVY,
    baseHP: 150,
    moveSpeed: 30,
    physicalResist: 0.5,
    magicalResist: 0.2,
    reward: 20
  },

  [MonsterType.FLYING]: {
    id: MonsterType.FLYING,
    name: '飞行怪',
    type: MonsterType.FLYING,
    baseHP: 40,
    moveSpeed: 60,
    physicalResist: 0.0,
    magicalResist: 0.0,
    reward: 15,
    flying: true
  },

  [MonsterType.SHIELD]: {
    id: MonsterType.SHIELD,
    name: '护盾怪',
    type: MonsterType.SHIELD,
    baseHP: 60,
    moveSpeed: 45,
    physicalResist: 0.0,
    magicalResist: 0.0,
    reward: 18,
    shieldHP: 30
  },

  [MonsterType.BOSS]: {
    id: MonsterType.BOSS,
    name: 'Boss怪',
    type: MonsterType.BOSS,
    baseHP: 500,
    moveSpeed: 25,
    physicalResist: 0.3,
    magicalResist: 0.3,
    reward: 100,
    boss: true,
    specialAbilities: ['summon', 'speed_boost']
  }
}

/**
 * 根据波次计算怪物属性
 */
export function getMonsterStatsForWave(baseConfig: MonsterConfig, waveNumber: number): MonsterConfig {
  const waveMultiplier = Math.pow(1.1, waveNumber - 1) // 每波增加10%

  return {
    ...baseConfig,
    baseHP: Math.floor(baseConfig.baseHP * waveMultiplier),
    moveSpeed: baseConfig.moveSpeed, // 速度不随波次增加
    reward: Math.floor(baseConfig.reward * waveMultiplier),
    shieldHP: baseConfig.shieldHP ? Math.floor(baseConfig.shieldHP * waveMultiplier) : undefined
  }
}

/**
 * 获取怪物配置
 */
export function getMonsterConfig(monsterType: MonsterType): MonsterConfig {
  return MONSTER_CONFIGS[monsterType]
}

/**
 * 获取所有怪物配置
 */
export function getAllMonsterConfigs(): MonsterConfig[] {
  return Object.values(MONSTER_CONFIGS)
}

/**
 * 获取普通怪物列表（用于波次生成）
 */
export function getNormalMonsters(): MonsterType[] {
  return [
    MonsterType.NORMAL,
    MonsterType.FAST,
    MonsterType.HEAVY,
    MonsterType.FLYING,
    MonsterType.SHIELD
  ]
}