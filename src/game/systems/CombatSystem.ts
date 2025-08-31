import { System, Entity } from '../core/ECS'
import { PositionComponent } from '../components/PositionComponent'
import { HealthComponent } from '../components/HealthComponent'
import { TowerComponent } from '../components/TowerComponent'
import { MonsterComponent } from '../components/MonsterComponent'
import { ProjectileComponent } from '../components/ProjectileComponent'
import { BuffComponent, BuffType, createSlowBuff } from '../components/BuffComponent'
import { VelocityComponent } from '../components/VelocityComponent'
import { ECSManager } from '../core/ECS'

/**
 * 战斗系统 - 处理塔的攻击、弹道飞行、伤害结算等
 */
export class CombatSystem extends System {
  private ecsManager: ECSManager

  constructor() {
    super()
    this.priority = 20 // 在移动系统之后执行
    this.ecsManager = ECSManager.getInstance()
  }

  update(entities: Entity[], _deltaTime: number): void {
    // 处理塔的攻击逻辑
    this.processTowerAttacks(entities)

    // 处理弹道飞行和碰撞检测
    this.processProjectiles(entities)

    // 处理Buff效果
    this.processBuffs(entities, _deltaTime)
  }

  /**
   * 处理塔的攻击逻辑
   */
  private processTowerAttacks(entities: Entity[]): void {
    const towers = entities.filter(entity =>
      entity.hasComponent(TowerComponent) &&
      entity.hasComponent(PositionComponent)
    )

    for (const towerEntity of towers) {
      const tower = towerEntity.getComponent(TowerComponent)!
      const towerPos = towerEntity.getComponent(PositionComponent)!

      if (!tower.canAttack(Date.now())) {
        continue
      }

      // 寻找目标
      const target = this.findTarget(towerEntity, tower, towerPos)
      if (target) {
        this.attackTarget(towerEntity, tower, target)
        tower.performAttack(Date.now())
      }
    }
  }

  /**
   * 寻找攻击目标
   */
  private findTarget(towerEntity: Entity, tower: TowerComponent, towerPos: PositionComponent): Entity | null {
    const monsters = this.ecsManager.queryEntities(MonsterComponent, PositionComponent, HealthComponent)

    let bestTarget: Entity | null = null
    let bestDistance = tower.getCurrentRange()

    for (const monsterEntity of monsters) {
      const monsterPos = monsterEntity.getComponent(PositionComponent)!
      const distance = towerPos.distanceTo(monsterPos)

      if (distance <= tower.getCurrentRange()) {
        // 检查飞行单位限制
        const monster = monsterEntity.getComponent(MonsterComponent)!
        if (monster.isFlying() && tower.type !== 'laser') {
          continue // 只有激光塔能攻击飞行单位
        }

        if (distance < bestDistance) {
          bestTarget = monsterEntity
          bestDistance = distance
        }
      }
    }

    return bestTarget
  }

  /**
   * 攻击目标
   */
  private attackTarget(towerEntity: Entity, tower: TowerComponent, target: Entity): void {
    const towerPos = towerEntity.getComponent(PositionComponent)!
    const targetPos = target.getComponent(PositionComponent)!

    // 创建弹道
    this.createProjectile(tower, towerPos, target)
  }

  /**
   * 创建弹道
   */
  private createProjectile(tower: TowerComponent, towerPos: PositionComponent, target: Entity): void {
    const projectile = this.ecsManager.createEntity()
    const _projectilePos = projectile.addComponent(new PositionComponent(towerPos.x, towerPos.y))
    const projectileComp = projectile.addComponent(new ProjectileComponent(
      this.getProjectileType(tower.type),
      tower.getCurrentDamage(),
      tower.damageType,
      tower.config.projectileSpeed || 200
    ))

    // 设置目标
    projectileComp.targetId = target.id
    projectileComp.sourceId = tower.entityId

    // 计算方向
    const targetPos = target.getComponent(PositionComponent)!
    const dx = targetPos.x - towerPos.x
    const dy = targetPos.y - towerPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 0) {
      projectile.addComponent(new VelocityComponent(
        (dx / distance) * projectileComp.speed,
        (dy / distance) * projectileComp.speed
      ))
    }

