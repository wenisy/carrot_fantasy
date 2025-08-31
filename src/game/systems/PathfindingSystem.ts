import { System, Entity } from '../core/ECS'
import { PositionComponent } from '../components/PositionComponent'
import { VelocityComponent } from '../components/VelocityComponent'
import { MonsterComponent } from '../components/MonsterComponent'
import { MapComponent, Waypoint } from '../components/MapComponent'
import { ECSManager } from '../core/ECS'

/**
 * 寻路系统 - 处理怪物的路径跟随
 */
export class PathfindingSystem extends System {
  private ecsManager: ECSManager
  private mapEntity: Entity | null = null

  constructor() {
    super()
    this.priority = 10 // 在移动系统之前执行
    this.ecsManager = ECSManager.getInstance()
  }

  update(_entities: Entity[], _deltaTime: number): void {
    // 找到地图实体
    if (!this.mapEntity) {
      this.mapEntity = this.findMapEntity()
    }

    if (!this.mapEntity) return

    const mapComponent = this.mapEntity.getComponent(MapComponent)!
    const monsters = this.ecsManager.queryEntities(MonsterComponent, PositionComponent, VelocityComponent)

    for (const monsterEntity of monsters) {
      this.updateMonsterPath(monsterEntity, mapComponent)
    }
  }

  private findMapEntity(): Entity | null {
    const entities = this.ecsManager.getAllEntities()
    return entities.find((entity: Entity) => entity.hasComponent(MapComponent)) || null
  }

  private updateMonsterPath(monsterEntity: Entity, mapComponent: MapComponent): void {
    const position = monsterEntity.getComponent(PositionComponent)!
    const velocity = monsterEntity.getComponent(VelocityComponent)!
    const monster = monsterEntity.components.get('MonsterComponent') as MonsterComponent

    // 获取当前目标路径点
    let targetWaypoint = monster.targetWaypoint

    if (!targetWaypoint) {
      // 如果没有目标路径点，获取下一个路径点
      targetWaypoint = mapComponent.getNextWaypoint(position.x, position.y)
      if (targetWaypoint) {
        monster.targetWaypoint = targetWaypoint
        monster.targetWaypointIndex = this.getWaypointIndex(mapComponent, targetWaypoint)
      }
    }

    if (targetWaypoint) {
      const worldTarget = mapComponent.getWorldPosition(targetWaypoint.x, targetWaypoint.y)
      const dx = worldTarget.x - position.x
      const dy = worldTarget.y - position.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 5) { // 到达路径点
        // 获取下一个路径点
        const nextWaypoint = this.getNextWaypoint(mapComponent, monster.targetWaypointIndex!)
        if (nextWaypoint) {
          monster.targetWaypoint = nextWaypoint
          monster.targetWaypointIndex!++
        } else {
          // 到达终点
          monster.targetWaypoint = null
          monster.targetWaypointIndex = -1
          velocity.vx = 0
          velocity.vy = 0
          // TODO: 怪物到达基地，扣除生命值
          this.handleMonsterReachedBase(monsterEntity)
          return
        }
      }

      // 更新移动方向
      if (distance > 0) {
        const speed = monster.getCurrentSpeed()
        velocity.vx = (dx / distance) * speed
        velocity.vy = (dy / distance) * speed
      }
    } else {
      // 没有路径点，停止移动
      velocity.vx = 0
      velocity.vy = 0
    }
  }

  private getWaypointIndex(mapComponent: MapComponent, waypoint: Waypoint): number {
    const waypoints = mapComponent.getPath()
    for (let i = 0; i < waypoints.length; i++) {
      if (waypoints[i].x === waypoint.x && waypoints[i].y === waypoint.y) {
        return i
      }
    }
    return -1
  }

  private getNextWaypoint(mapComponent: MapComponent, currentIndex: number): Waypoint | null {
    const waypoints = mapComponent.getPath()
    if (currentIndex >= 0 && currentIndex < waypoints.length - 1) {
      return waypoints[currentIndex + 1]
    }
    return null
  }

  private handleMonsterReachedBase(monsterEntity: Entity): void {
    // TODO: 实现怪物到达基地的逻辑
    // 扣除玩家生命值
    // 播放音效
    // 显示伤害数字
    // 销毁怪物实体

    // console.log('Monster reached base!')
    this.ecsManager.destroyEntity(monsterEntity.id)
  }

  /**
   * 计算两点之间的路径（用于未来可能的复杂寻路）
   */
  public calculatePath(startX: number, startY: number, endX: number, endY: number, mapComponent: MapComponent): Waypoint[] {
    // 简单的直线路径计算
    const path: Waypoint[] = []
    const steps = Math.max(Math.abs(endX - startX), Math.abs(endY - startY))

    for (let i = 0; i <= steps; i++) {
      const t = steps > 0 ? i / steps : 1
      const x = Math.round(startX + (endX - startX) * t)
      const y = Math.round(startY + (endY - startY) * t)

      if (mapComponent.isWalkable(x, y)) {
        path.push({ x, y })
      }
    }

    return path
  }

  /**
   * 检查路径是否被阻挡
   */
  public isPathBlocked(startX: number, startY: number, endX: number, endY: number, mapComponent: MapComponent): boolean {
    const path = this.calculatePath(startX, startY, endX, endY, mapComponent)

    for (const point of path) {
      if (!mapComponent.isWalkable(point.x, point.y)) {
        return true
      }
    }

    return false
  }
}