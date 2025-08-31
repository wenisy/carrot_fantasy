import { describe, it, expect } from 'vitest'
import { ObjectPool } from '../../src/game/core/ObjectPool'

describe('ObjectPool', () => {
  it('should create objects on demand', () => {
    const pool = new ObjectPool(() => ({ value: 0 }), obj => obj.value = 0)

    const obj1 = pool.get()
    expect(obj1.value).toBe(0)

    const obj2 = pool.get()
    expect(obj2.value).toBe(0)

    expect(obj1).not.toBe(obj2)
  })

  it('should reuse released objects', () => {
    const pool = new ObjectPool(() => ({ value: 0 }), obj => obj.value = 0)

    const obj1 = pool.get()
    obj1.value = 42

    pool.release(obj1)

    const obj2 = pool.get()
    expect(obj2).toBe(obj1)
    expect(obj2.value).toBe(0) // Should be reset
  })

  it('should respect max size limit', () => {
    const pool = new ObjectPool(() => ({ value: 0 }), undefined, 2, 2)

    const obj1 = pool.get()
    const obj2 = pool.get()
    const obj3 = pool.get() // This should create a new object

    pool.release(obj1)
    pool.release(obj2)
    pool.release(obj3) // This should not be added to pool due to size limit

    expect(pool.size()).toBe(2)
  })

  it('should warm up pool correctly', () => {
    const pool = new ObjectPool(() => ({ value: 0 }), undefined, 0, 10)

    pool.warmUp(5)
    expect(pool.size()).toBe(5)

    pool.warmUp(3) // Should not exceed current size
    expect(pool.size()).toBe(5)
  })
})