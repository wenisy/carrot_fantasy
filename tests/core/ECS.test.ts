import { describe, it, expect, beforeEach } from 'vitest'
import { Entity, Component, System, ECSManager } from '../../src/game/core/ECS'

class TestComponent extends Component {
  value: number

  constructor(value: number = 0) {
    super()
    this.value = value
  }
}

class TestSystem extends System {
  updateCount = 0

  update(entities: Entity[]): void {
    this.updateCount++
  }
}

describe('ECS System', () => {
  let ecs: ECSManager

  beforeEach(() => {
    // Create a fresh ECS instance for each test
    ecs = ECSManager.createForTesting()
  })

  it('should create entities with unique IDs', () => {
    const entity1 = ecs.createEntity()
    const entity2 = ecs.createEntity()

    expect(entity1.id).toBeDefined()
    expect(entity2.id).toBeDefined()
    expect(entity1.id).not.toBe(entity2.id)
  })

  it('should add and retrieve components', () => {
    const entity = ecs.createEntity()
    const component = new TestComponent(42)

    entity.addComponent(component)

    const retrieved = entity.getComponent(TestComponent)
    expect(retrieved).toBe(component)
    expect(retrieved?.value).toBe(42)
  })

  it('should check component existence', () => {
    const entity = ecs.createEntity()

    expect(entity.hasComponent(TestComponent)).toBe(false)

    entity.addComponent(new TestComponent())
    expect(entity.hasComponent(TestComponent)).toBe(true)
  })

  it('should remove components', () => {
    const entity = ecs.createEntity()
    const component = new TestComponent()

    entity.addComponent(component)
    expect(entity.hasComponent(TestComponent)).toBe(true)

    entity.removeComponent(TestComponent)
    expect(entity.hasComponent(TestComponent)).toBe(false)
  })

  it('should destroy entities', () => {
    const entity = ecs.createEntity()
    const entityId = entity.id

    expect(ecs.getEntity(entityId)).toBe(entity)

    ecs.destroyEntity(entityId)
    expect(ecs.getEntity(entityId)).toBeUndefined()
  })

  it('should update systems', () => {
    const system = new TestSystem()

    ecs.addSystem(system)

    ecs.update(16) // Simulate 16ms delta time
    expect(system.updateCount).toBe(1)

    ecs.update(16)
    expect(system.updateCount).toBe(2)
  })

  it('should query entities by components', () => {
    // Create entities with different component combinations
    const entity1 = ecs.createEntity()
    entity1.addComponent(new TestComponent(1))

    const entity2 = ecs.createEntity()
    entity2.addComponent(new TestComponent(2))

    const entity3 = ecs.createEntity()
    // entity3 has no components

    const results = ecs.queryEntities(TestComponent)
    expect(results).toHaveLength(2)
    expect(results).toContain(entity1)
    expect(results).toContain(entity2)
    expect(results).not.toContain(entity3)
  })
})