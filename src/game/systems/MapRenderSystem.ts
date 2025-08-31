import { System, Entity } from '../core/ECS'
import { MapComponent, Tile } from '../components/MapComponent'
import Phaser from 'phaser'

/**
 * 地图渲染系统 - 负责渲染地图网格和路径
 */
export class MapRenderSystem extends System {
  private scene: Phaser.Scene
  private mapEntity: Entity | null = null
  private tileSprites: Phaser.GameObjects.Rectangle[][] = []
  private pathGraphics: Phaser.GameObjects.Graphics | null = null

  constructor(scene: Phaser.Scene) {
    super()
    this.scene = scene
    this.priority = 5 // 在其他渲染系统之前
  }

  update(entities: Entity[], _deltaTime: number): void {
    // 找到地图实体
    if (!this.mapEntity) {
      this.mapEntity = this.findMapEntity(entities)
      if (this.mapEntity) {
        this.createMapRender()
      }
    }

    if (!this.mapEntity) return

    // 更新地图渲染（如果需要）
    this.updateMapRender()
  }

  private findMapEntity(entities: Entity[]): Entity | null {
    return entities.find(entity => entity.components.has('MapComponent')) || null
  }

  private createMapRender(): void {
    if (!this.mapEntity) return

    const mapComponent = this.mapEntity.components.get('MapComponent') as MapComponent

    // 创建地图网格
    this.createTileGrid(mapComponent)

    // 创建路径渲染
    this.createPathRender(mapComponent)
  }

  private createTileGrid(mapComponent: MapComponent): void {
    // 清除之前的网格
    this.clearTileGrid()

    // 创建新的网格
    for (let y = 0; y < mapComponent.height; y++) {
      this.tileSprites[y] = []
      for (let x = 0; x < mapComponent.width; x++) {
        const tile = mapComponent.getTile(x, y)
        if (tile) {
          const worldPos = mapComponent.getWorldPosition(x, y)
          const color = this.getTileColor(tile)

          const sprite = this.scene.add.rectangle(
            worldPos.x,
            worldPos.y,
            mapComponent.tileSize,
            mapComponent.tileSize,
            color
          )

          // 添加边框
          sprite.setStrokeStyle(1, 0x000000, 0.3)

          this.tileSprites[y][x] = sprite
        }
      }
    }
  }

  private createPathRender(mapComponent: MapComponent): void {
    // 清除之前的路径
    if (this.pathGraphics) {
      this.pathGraphics.destroy()
    }

    // 创建路径图形
    this.pathGraphics = this.scene.add.graphics()
    this.pathGraphics.lineStyle(4, 0xffd700, 1) // 金色路径

    const waypoints = mapComponent.getPath()
    if (waypoints.length > 1) {
      // 绘制路径线
      this.pathGraphics.beginPath()

      const startPos = mapComponent.getWorldPosition(waypoints[0].x, waypoints[0].y)
      this.pathGraphics.moveTo(startPos.x, startPos.y)

      for (let i = 1; i < waypoints.length; i++) {
        const pos = mapComponent.getWorldPosition(waypoints[i].x, waypoints[i].y)
        this.pathGraphics.lineTo(pos.x, pos.y)
      }

      this.pathGraphics.strokePath()

      // 绘制路径点
      waypoints.forEach((waypoint, index) => {
        const pos = mapComponent.getWorldPosition(waypoint.x, waypoint.y)
        const color = index === 0 ? 0x00ff00 : index === waypoints.length - 1 ? 0xff0000 : 0xffd700

        this.scene.add.circle(pos.x, pos.y, 8, color)
        this.scene.add.text(pos.x - 10, pos.y - 25, `${index}`, {
          fontSize: '12px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 2, y: 1 }
        })
      })
    }
  }

  private getTileColor(tile: Tile): number {
    switch (tile.type) {
      case 'grass':
        return 0x27ae60 // 绿色草地
      case 'path':
        return 0x8b4513 // 棕色路径
      case 'obstacle':
        return 0x34495e // 深灰色障碍
      case 'tower':
        return 0xe74c3c // 红色塔位
      default:
        return 0x95a5a6 // 默认灰色
    }
  }

  private updateMapRender(): void {
    // 这里可以添加动态更新逻辑，比如高亮可放置塔的位置等
  }

  private clearTileGrid(): void {
    this.tileSprites.forEach(row => {
      row.forEach(sprite => {
        if (sprite) sprite.destroy()
      })
    })
    this.tileSprites = []
  }

  /**
   * 高亮指定位置的网格
   */
  public highlightTile(x: number, y: number, color: number = 0xffff00): void {
    if (this.tileSprites[y] && this.tileSprites[y][x]) {
      this.tileSprites[y][x].setFillStyle(color)
    }
  }

  /**
   * 清除所有高亮
   */
  public clearHighlights(): void {
    if (!this.mapEntity) return

    const mapComponent = this.mapEntity.components.get('MapComponent') as MapComponent

    for (let y = 0; y < mapComponent.height; y++) {
      for (let x = 0; x < mapComponent.width; x++) {
        const tile = mapComponent.getTile(x, y)
        if (tile && this.tileSprites[y] && this.tileSprites[y][x]) {
          const color = this.getTileColor(tile)
          this.tileSprites[y][x].setFillStyle(color)
        }
      }
    }
  }

  /**
   * 销毁渲染系统
   */
  public destroy(): void {
    this.clearTileGrid()
    if (this.pathGraphics) {
      this.pathGraphics.destroy()
      this.pathGraphics = null
    }
  }
}