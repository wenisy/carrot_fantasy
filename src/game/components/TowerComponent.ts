import { Component } from '../core/ECS'

/**
 * 塔类型枚举
 */
export enum TowerType {
  SINGLE = 'single',      // 单体高伤
  AOE = 'aoe',           // 溅射AOE
  SLOW = 'slow',         // 减速持续
  LASER = 'laser',       // 穿透直线
  CHAIN = 'chain',       // 连锁弹跳
  MULTI = 'multi'        // 多重箭
}

/**
 * 伤害类型枚举
 */
export enum DamageType {
  PHYSICAL = 'physical',
  MAGICAL = 'magical',
  TRUE = 'true'
}

/**
 * 塔配置数据
 */
export interface TowerConfig {
  id: string
  name: string
  type: TowerType
  damageType: DamageType
  baseDamage: number
  attackRate: number
  range: number
  cost: number
  projectileSpeed?: number
  splashRadius?: number
  chainCount?: number
  slowAmount?: number
  slowDuration?: number
  multiCount?: number
  upgradePath: TowerUpgrade[]
}

/**
 * 塔升级数据
 */
export interface TowerUpgrade {
  level: number
  cost: number
  damageBonus: number
  attackRateBonus: number
  rangeBonus: number
  specialBonus?: any
}

/**
 * 塔组件
 */
export class TowerComponent extends Component {
  type: TowerType
  config: TowerConfig
  level: number = 1
  experience: number = 0
  lastAttackTime: number = 0
  targetId?: string
  damageType: DamageType

  constructor(config: TowerConfig) {
    super()
    this.type = config.type
    this.config = config
    this.damageType = config.damageType
  }

  /**
   * 获取当前等级的伤害
   */
  getCurrentDamage(): number {
    const baseDamage = this.config.baseDamage
    const damageBonus = this.getUpgradeBonus('damageBonus')
    return baseDamage + damageBonus
  }

  /**
   * 获取当前等级的攻速
   */
  getCurrentAttackRate(): number {
    const baseRate = this.config.attackRate
    const rateBonus = this.getUpgradeBonus('attackRateBonus')
    return baseRate + rateBonus
  }

  /**
   * 获取当前等级的射程
   */
  getCurrentRange(): number {
    const baseRange = this.config.range
    const rangeBonus = this.getUpgradeBonus('rangeBonus')
    return baseRange + rangeBonus
  }

  /**
   * 获取升级加成
   */
  private getUpgradeBonus(bonusType: keyof TowerUpgrade): number {
    let totalBonus = 0
    for (let i = 1; i < this.level; i++) {
      const upgrade = this.config.upgradePath.find(u => u.level === i)
      if (upgrade && bonusType in upgrade) {
        totalBonus += upgrade[bonusType] as number
      }
    }
    return totalBonus
  }

  /**
   * 升级塔
   */
  upgrade(): boolean {
    const nextLevel = this.level + 1
    const upgrade = this.config.upgradePath.find(u => u.level === nextLevel)

    if (upgrade) {
      this.level = nextLevel
      return true
    }

    return false
  }

  /**
   * 获取升级费用
   */
  getUpgradeCost(): number {
    const nextLevel = this.level + 1
    const upgrade = this.config.upgradePath.find(u => u.level === nextLevel)
    return upgrade?.cost || 0
  }

  /**
   * 检查是否可以升级
   */
  canUpgrade(): boolean {
    return this.getUpgradeCost() > 0
  }

  /**
   * 获取出售价格
   */
  getSellPrice(): number {
    let totalCost = this.config.cost
    for (let i = 1; i < this.level; i++) {
      const upgrade = this.config.upgradePath.find(u => u.level === i)
      if (upgrade) {
        totalCost += upgrade.cost
      }
    }
    return Math.floor(totalCost * 0.7) // 70%返还
  }

  /**
   * 检查是否可以攻击
   */
  canAttack(currentTime: number): boolean {
    const attackInterval = 1000 / this.getCurrentAttackRate()
    return currentTime - this.lastAttackTime >= attackInterval
  }

  /**
   * 执行攻击
   */
  performAttack(currentTime: number): void {
    this.lastAttackTime = currentTime
  }
}