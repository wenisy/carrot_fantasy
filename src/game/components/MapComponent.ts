import { Component } from '../core/ECS'

export interface Waypoint {
  x: number
  y: number
}

export interface Tile {
  x: number
  y: number
  type: 'path' | 'grass' | 'obstacle' | 'tower'
  walkable: boolean
}

export class MapComponent extends Component {
  public width: number
  public height: number
  public tileSize: number
  public waypoints: Waypoint[]
  public tiles: Tile[][]
  public basePosition: { x: number; y: number }

  constructor(
    width: number = 20,
    height: number = 15,
    tileSize: number = 32,
    waypoints: Waypoint[] = [],
    basePosition: { x: number; y: number } = { x: 19, y: 7 }
  ) {
    super()
    this.width = width
    this.height = height
    this.tileSize = tileSize
    this.waypoints = waypoints
    this.basePosition = basePosition
    this.tiles = this.generateTiles()
  }

  private generateTiles(): Tile[][] {
    const tiles: Tile[][] = []

    for (let y = 0; y < this.height; y++) {
      tiles[y] = []
      for (let x = 0; x < this.width; x++) {
        // 创建路径
        const isOnPath = this.isOnPath(x, y)
        tiles[y][x] = {
          x,
          y,
          type: isOnPath ? 'path' : 'grass',
          walkable: !isOnPath // 路径上不能放置塔
        }
      }
    }

    return tiles
  }

  private isOnPath(x: number, y: number): boolean {
    // 检查点是否在路径上
    for (let i = 0; i < this.waypoints.length - 1; i++) {
      const start = this.waypoints[i]
      const end = this.waypoints[i + 1]

      if (this.isPointOnLine(x, y, start.x, start.y, end.x, end.y, 0.5)) {
        return true
      }
    }

    return false
  }

  private isPointOnLine(px: number, py: number, x1: number, y1: number, x2: number, y2: number, threshold: number): boolean {
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.sqrt(dx * dx + dy * dy)

    if (length === 0) return false

    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)))
    const closestX = x1 + t * dx
    const closestY = y1 + t * dy

    const distance = Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2)
    return distance <= threshold
  }

  public getTile(x: number, y: number): Tile | null {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.tiles[y][x]
    }
    return null
  }

  public setTileType(x: number, y: number, type: Tile['type']): void {
    const tile = this.getTile(x, y)
    if (tile) {
      tile.type = type
      tile.walkable = type !== 'obstacle' && type !== 'tower'
    }
  }

  public isWalkable(x: number, y: number): boolean {
    const tile = this.getTile(x, y)
    return tile ? tile.walkable : false
  }

  public getWorldPosition(tileX: number, tileY: number): { x: number; y: number } {
    return {
      x: tileX * this.tileSize + this.tileSize / 2,
      y: tileY * this.tileSize + this.tileSize / 2
    }
  }

  public getTilePosition(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: Math.floor(worldX / this.tileSize),
      y: Math.floor(worldY / this.tileSize)
    }
  }

  public getPath(): Waypoint[] {
    return [...this.waypoints]
  }

  public getNextWaypoint(currentX: number, currentY: number): Waypoint | null {
    let closestIndex = -1
    let closestDistance = Infinity

    for (let i = 0; i < this.waypoints.length; i++) {
      const waypoint = this.waypoints[i]
      const distance = Math.sqrt((currentX - waypoint.x) ** 2 + (currentY - waypoint.y) ** 2)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    // 返回下一个路径点
    if (closestIndex >= 0 && closestIndex < this.waypoints.length - 1) {
      return this.waypoints[closestIndex + 1]
    }

    return null
  }
}