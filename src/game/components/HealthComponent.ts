import { Component } from '../core/ECS'

/**
 * 生命值组件
 */
export class HealthComponent extends Component {
  currentHP: number = 100
  maxHP: number = 100
  shieldHP: number = 0
  isAlive: boolean = true

  constructor(maxHP: number = 100, currentHP?: number) {
    super()
    this.maxHP = maxHP
    this.currentHP = currentHP ?? maxHP
  }

  /**
   * 受到伤害
   */
  takeDamage(damage: number): number {
    if (!this.isAlive) return 0

    let actualDamage = damage

    // 先扣护盾
    if (this.shieldHP > 0) {
      if (this.shieldHP >= damage) {
        this.shieldHP -= damage
        actualDamage = 0
      } else {
        actualDamage -= this.shieldHP
        this.shieldHP = 0
      }
    }

    // 扣血量
    if (actualDamage > 0) {
      this.currentHP -= actualDamage
      if (this.currentHP <= 0) {
        this.currentHP = 0
        this.isAlive = false
      }
    }

    return actualDamage
  }

  /**
   * 治疗
   */
  heal(amount: number): number {
    if (!this.isAlive) return 0

    const oldHP = this.currentHP
    this.currentHP = Math.min(this.maxHP, this.currentHP + amount)
    return this.currentHP - oldHP
  }

  /**
   * 设置护盾
   */
  setShield(amount: number): void {
    this.shieldHP = Math.max(0, amount)
  }

  /**
   * 添加护盾
   */
  addShield(amount: number): void {
    this.shieldHP = Math.max(0, this.shieldHP + amount)
  }

  /**
   * 获取生命值百分比
   */
  getHealthPercentage(): number {
    return this.maxHP > 0 ? this.currentHP / this.maxHP : 0
  }

  /**
   * 是否满血
   */
  isFullHealth(): boolean {
    return this.currentHP >= this.maxHP
  }

  /**
   * 重置生命值
   */
  reset(maxHP?: number): void {
    if (maxHP !== undefined) {
      this.maxHP = maxHP
    }
    this.currentHP = this.maxHP
    this.shieldHP = 0
    this.isAlive = true
  }
}