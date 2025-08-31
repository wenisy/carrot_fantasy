import Phaser from 'phaser'
import { ECSManager } from '../core/ECS'
import { MapComponent, Waypoint } from '../components/MapComponent'
import { MapRenderSystem } from '../systems/MapRenderSystem'
import { MovementSystem } from '../systems/MovementSystem'
import { PathfindingSystem } from '../systems/PathfindingSystem'

export class GameScene extends Phaser.Scene {
  private ecsManager: ECSManager
  private mapRenderSystem: MapRenderSystem | null = null
  private gameState: {
    gold: number
    lives: number
    wave: number
    paused: boolean
    speed: number
  }

  constructor() {
    super({ key: 'GameScene' })
    this.ecsManager = ECSManager.getInstance()
    this.gameState = {
      gold: 100,
      lives: 20,
      wave: 1,
      paused: false,
      speed: 1
    }
  }

  preload() {
    // 加载游戏资源
    // TODO: 加载塔、怪物、地图等资源
  }

  create() {
    const { width, height } = this.scale

    // 创建背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50)

    // 创建UI
    this.createHUD()

    // 创建地图区域
    this.createMap()

    // 设置输入
    this.setupInput()
  }

  private createHUD() {
    const { width } = this.scale

    // 金币显示
    this.add.text(10, 10, `金币: ${this.gameState.gold}`, {
      fontSize: '18px',
      color: '#ffffff'
    })

    // 生命显示
    this.add.text(10, 40, `生命: ${this.gameState.lives}`, {
      fontSize: '18px',
      color: '#ffffff'
    })

    // 波次显示
    this.add.text(10, 70, `波次: ${this.gameState.wave}`, {
      fontSize: '18px',
      color: '#ffffff'
    })

    // 控制按钮
    const pauseButton = this.add.text(width - 100, 10, '暂停', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#e74c3c',
      padding: { x: 10, y: 5 }
    })
    pauseButton.setInteractive()

    pauseButton.on('pointerdown', () => {
      this.togglePause()
    })

    // 返回菜单按钮
    const menuButton = this.add.text(width - 100, 50, '菜单', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#3498db',
      padding: { x: 10, y: 5 }
    })
    menuButton.setInteractive()

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene')
    })
  }

  private createMap() {
    // 创建地图实体
    const mapEntity = this.ecsManager.createEntity()

    // 创建路径点（从左到右的简单路径）
    const waypoints: Waypoint[] = [
      { x: 0, y: 7 },   // 起点
      { x: 5, y: 7 },   // 中间点1
      { x: 10, y: 7 },  // 中间点2
      { x: 15, y: 7 },  // 中间点3
      { x: 19, y: 7 }   // 终点（基地）
    ]

    // 创建地图组件
    const mapComponent = new MapComponent(20, 15, 32, waypoints)
    mapEntity.addComponent(mapComponent)

    // 初始化渲染系统
    this.mapRenderSystem = new MapRenderSystem(this)
    this.ecsManager.addSystem(this.mapRenderSystem)

    // 初始化其他系统
    const movementSystem = new MovementSystem()
    const pathfindingSystem = new PathfindingSystem()

    this.ecsManager.addSystem(movementSystem)
    this.ecsManager.addSystem(pathfindingSystem)

    // console.log('Map created with waypoints:', waypoints)
  }

  private setupInput() {
    // TODO: 设置鼠标/触摸输入
  }

  private togglePause() {
    this.gameState.paused = !this.gameState.paused
    if (this.gameState.paused) {
      this.physics.pause()
      // TODO: 显示暂停界面
    } else {
      this.physics.resume()
      // TODO: 隐藏暂停界面
    }
  }

  update(_time: number, delta: number) {
    if (this.gameState.paused) return

    // 更新ECS系统
    this.ecsManager.update(delta)

    // TODO: 更新其他游戏逻辑
    // 更新塔、怪物、碰撞检测等
  }
}