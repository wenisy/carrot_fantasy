import { Component } from '../core/ECS'

/**
 * 速度组件
 */
export class VelocityComponent extends Component {
  vx: number = 0
  vy: number = 0
  speed: number = 0
  maxSpeed: number = 100

  constructor(vx: number = 0, vy: number = 0, maxSpeed: number = 100) {
    super()
    this.vx = vx
    this.vy = vy
    this.maxSpeed = maxSpeed
    this.updateSpeed()
  }

  /**
   * 设置速度向量
   */
  setVelocity(vx: number, vy: number): void {
    this.vx = vx
    this.vy = vy
    this.updateSpeed()
  }

  /**
   * 设置速度大小和方向
   */
  setSpeedAndDirection(speed: number, angle: number): void {
    this.speed = Math.min(speed, this.maxSpeed)
    this.vx = Math.cos(angle) * this.speed
    this.vy = Math.sin(angle) * this.speed
  }

  /**
   * 添加速度
   */
  addVelocity(dvx: number, dvy: number): void {
    this.vx += dvx
    this.vy += dvy
    this.updateSpeed()
  }

  /**
   * 停止移动
   */
  stop(): void {
    this.vx = 0
    this.vy = 0
    this.speed = 0
  }

  /**
   * 标准化速度
   */
  normalize(): void {
    const length = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    if (length > 0) {
      this.vx /= length
      this.vy /= length
      this.speed = Math.min(length, this.maxSpeed)
      this.vx *= this.speed
      this.vy *= this.speed
    }
  }

  /**
   * 获取移动方向角度
   */
  getAngle(): number {
    return Math.atan2(this.vy, this.vx)
  }

  /**
   * 更新速度大小
   */
  private updateSpeed(): void {
    this.speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    if (this.speed > this.maxSpeed) {
      this.normalize()
    }
  }
}