    // 设置特殊效果参数
    this.setupProjectileEffects(tower, projectileComp)
  }

  /**
   * 获取弹道类型
   */
  private getProjectileType(towerType: string): any {
    const typeMap: { [key: string]: any } = {
      'single': 'bullet',
      'aoe': 'aoe',
      'slow': 'slow',
      'laser': 'laser',
      'chain': 'chain',
      'multi': 'multi'
    }
    return typeMap[towerType] || 'bullet'
  }

  /**
   * 设置弹道特殊效果
   */
  private setupProjectileEffects(tower: TowerComponent, projectile: ProjectileComponent): void {
    switch (tower.type) {
      case 'aoe':
        if (tower.config.splashRadius) {
          projectile.setSplash(tower.config.splashRadius)
        }
        break
      case 'chain':
        if (tower.config.chainCount) {
          projectile.setChain(tower.config.chainCount)
        }
        break
      case 'multi':
        if (tower.config.multiCount) {
          projectile.setMulti(tower.config.multiCount)
        }
        break
    }
  }

  /**
   * 处理弹道飞行和碰撞
   */
  private processProjectiles(entities: Entity[]): void {
    const projectiles = entities.filter(entity =>
      entity.hasComponent(ProjectileComponent) &&
      entity.hasComponent(PositionComponent) &&
      entity.hasComponent(VelocityComponent)
    )

    for (const projectileEntity of projectiles) {
      const projectile = projectileEntity.getComponent(ProjectileComponent)!
      const position = projectileEntity.getComponent(PositionComponent)!

      // 检查碰撞
      const target = this.ecsManager.getEntity(projectile.targetId!)
      if (target) {
        const _targetPos = target.getComponent(PositionComponent)!
        const distance = position.distanceTo(_targetPos)

        if (distance < 10) { // 命中距离
          this.hitTarget(projectileEntity, projectile, target)
          this.ecsManager.destroyEntity(projectileEntity.id)
        }
      }
    }
  }

  /**
   * 击中目标
   */
  private hitTarget(projectileEntity: Entity, projectile: ProjectileComponent, target: Entity): void {
    this.dealDamage(projectile, target)

    // 处理特殊效果
    this.applySpecialEffects(projectile, target)
  }

  /**
   * 造成伤害
   */
  private dealDamage(projectile: ProjectileComponent, target: Entity): void {
    const health = target.getComponent(HealthComponent)
    const monster = target.getComponent(MonsterComponent)

    if (health && monster) {
      const actualDamage = monster.calculateDamage(projectile.damage, projectile.damageType)
      health.takeDamage(actualDamage)
    }
  }

  /**
   * 应用特殊效果
   */
  private applySpecialEffects(projectile: ProjectileComponent, target: Entity): void {
    let buffComp = target.getComponent(BuffComponent)
    if (!buffComp) {
      buffComp = target.addComponent(new BuffComponent())
    }

    switch (projectile.type) {
      case 'slow': {
        // 应用减速效果
        const slowBuff = createSlowBuff(0.4, 3000, projectile.sourceId)
        buffComp.addBuff(slowBuff)
        break
      }
    }
  }

  /**
   * 处理Buff效果
   */
  private processBuffs(entities: Entity[], deltaTime: number): void {
    const buffEntities = entities.filter(entity => entity.hasComponent(BuffComponent))

    for (const entity of buffEntities) {
      const buffComp = entity.getComponent(BuffComponent)!
      const expiredBuffs = buffComp.updateBuffs(deltaTime)

      // 处理过期Buff的清理逻辑
      for (const expiredBuff of expiredBuffs) {
        this.handleBuffExpiration(entity, expiredBuff)
      }
    }
  }

  /**
   * 处理Buff过期
   */
  private handleBuffExpiration(entity: Entity, buff: any): void {
    // 处理特定Buff过期的逻辑
    switch (buff.type) {
      case BuffType.SHIELD: {
        // 护盾消失
        const health = entity.getComponent(HealthComponent)
        if (health) {
          health.shieldHP = 0
        }
        break
      }
    }
  }
}