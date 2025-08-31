/**
 * 空间网格 - 用于优化碰撞检测和范围查询
 */
export class SpatialGrid<T> {
  private cellSize: number
  private grid: Map<string, T[]> = new Map()
  private bounds: { minX: number; minY: number; maxX: number; maxY: number }

  constructor(cellSize: number = 50) {
    this.cellSize = cellSize
    this.bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 }
  }

  /**
   * 获取网格单元的键
   */
  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize)
    const cellY = Math.floor(y / this.cellSize)
    return `${cellX},${cellY}`
  }

  /**
   * 添加对象到网格
   */
  add(obj: T, x: number, y: number): void {
    const key = this.getCellKey(x, y)
    if (!this.grid.has(key)) {
      this.grid.set(key, [])
    }
    this.grid.get(key)!.push(obj)

    // 更新边界
    this.bounds.minX = Math.min(this.bounds.minX, x)
    this.bounds.minY = Math.min(this.bounds.minY, y)
    this.bounds.maxX = Math.max(this.bounds.maxX, x)
    this.bounds.maxY = Math.max(this.bounds.maxY, y)
  }

  /**
   * 从网格中移除对象
   */
  remove(obj: T, x: number, y: number): void {
    const key = this.getCellKey(x, y)
    const cell = this.grid.get(key)
    if (cell) {
      const index = cell.indexOf(obj)
      if (index !== -1) {
        cell.splice(index, 1)
        if (cell.length === 0) {
          this.grid.delete(key)
        }
      }
    }
  }

  /**
   * 更新对象位置
   */
  update(obj: T, oldX: number, oldY: number, newX: number, newY: number): void {
    const oldKey = this.getCellKey(oldX, oldY)
    const newKey = this.getCellKey(newX, newY)

    if (oldKey !== newKey) {
      this.remove(obj, oldX, oldY)
      this.add(obj, newX, newY)
    }
  }

  /**
   * 获取指定位置的邻近对象
   */
  getNearby(x: number, y: number, radius: number = this.cellSize): T[] {
    const result: T[] = []
    const centerCellX = Math.floor(x / this.cellSize)
    const centerCellY = Math.floor(y / this.cellSize)
    const cellRadius = Math.ceil(radius / this.cellSize)

    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        const cellX = centerCellX + dx
        const cellY = centerCellY + dy
        const key = `${cellX},${cellY}`
        const cell = this.grid.get(key)
        if (cell) {
          result.push(...cell)
        }
      }
    }

    return result
  }

  /**
   * 获取指定区域内的对象
   */
  getInArea(minX: number, minY: number, maxX: number, maxY: number): T[] {
    const result: T[] = []
    const startCellX = Math.floor(minX / this.cellSize)
    const startCellY = Math.floor(minY / this.cellSize)
    const endCellX = Math.floor(maxX / this.cellSize)
    const endCellY = Math.floor(maxY / this.cellSize)

    for (let cellX = startCellX; cellX <= endCellX; cellX++) {
      for (let cellY = startCellY; cellY <= endCellY; cellY++) {
        const key = `${cellX},${cellY}`
        const cell = this.grid.get(key)
        if (cell) {
          result.push(...cell)
        }
      }
    }

    return result
  }

  /**
   * 清空网格
   */
  clear(): void {
    this.grid.clear()
    this.bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 }
  }

  /**
   * 获取网格统计信息
   */
  getStats(): { cellCount: number; totalObjects: number; bounds: { minX: number; minY: number; maxX: number; maxY: number } } {
    let totalObjects = 0
    for (const cell of this.grid.values()) {
      totalObjects += cell.length
    }

    return {
      cellCount: this.grid.size,
      totalObjects,
      bounds: { ...this.bounds }
    }
  }

  /**
   * 获取所有对象
   */
  getAll(): T[] {
    const result: T[] = []
    for (const cell of this.grid.values()) {
      result.push(...cell)
    }
    return result
  }
}

/**
 * 游戏空间索引管理器
 */
export class SpatialIndex {
  private static instance: SpatialIndex
  private grids: Map<string, SpatialGrid<any>> = new Map()

  private constructor() {}

  static getInstance(): SpatialIndex {
    if (!SpatialIndex.instance) {
      SpatialIndex.instance = new SpatialIndex()
    }
    return SpatialIndex.instance
  }

  /**
   * 创建空间网格
   */
  createGrid<T>(name: string, cellSize: number = 50): SpatialGrid<T> {
    const grid = new SpatialGrid<T>(cellSize)
    this.grids.set(name, grid)
    return grid
  }

  /**
   * 获取空间网格
   */
  getGrid<T>(name: string): SpatialGrid<T> | undefined {
    return this.grids.get(name)
  }

  /**
   * 删除空间网格
   */
  removeGrid(name: string): boolean {
    return this.grids.delete(name)
  }

  /**
   * 清空所有网格
   */
  clearAll(): void {
    this.grids.clear()
  }

  /**
   * 获取统计信息
   */
  getStats(): { [key: string]: any } {
    const stats: { [key: string]: any } = {}
    for (const [name, grid] of this.grids) {
      stats[name] = grid.getStats()
    }
    return stats
  }
}