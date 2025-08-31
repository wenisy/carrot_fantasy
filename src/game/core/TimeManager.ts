/**
 * 时间管理器 - 处理游戏时间、暂停、倍速等
 */
export class TimeManager {
  private static instance: TimeManager
  private timeScale: number = 1.0
  private isPaused: boolean = false
  private fixedTimeStep: number = 1000 / 60 // 60 FPS
  private accumulator: number = 0
  private lastTime: number = 0

  private constructor() {}

  static getInstance(): TimeManager {
    if (!TimeManager.instance) {
      TimeManager.instance = new TimeManager()
    }
    return TimeManager.instance
  }

  /**
   * 更新时间管理器
   * @param currentTime 当前时间戳
   * @returns 是否应该更新游戏逻辑
   */
  update(currentTime: number): boolean {
    if (this.isPaused) return false

    const deltaTime = (currentTime - this.lastTime) * this.timeScale
    this.lastTime = currentTime
    this.accumulator += deltaTime

    // 固定时间步更新
    if (this.accumulator >= this.fixedTimeStep) {
      this.accumulator -= this.fixedTimeStep
      return true
    }

    return false
  }

  /**
   * 设置时间缩放 (用于倍速播放)
   */
  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0.1, Math.min(3.0, scale)) // 限制在0.1x到3.0x之间
  }

  /**
   * 获取当前时间缩放
   */
  getTimeScale(): number {
    return this.timeScale
  }

  /**
   * 暂停/恢复游戏
   */
  setPaused(paused: boolean): void {
    this.isPaused = paused
  }

  /**
   * 获取暂停状态
   */
  getPaused(): boolean {
    return this.isPaused
  }

  /**
   * 获取固定时间步长
   */
  getFixedTimeStep(): number {
    return this.fixedTimeStep
  }

  /**
   * 重置时间管理器
   */
  reset(): void {
    this.timeScale = 1.0
    this.isPaused = false
    this.accumulator = 0
    this.lastTime = performance.now()
  }
}