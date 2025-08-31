import { Component } from '../core/ECS'

/**
 * 位置组件
 */
export class PositionComponent extends Component {
  x: number = 0
  y: number = 0

  constructor(x: number = 0, y: number = 0) {
    super()
    this.x = x
    this.y = y
  }

  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  addPosition(dx: number, dy: number): void {
    this.x += dx
    this.y += dy
  }

  distanceTo(other: PositionComponent): number {
    const dx = this.x - other.x
    const dy = this.y - other.y
    return Math.sqrt(dx * dx + dy * dy)
  }
}