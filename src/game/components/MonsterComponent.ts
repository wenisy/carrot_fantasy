import { Component } from '../core/ECS'

/**
 * 怪物类型枚举
 */
export enum MonsterType {
  NORMAL = 'normal',     // 普通
  FAST = 'fast',         // 快速
  HEAVY = 'heavy',       // 重甲
  FLYING = 'flying',     // 飞行
  SHIELD = 'shield',     // 护盾
  BOSS = 'boss'          // Boss
}

/**
 * 怪物配置数据
 */
export interface MonsterConfig {
  id: string
  name: string
  type: MonsterType
  baseHP: number
  moveSpeed: number
  physicalResist: number
  magicalResist: number
  reward: number
  shieldHP?: number
  flying?: boolean
  boss?: boolean
  specialAbilities?: string[]
}

/**
 * 怪物组件
 */
export class MonsterComponent extends Component {
  type: MonsterType
  config: MonsterConfig
  pathIndex: number = 0
  distanceTraveled: number = 0

  constructor(config: MonsterConfig) {
    super()
    this.type = config.type
    this.config = config
  }

  /**
   * 获取当前血量百分比
   */
  getHealthPercentage(): number {
    // 需要配合HealthComponent使用
    return 1.0
  }

  /**
   * 检查是否是飞行单位
   */
  isFlying(): boolean {
    return this.config.flying || false
  }

  /**
   * 检查是否是Boss
   */
  isBoss(): boolean {
    return this.config.boss || false
  }

  /**
   * 获取奖励金币
   */
  getReward(): number {
    return this.config.reward
  }

  /**
   * 获取护盾血量
   */
  getShieldHP(): number {
    return this.config.shieldHP || 0
  }

  /**
   * 检查是否有护盾
   */
  hasShield(): boolean {
    return this.getShieldHP() > 0
  }

  /**
   * 获取物理抗性
   */
  getPhysicalResist(): number {
    return this.config.physicalResist
  }

  /**
   * 获取魔法抗性
   */
  getMagicalResist(): number {
    return this.config.magicalResist
  }

  /**
   * 计算实际伤害
   */
  calculateDamage(rawDamage: number, damageType: 'physical' | 'magical' | 'true'): number {
    if (damageType === 'true') {
      return rawDamage // 真实伤害无视抗性
    }

    const resist = damageType === 'physical'
      ? this.getPhysicalResist()
      : this.getMagicalResist()

    return Math.max(0, rawDamage * (1 - resist))
  }

  /**
   * 移动到下一个路径点
   */
  moveToNextWaypoint(): void {
    this.pathIndex++
  }

  /**
   * 获取当前路径点索引
   */
  getCurrentWaypointIndex(): number {
    return this.pathIndex
  }

  /**
   * 检查是否到达终点
   */
  hasReachedEnd(totalWaypoints: number): boolean {
    return this.pathIndex >= totalWaypoints
  }

  /**
   * 重置路径状态
   */
  resetPath(): void {
    this.pathIndex = 0
    this.distanceTraveled = 0
  }
}