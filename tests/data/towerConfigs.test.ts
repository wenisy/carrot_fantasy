import { describe, it, expect } from 'vitest'
import { TOWER_CONFIGS, getTowerConfig, getAllTowerConfigs } from '../../src/game/data/towerConfigs'
import { TowerType, DamageType } from '../../src/game/components/TowerComponent'

describe('Tower Configurations', () => {
  it('should have all tower types defined', () => {
    const expectedTypes = [
      TowerType.SINGLE,
      TowerType.AOE,
      TowerType.SLOW,
      TowerType.LASER,
      TowerType.CHAIN,
      TowerType.MULTI
    ]

    expectedTypes.forEach(type => {
      expect(TOWER_CONFIGS[type]).toBeDefined()
    })
  })

  it('should return correct tower config', () => {
    const singleTower = getTowerConfig(TowerType.SINGLE)

    expect(singleTower.id).toBe(TowerType.SINGLE)
    expect(singleTower.name).toBe('单体塔')
    expect(singleTower.damageType).toBe(DamageType.PHYSICAL)
    expect(singleTower.baseDamage).toBe(15)
    expect(singleTower.attackRate).toBe(1.0)
    expect(singleTower.range).toBe(120)
  })

  it('should have upgrade paths', () => {
    const aoeTower = getTowerConfig(TowerType.AOE)

    expect(aoeTower.upgradePath).toBeDefined()
    expect(aoeTower.upgradePath.length).toBeGreaterThan(0)

    const firstUpgrade = aoeTower.upgradePath[0]
    expect(firstUpgrade.level).toBe(2)
    expect(firstUpgrade.cost).toBeGreaterThan(0)
    expect(firstUpgrade.damageBonus).toBeDefined()
  })

  it('should return all tower configs', () => {
    const allConfigs = getAllTowerConfigs()

    expect(allConfigs).toHaveLength(6)
    expect(allConfigs.every(config => config.id && config.name)).toBe(true)
  })

  it('should have valid projectile configurations', () => {
    const laserTower = getTowerConfig(TowerType.LASER)

    expect(laserTower.projectileSpeed).toBeDefined()
    expect(laserTower.projectileSpeed).toBeGreaterThan(0)
  })

  it('should have splash configurations for AOE towers', () => {
    const aoeTower = getTowerConfig(TowerType.AOE)

    expect(aoeTower.splashRadius).toBeDefined()
    expect(aoeTower.splashRadius).toBeGreaterThan(0)
  })

  it('should have chain configurations for chain towers', () => {
    const chainTower = getTowerConfig(TowerType.CHAIN)

    expect(chainTower.chainCount).toBeDefined()
    expect(chainTower.chainCount).toBeGreaterThan(0)
  })

  it('should have multi configurations for multi towers', () => {
    const multiTower = getTowerConfig(TowerType.MULTI)

    expect(multiTower.multiCount).toBeDefined()
    expect(multiTower.multiCount).toBeGreaterThan(0)
  })

  it('should have slow configurations for slow towers', () => {
    const slowTower = getTowerConfig(TowerType.SLOW)

    expect(slowTower.slowAmount).toBeDefined()
    expect(slowTower.slowAmount).toBeGreaterThan(0)
    expect(slowTower.slowDuration).toBeDefined()
    expect(slowTower.slowDuration).toBeGreaterThan(0)
  })
})