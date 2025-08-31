import { Component } from '../core/ECS'

/**
 * Buff类型枚举
 */
export enum BuffType {
  SLOW = 'slow',           // 减速
  SPEED_BOOST = 'speed_boost', // 加速
  DAMAGE_BOOST = 'damage_boost', // 伤害提升
  ARMOR_BREAK = 'armor_break', // 破甲
  SHIELD = 'shield',       // 护盾
  DOT = 'dot',            // 持续伤害
  STUN = 'stun'           // 眩晕
}

/**
 * Buff数据结构
 */
export interface BuffData {
  id: string
  type: BuffType
  value: number
  duration: number
  remainingTime: number
  sourceId?: string
  stackable: boolean
  maxStacks: number
  currentStacks: number
}

/**
 * Buff组件
 */
export class BuffComponent extends Component {
  buffs: Map<string, BuffData> = new Map()

  constructor() {
    super()
  }

  /**
   * 添加Buff
   */
  addBuff(buffData: BuffData): void {
    const existingBuff = this.buffs.get(buffData.id)

    if (existingBuff && buffData.stackable) {
      // 可叠加Buff
      if (existingBuff.currentStacks < buffData.maxStacks) {
        existingBuff.currentStacks++
        existingBuff.remainingTime = Math.max(existingBuff.remainingTime, buffData.duration)
        existingBuff.value = buffData.value * existingBuff.currentStacks
      }
    } else if (!existingBuff) {
      // 新Buff
      this.buffs.set(buffData.id, { ...buffData })
    }
  }

  /**
   * 移除Buff
   */
  removeBuff(buffId: string): boolean {
    return this.buffs.delete(buffId)
  }

  /**
   * 获取Buff
   */
  getBuff(buffId: string): BuffData | undefined {
    return this.buffs.get(buffId)
  }

  /**
   * 检查是否有指定类型的Buff
   */
  hasBuffType(buffType: BuffType): boolean {
    for (const buff of this.buffs.values()) {
      if (buff.type === buffType) {
        return true
      }
    }
    return false
  }

  /**
   * 获取指定类型的Buff值总和
   */
  getBuffValue(buffType: BuffType): number {
    let totalValue = 0
    for (const buff of this.buffs.values()) {
      if (buff.type === buffType) {
        totalValue += buff.value
      }
    }
    return totalValue
  }

  /**
   * 更新Buff（减少持续时间）
   */
  updateBuffs(deltaTime: number): BuffData[] {
    const expiredBuffs: BuffData[] = []

    for (const [id, buff] of this.buffs) {
      buff.remainingTime -= deltaTime

      if (buff.remainingTime <= 0) {
        expiredBuffs.push(buff)
        this.buffs.delete(id)
      }
    }

    return expiredBuffs
  }

  /**
   * 清空所有Buff
   */
  clearBuffs(): void {
    this.buffs.clear()
  }

  /**
   * 获取所有活跃Buff
   */
  getActiveBuffs(): BuffData[] {
    return Array.from(this.buffs.values())
  }

  /**
   * 获取Buff数量
   */
  getBuffCount(): number {
    return this.buffs.size
  }
}

/**
 * 创建减速Buff
 */
export function createSlowBuff(value: number, duration: number, sourceId?: string): BuffData {
  return {
    id: `slow_${Date.now()}`,
    type: BuffType.SLOW,
    value,
    duration,
    remainingTime: duration,
    sourceId,
    stackable: false,
    maxStacks: 1,
    currentStacks: 1
  }
}

/**
 * 创建护盾Buff
 */
export function createShieldBuff(value: number, duration: number, sourceId?: string): BuffData {
  return {
    id: `shield_${Date.now()}`,
    type: BuffType.SHIELD,
    value,
    duration,
    remainingTime: duration,
    sourceId,
    stackable: false,
    maxStacks: 1,
    currentStacks: 1
  }
}

/**
 * 创建持续伤害Buff
 */
export function createDotBuff(value: number, duration: number, sourceId?: string): BuffData {
  return {
    id: `dot_${Date.now()}`,
    type: BuffType.DOT,
    value,
    duration,
    remainingTime: duration,
    sourceId,
    stackable: false,
    maxStacks: 1,
    currentStacks: 1
  }
}