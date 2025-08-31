/**
 * 关卡配置数据结构
 */
export interface LevelConfig {
  id: string
  name: string
  description: string
  waypoints: { x: number; y: number }[]
  spawnPoint: { x: number; y: number }
  basePosition: { x: number; y: number }
  initialGold: number
  initialLives: number
  waves: WaveConfig[]
  allowedTowers: string[]
  backgroundColor: number
}

/**
 * 波次配置
 */
export interface WaveConfig {
  id: number
  name: string
  monsters: MonsterSpawn[]
  reward: number
  delay: number // 波次间隔时间（毫秒）
}

/**
 * 怪物生成配置
 */
export interface MonsterSpawn {
  type: string
  count: number
  interval: number // 生成间隔（毫秒）
  delay: number // 首次生成延迟（毫秒）
}

/**
 * 关卡配置数据
 */
export const LEVEL_CONFIGS: { [key: string]: LevelConfig } = {
  level1: {
    id: 'level1',
    name: '第一关',
    description: '学习基本的塔防玩法',
    waypoints: [
      { x: 50, y: 300 },
      { x: 200, y: 300 },
      { x: 350, y: 200 },
      { x: 500, y: 200 },
      { x: 650, y: 300 },
      { x: 750, y: 300 }
    ],
    spawnPoint: { x: 50, y: 300 },
    basePosition: { x: 750, y: 300 },
    initialGold: 100,
    initialLives: 20,
    allowedTowers: ['single', 'aoe'],
    backgroundColor: 0x2c3e50,
    waves: [
      {
        id: 1,
        name: '第一波',
        monsters: [
          { type: 'normal', count: 5, interval: 1000, delay: 0 }
        ],
        reward: 50,
        delay: 2000
      },
      {
        id: 2,
        name: '第二波',
        monsters: [
          { type: 'normal', count: 8, interval: 800, delay: 0 },
          { type: 'fast', count: 3, interval: 1500, delay: 1000 }
        ],
        reward: 75,
        delay: 3000
      },
      {
        id: 3,
        name: '第三波',
        monsters: [
          { type: 'normal', count: 10, interval: 600, delay: 0 },
          { type: 'fast', count: 5, interval: 1000, delay: 500 }
        ],
        reward: 100,
        delay: 4000
      }
    ]
  },

  level2: {
    id: 'level2',
    name: '第二关',
    description: '介绍飞行怪物和更多塔类型',
    waypoints: [
      { x: 50, y: 250 },
      { x: 150, y: 250 },
      { x: 250, y: 150 },
      { x: 350, y: 150 },
      { x: 450, y: 250 },
      { x: 550, y: 250 },
      { x: 650, y: 350 },
      { x: 750, y: 350 }
    ],
    spawnPoint: { x: 50, y: 250 },
    basePosition: { x: 750, y: 350 },
    initialGold: 150,
    initialLives: 15,
    allowedTowers: ['single', 'aoe', 'slow', 'flying'],
    backgroundColor: 0x34495e,
    waves: [
      {
        id: 1,
        name: '混合波',
        monsters: [
          { type: 'normal', count: 8, interval: 800, delay: 0 },
          { type: 'flying', count: 3, interval: 1200, delay: 500 }
        ],
        reward: 80,
        delay: 2500
      },
      {
        id: 2,
        name: '重甲来袭',
        monsters: [
          { type: 'normal', count: 5, interval: 1000, delay: 0 },
          { type: 'heavy', count: 4, interval: 1500, delay: 300 }
        ],
        reward: 120,
        delay: 3500
      },
      {
        id: 3,
        name: '最终挑战',
        monsters: [
          { type: 'normal', count: 12, interval: 500, delay: 0 },
          { type: 'flying', count: 6, interval: 800, delay: 200 },
          { type: 'heavy', count: 2, interval: 2000, delay: 1000 }
        ],
        reward: 200,
        delay: 5000
      }
    ]
  },

  level3: {
    id: 'level3',
    name: '第三关',
    description: 'Boss战和复杂战术',
    waypoints: [
      { x: 50, y: 200 },
      { x: 150, y: 200 },
      { x: 250, y: 300 },
      { x: 350, y: 300 },
      { x: 450, y: 200 },
      { x: 550, y: 200 },
      { x: 650, y: 100 },
      { x: 750, y: 100 }
    ],
    spawnPoint: { x: 50, y: 200 },
    basePosition: { x: 750, y: 100 },
    initialGold: 200,
    initialLives: 10,
    allowedTowers: ['single', 'aoe', 'slow', 'laser', 'chain', 'multi'],
    backgroundColor: 0x2c3e50,
    waves: [
      {
        id: 1,
        name: '精英部队',
        monsters: [
          { type: 'fast', count: 10, interval: 600, delay: 0 },
          { type: 'shield', count: 5, interval: 1000, delay: 300 }
        ],
        reward: 150,
        delay: 3000
      },
      {
        id: 2,
        name: '混合大军',
        monsters: [
          { type: 'normal', count: 15, interval: 400, delay: 0 },
          { type: 'flying', count: 8, interval: 600, delay: 200 },
          { type: 'heavy', count: 6, interval: 1200, delay: 500 }
        ],
        reward: 250,
        delay: 4000
      },
      {
        id: 3,
        name: 'Boss来袭',
        monsters: [
          { type: 'normal', count: 20, interval: 300, delay: 0 },
          { type: 'boss', count: 1, interval: 0, delay: 2000 }
        ],
        reward: 500,
        delay: 6000
      }
    ]
  }
}

/**
 * 获取关卡配置
 */
export function getLevelConfig(levelId: string): LevelConfig | undefined {
  return LEVEL_CONFIGS[levelId]
}

/**
 * 获取所有关卡配置
 */
export function getAllLevelConfigs(): LevelConfig[] {
  return Object.values(LEVEL_CONFIGS)
}

/**
 * 获取关卡列表（按顺序）
 */
export function getLevelList(): string[] {
  return ['level1', 'level2', 'level3']
}

/**
 * 获取下一个关卡
 */
export function getNextLevel(currentLevelId: string): string | null {
  const levels = getLevelList()
  const currentIndex = levels.indexOf(currentLevelId)
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return null
  }
  return levels[currentIndex + 1]
}