/**
 * ECS (Entity Component System) 架构核心
 */

// 组件基类
export abstract class Component {
  enabled: boolean = true
  entityId?: string
}

// 实体类
export class Entity {
  id: string
  components: Map<string, Component> = new Map()
  enabled: boolean = true

  constructor(id: string) {
    this.id = id
  }

  addComponent<T extends Component>(component: T): T {
    component.entityId = this.id
    this.components.set(component.constructor.name, component)
    return component
  }

  getComponent<T extends Component>(componentClass: new () => T): T | undefined {
    return this.components.get(componentClass.name) as T
  }

  removeComponent(componentClass: new () => Component): boolean {
    return this.components.delete(componentClass.name)
  }

  hasComponent(componentClass: new () => Component): boolean {
    return this.components.has(componentClass.name)
  }

  destroy(): void {
    this.enabled = false
    this.components.clear()
  }
}

// 系统基类
export abstract class System {
  enabled: boolean = true
  priority: number = 0

  abstract update(entities: Entity[], deltaTime: number): void
}

// ECS管理器
export class ECSManager {
  private static instance: ECSManager
  private entities: Map<string, Entity> = new Map()
  private systems: System[] = []
  private nextEntityId: number = 0

  private constructor() {}

  static getInstance(): ECSManager {
    if (!ECSManager.instance) {
      ECSManager.instance = new ECSManager()
    }
    return ECSManager.instance
  }

  /**
   * 创建新实体
   */
  createEntity(): Entity {
    const id = `entity_${this.nextEntityId++}`
    const entity = new Entity(id)
    this.entities.set(id, entity)
    return entity
  }

  /**
   * 获取实体
   */
  getEntity(id: string): Entity | undefined {
    return this.entities.get(id)
  }

  /**
   * 销毁实体
   */
  destroyEntity(id: string): boolean {
    const entity = this.entities.get(id)
    if (entity) {
      entity.destroy()
      return this.entities.delete(id)
    }
    return false
  }

  /**
   * 添加系统
   */
  addSystem(system: System): void {
    this.systems.push(system)
    this.systems.sort((a, b) => a.priority - b.priority)
  }

  /**
   * 移除系统
   */
  removeSystem(system: System): boolean {
    const index = this.systems.indexOf(system)
    if (index !== -1) {
      this.systems.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 更新所有系统
   */
  update(deltaTime: number): void {
    const activeEntities = Array.from(this.entities.values()).filter(entity => entity.enabled)

    for (const system of this.systems) {
      if (system.enabled) {
        system.update(activeEntities, deltaTime)
      }
    }
  }

  /**
   * 根据组件类型查询实体
   */
  queryEntities(...componentClasses: (new () => Component)[]): Entity[] {
    return Array.from(this.entities.values()).filter(entity =>
      entity.enabled &&
      componentClasses.every(componentClass => entity.hasComponent(componentClass))
    )
  }

  /**
   * 清理已销毁的实体
   */
  cleanup(): void {
    for (const [id, entity] of this.entities) {
      if (!entity.enabled) {
        this.entities.delete(id)
      }
    }
  }

  /**
   * 获取所有实体数量
   */
  getEntityCount(): number {
    return this.entities.size
  }

  /**
   * 获取活跃实体数量
   */
  getActiveEntityCount(): number {
    return Array.from(this.entities.values()).filter(entity => entity.enabled).length
  }
}