import { System, Entity } from '../core/ECS'
import { PositionComponent } from '../components/PositionComponent'
import { VelocityComponent } from '../components/VelocityComponent'

/**
 * 移动系统 - 处理实体的位置更新
 */
export class MovementSystem extends System {
  constructor() {
    super()
    this.priority = 10 // 较低优先级，在其他系统之后执行
  }

  update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      const position = entity.getComponent(PositionComponent)
      const velocity = entity.getComponent(VelocityComponent)

      if (position && velocity && position.enabled && velocity.enabled) {
        // 更新位置
        const deltaX = velocity.vx * deltaTime / 1000
        const deltaY = velocity.vy * deltaTime / 1000

        position.addPosition(deltaX, deltaY)
      }
    }
  }
}