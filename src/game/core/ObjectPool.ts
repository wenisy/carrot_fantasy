/**
 * 对象池 - 用于复用对象，减少GC压力
 */
export class ObjectPool<T> {
  private pool: T[] = []
  private createFn: () => T
  private resetFn?: (obj: T) => void
  private maxSize: number

  constructor(createFn: () => T, resetFn?: (obj: T) => void, initialSize: number = 10, maxSize: number = 100) {
    this.createFn = createFn
    this.resetFn = resetFn
    this.maxSize = maxSize

    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn())
    }
  }

  /**
   * 获取对象
   */
  get(): T {
    let obj = this.pool.pop()
    if (!obj) {
      obj = this.createFn()
    }
    return obj
  }

  /**
   * 归还对象
   */
  release(obj: T): void {
    if (this.resetFn) {
      this.resetFn(obj)
    }

    if (this.pool.length < this.maxSize) {
      this.pool.push(obj)
    }
  }

  /**
   * 获取池中对象数量
   */
  size(): number {
    return this.pool.length
  }

  /**
   * 清空对象池
   */
  clear(): void {
    this.pool.length = 0
  }

  /**
   * 预热对象池
   */
  warmUp(count: number): void {
    const targetSize = Math.min(count, this.maxSize)
    while (this.pool.length < targetSize) {
      this.pool.push(this.createFn())
    }
  }
}

/**
 * 游戏对象池管理器
 */
export class GameObjectPool {
  private static instance: GameObjectPool
  private pools: Map<string, ObjectPool<any>> = new Map()

  constructor() {}

  static getInstance(): GameObjectPool {
    if (!GameObjectPool.instance) {
      GameObjectPool.instance = new GameObjectPool()
    }
    return GameObjectPool.instance
  }

  /**
   * 创建对象池
   */
  createPool<T>(
    name: string,
    createFn: () => T,
    resetFn?: (obj: T) => void,
    initialSize: number = 10,
    maxSize: number = 100
  ): ObjectPool<T> {
    const pool = new ObjectPool<T>(createFn, resetFn, initialSize, maxSize)
    this.pools.set(name, pool)
    return pool
  }

  /**
   * 获取对象池
   */
  getPool<T>(name: string): ObjectPool<T> | undefined {
    return this.pools.get(name)
  }

  /**
   * 删除对象池
   */
  removePool(name: string): boolean {
    return this.pools.delete(name)
  }

  /**
   * 清空所有对象池
   */
  clearAll(): void {
    this.pools.clear()
  }

  /**
   * 获取统计信息
   */
  getStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {}
    for (const [name, pool] of this.pools) {
      stats[name] = pool.size()
    }
    return stats
  }
}