import { Component } from '../core/ECS'
import { DamageType } from './TowerComponent'

/**
 * 弹道类型枚举
 */
export enum ProjectileType {
  BULLET = 'bullet',     // 普通子弹
  LASER = 'laser',       // 激光
  AOE = 'aoe',          // 溅射
  CHAIN = 'chain',      // 连锁
  MULTI = 'multi',      // 多重
  SLOW = 'slow'         // 减速弹道
}

/**
 * 弹道组件
 */
export class ProjectileComponent extends Component {
  type: ProjectileType
  damage: number
  damageType: DamageType
  speed: number
  targetId?: string
  sourceId?: string
  lifetime: number
  maxLifetime: number

  // 特殊效果参数
  splashRadius?: number
  chainCount?: number
  chainTargets?: string[]
  multiCount?: number

  constructor(
    type: ProjectileType,
    damage: number,
    damageType: DamageType,
    speed: number,
    maxLifetime: number = 5000
  ) {
    super()
    this.type = type
    this.damage = damage
    this.damageType = damageType
    this.speed = speed
    this.lifetime = 0
    this.maxLifetime = maxLifetime
  }

  /**
   * 更新弹道生命周期
   */
  updateLifetime(deltaTime: number): boolean {
    this.lifetime += deltaTime
    return this.lifetime >= this.maxLifetime
  }

  /**
   * 设置溅射参数
   */
  setSplash(radius: number): void {
    this.splashRadius = radius
  }

  /**
   * 设置连锁参数
   */
  setChain(count: number): void {
    this.chainCount = count
    this.chainTargets = []
  }

  /**
   * 设置多重参数
   */
  setMulti(count: number): void {
    this.multiCount = count
  }

  /**
   * 添加连锁目标
   */
  addChainTarget(targetId: string): void {
    if (this.chainTargets && !this.chainTargets.includes(targetId)) {
      this.chainTargets.push(targetId)
    }
  }

  /**
   * 检查是否可以连锁到目标
   */
  canChainTo(targetId: string): boolean {
    if (!this.chainTargets || !this.chainCount) return false
    return this.chainTargets.length < this.chainCount && !this.chainTargets.includes(targetId)
  }

  /**
   * 获取连锁次数
   */
  getChainCount(): number {
    return this.chainTargets?.length || 0
  }
}