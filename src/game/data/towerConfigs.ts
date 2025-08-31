import { TowerConfig, TowerType, DamageType } from '../components/TowerComponent'

/**
 * 塔配置数据
 */
export const TOWER_CONFIGS: { [key: string]: TowerConfig } = {
  [TowerType.SINGLE]: {
    id: TowerType.SINGLE,
    name: '单体塔',
    type: TowerType.SINGLE,
    damageType: DamageType.PHYSICAL,
    baseDamage: 15,
    attackRate: 1.0,
    range: 120,
    cost: 50,
    projectileSpeed: 300,
    upgradePath: [
      { level: 2, cost: 30, damageBonus: 8, attackRateBonus: 0.2, rangeBonus: 10 },
      { level: 3, cost: 50, damageBonus: 12, attackRateBonus: 0.3, rangeBonus: 15 },
      { level: 4, cost: 80, damageBonus: 18, attackRateBonus: 0.4, rangeBonus: 20 },
      { level: 5, cost: 120, damageBonus: 25, attackRateBonus: 0.5, rangeBonus: 25 }
    ]
  },

  [TowerType.AOE]: {
    id: TowerType.AOE,
    name: '溅射塔',
    type: TowerType.AOE,
    damageType: DamageType.PHYSICAL,
    baseDamage: 10,
    attackRate: 0.8,
    range: 100,
    cost: 70,
    projectileSpeed: 250,
    splashRadius: 40,
    upgradePath: [
      { level: 2, cost: 40, damageBonus: 6, attackRateBonus: 0.15, rangeBonus: 8, specialBonus: { splashRadius: 5 } },
      { level: 3, cost: 65, damageBonus: 10, attackRateBonus: 0.25, rangeBonus: 12, specialBonus: { splashRadius: 8 } },
      { level: 4, cost: 100, damageBonus: 15, attackRateBonus: 0.35, rangeBonus: 16, specialBonus: { splashRadius: 12 } },
      { level: 5, cost: 150, damageBonus: 22, attackRateBonus: 0.45, rangeBonus: 20, specialBonus: { splashRadius: 16 } }
    ]
  },

  [TowerType.SLOW]: {
    id: TowerType.SLOW,
    name: '减速塔',
    type: TowerType.SLOW,
    damageType: DamageType.MAGICAL,
    baseDamage: 5,
    attackRate: 1.2,
    range: 110,
    cost: 60,
    projectileSpeed: 200,
    slowAmount: 0.4,
    slowDuration: 3000,
    upgradePath: [
      { level: 2, cost: 35, damageBonus: 3, attackRateBonus: 0.2, rangeBonus: 10, specialBonus: { slowAmount: 0.1 } },
      { level: 3, cost: 55, damageBonus: 5, attackRateBonus: 0.3, rangeBonus: 15, specialBonus: { slowAmount: 0.15, slowDuration: 500 } },
      { level: 4, cost: 85, damageBonus: 8, attackRateBonus: 0.4, rangeBonus: 20, specialBonus: { slowAmount: 0.2, slowDuration: 1000 } },
      { level: 5, cost: 130, damageBonus: 12, attackRateBonus: 0.5, rangeBonus: 25, specialBonus: { slowAmount: 0.25, slowDuration: 1500 } }
    ]
  },

  [TowerType.LASER]: {
    id: TowerType.LASER,
    name: '激光塔',
    type: TowerType.LASER,
    damageType: DamageType.MAGICAL,
    baseDamage: 8,
    attackRate: 2.0,
    range: 150,
    cost: 90,
    upgradePath: [
      { level: 2, cost: 50, damageBonus: 5, attackRateBonus: 0.3, rangeBonus: 15 },
      { level: 3, cost: 80, damageBonus: 8, attackRateBonus: 0.5, rangeBonus: 20 },
      { level: 4, cost: 120, damageBonus: 12, attackRateBonus: 0.7, rangeBonus: 25 },
      { level: 5, cost: 180, damageBonus: 18, attackRateBonus: 1.0, rangeBonus: 30 }
    ]
  },

  [TowerType.CHAIN]: {
    id: TowerType.CHAIN,
    name: '连锁塔',
    type: TowerType.CHAIN,
    damageType: DamageType.MAGICAL,
    baseDamage: 12,
    attackRate: 0.7,
    range: 90,
    cost: 85,
    projectileSpeed: 400,
    chainCount: 3,
    upgradePath: [
      { level: 2, cost: 45, damageBonus: 7, attackRateBonus: 0.1, rangeBonus: 8, specialBonus: { chainCount: 1 } },
      { level: 3, cost: 70, damageBonus: 11, attackRateBonus: 0.15, rangeBonus: 12, specialBonus: { chainCount: 1 } },
      { level: 4, cost: 110, damageBonus: 16, attackRateBonus: 0.2, rangeBonus: 16, specialBonus: { chainCount: 1 } },
      { level: 5, cost: 160, damageBonus: 23, attackRateBonus: 0.25, rangeBonus: 20, specialBonus: { chainCount: 1 } }
    ]
  },

  [TowerType.MULTI]: {
    id: TowerType.MULTI,
    name: '多重塔',
    type: TowerType.MULTI,
    damageType: DamageType.PHYSICAL,
    baseDamage: 6,
    attackRate: 1.5,
    range: 95,
    cost: 75,
    projectileSpeed: 350,
    multiCount: 3,
    upgradePath: [
      { level: 2, cost: 40, damageBonus: 4, attackRateBonus: 0.2, rangeBonus: 8, specialBonus: { multiCount: 1 } },
      { level: 3, cost: 65, damageBonus: 6, attackRateBonus: 0.3, rangeBonus: 12, specialBonus: { multiCount: 1 } },
      { level: 4, cost: 100, damageBonus: 9, attackRateBonus: 0.4, rangeBonus: 16, specialBonus: { multiCount: 1 } },
      { level: 5, cost: 145, damageBonus: 13, attackRateBonus: 0.5, rangeBonus: 20, specialBonus: { multiCount: 1 } }
    ]
  }
}

/**
 * 获取塔配置
 */
export function getTowerConfig(towerType: TowerType): TowerConfig {
  return TOWER_CONFIGS[towerType]
}

/**
 * 获取所有塔配置
 */
export function getAllTowerConfigs(): TowerConfig[] {
  return Object.values(TOWER_CONFIGS)
}