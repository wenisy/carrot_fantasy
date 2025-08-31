import Phaser from 'phaser'

/**
 * UI管理器 - 负责管理所有UI组件
 */
export class UIManager {
  private scene: Phaser.Scene
  private uiElements: Map<string, Phaser.GameObjects.GameObject> = new Map()

  // UI状态
  private gameState = {
    gold: 100,
    lives: 20,
    wave: 1,
    paused: false,
    speed: 1
  }

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createHUD()
    this.createTowerPanel()
  }

  /**
   * 创建HUD界面
   */
  private createHUD(): void {
    const { width, height } = this.scene.scale

    // 金币显示
    const goldBg = this.scene.add.rectangle(10, 10, 120, 30, 0x2c3e50, 0.8)
    goldBg.setStrokeStyle(2, 0xf39c12)
    goldBg.setOrigin(0)

    const goldIcon = this.scene.add.text(20, 15, '💰', { fontSize: '16px' })
    const goldText = this.scene.add.text(45, 15, `${this.gameState.gold}`, {
      fontSize: '16px',
      color: '#f1c40f'
    })

    this.uiElements.set('goldBg', goldBg)
    this.uiElements.set('goldIcon', goldIcon)
    this.uiElements.set('goldText', goldText)

    // 生命显示
    const livesBg = this.scene.add.rectangle(140, 10, 120, 30, 0x2c3e50, 0.8)
    livesBg.setStrokeStyle(2, 0xe74c3c)
    livesBg.setOrigin(0)

    const livesIcon = this.scene.add.text(150, 15, '❤️', { fontSize: '16px' })
    const livesText = this.scene.add.text(175, 15, `${this.gameState.lives}`, {
      fontSize: '16px',
      color: '#e74c3c'
    })

    this.uiElements.set('livesBg', livesBg)
    this.uiElements.set('livesIcon', livesIcon)
    this.uiElements.set('livesText', livesText)

    // 波次显示
    const waveBg = this.scene.add.rectangle(270, 10, 100, 30, 0x2c3e50, 0.8)
    waveBg.setStrokeStyle(2, 0x3498db)
    waveBg.setOrigin(0)

    const waveText = this.scene.add.text(280, 15, `波次: ${this.gameState.wave}`, {
      fontSize: '14px',
      color: '#3498db'
    })

    this.uiElements.set('waveBg', waveBg)
    this.uiElements.set('waveText', waveText)

    // 控制按钮
    this.createControlButtons(width, height)
  }

  /**
   * 创建控制按钮
   */
  private createControlButtons(width: number, _height: number): void {
    // 暂停/播放按钮
    const pauseButton = this.scene.add.text(width - 100, 10, '⏸️', {
      fontSize: '20px',
      backgroundColor: '#e74c3c',
      padding: { x: 10, y: 5 }
    })
    pauseButton.setOrigin(0.5)
    pauseButton.setInteractive()

    pauseButton.on('pointerdown', () => {
      this.togglePause()
      pauseButton.setText(this.gameState.paused ? '▶️' : '⏸️')
    })

    // 速度控制按钮
    const speedButton = this.scene.add.text(width - 100, 50, `${this.gameState.speed}x`, {
      fontSize: '16px',
      backgroundColor: '#f39c12',
      padding: { x: 8, y: 4 }
    })
    speedButton.setOrigin(0.5)
    speedButton.setInteractive()

    speedButton.on('pointerdown', () => {
      this.cycleSpeed()
      speedButton.setText(`${this.gameState.speed}x`)
    })

    // 菜单按钮
    const menuButton = this.scene.add.text(width - 100, 90, '🏠', {
      fontSize: '20px',
      backgroundColor: '#3498db',
      padding: { x: 10, y: 5 }
    })
    menuButton.setOrigin(0.5)
    menuButton.setInteractive()

    menuButton.on('pointerdown', () => {
      this.scene.scene.start('MenuScene')
    })

    this.uiElements.set('pauseButton', pauseButton)
    this.uiElements.set('speedButton', speedButton)
    this.uiElements.set('menuButton', menuButton)
  }

  /**
   * 创建建塔面板
   */
  private createTowerPanel(): void {
    const { width, height } = this.scene.scale

    // 建塔面板背景
    const panelBg = this.scene.add.rectangle(
      width / 2,
      height - 60,
      width - 40,
      100,
      0x2c3e50,
      0.9
    )
    panelBg.setStrokeStyle(2, 0x34495e)

    // 塔按钮
    const towerTypes = [
      { name: '单体塔', icon: '🏹', cost: 50 },
      { name: '溅射塔', icon: '💣', cost: 75 },
      { name: '减速塔', icon: '❄️', cost: 60 },
      { name: '激光塔', icon: '⚡', cost: 100 },
      { name: '连锁塔', icon: '🔗', cost: 80 },
      { name: '多重塔', icon: '🎯', cost: 90 }
    ]

    const buttonWidth = 80
    const startX = (width - (towerTypes.length * buttonWidth)) / 2 + buttonWidth / 2

    towerTypes.forEach((tower, index) => {
      const x = startX + index * buttonWidth
      const y = height - 60

      // 塔按钮背景
      const buttonBg = this.scene.add.circle(x, y, 25, 0x34495e)
      buttonBg.setStrokeStyle(2, 0x7f8c8d)
      buttonBg.setInteractive()

      // 塔图标
      const icon = this.scene.add.text(x, y - 15, tower.icon, {
        fontSize: '20px'
      })
      icon.setOrigin(0.5)

      // 塔名称
      const nameText = this.scene.add.text(x, y + 5, tower.name, {
        fontSize: '10px',
        color: '#ecf0f1'
      })
      nameText.setOrigin(0.5)

      // 塔价格
      const costText = this.scene.add.text(x, y + 18, `${tower.cost}`, {
        fontSize: '10px',
        color: '#f1c40f'
      })
      costText.setOrigin(0.5)

      // 按钮交互
      buttonBg.on('pointerover', () => {
        buttonBg.setFillStyle(0x7f8c8d)
      })

      buttonBg.on('pointerout', () => {
        buttonBg.setFillStyle(0x34495e)
      })

      buttonBg.on('pointerdown', () => {
        this.selectTower(tower)
      })

      this.uiElements.set(`towerButton${index}`, buttonBg)
      this.uiElements.set(`towerIcon${index}`, icon)
      this.uiElements.set(`towerName${index}`, nameText)
      this.uiElements.set(`towerCost${index}`, costText)
    })

    this.uiElements.set('towerPanelBg', panelBg)
  }

  /**
   * 更新金币显示
   */
  updateGold(amount: number): void {
    this.gameState.gold = amount
    const goldText = this.uiElements.get('goldText') as Phaser.GameObjects.Text
    if (goldText) {
      goldText.setText(`${this.gameState.gold}`)
    }
  }

  /**
   * 更新生命显示
   */
  updateLives(amount: number): void {
    this.gameState.lives = amount
    const livesText = this.uiElements.get('livesText') as Phaser.GameObjects.Text
    if (livesText) {
      livesText.setText(`${this.gameState.lives}`)
    }
  }

  /**
   * 更新波次显示
   */
  updateWave(wave: number): void {
    this.gameState.wave = wave
    const waveText = this.uiElements.get('waveText') as Phaser.GameObjects.Text
    if (waveText) {
      waveText.setText(`波次: ${this.gameState.wave}`)
    }
  }

  /**
   * 切换暂停状态
   */
  private togglePause(): void {
    this.gameState.paused = !this.gameState.paused
    if (this.gameState.paused) {
      this.scene.physics.pause()
    } else {
      this.scene.physics.resume()
    }
  }

  /**
   * 循环速度设置
   */
  private cycleSpeed(): void {
    const speeds = [1, 2, 3]
    const currentIndex = speeds.indexOf(this.gameState.speed)
    this.gameState.speed = speeds[(currentIndex + 1) % speeds.length]
  }

  /**
   * 选择塔类型
   */
  private selectTower(tower: any): void {
    if (this.gameState.gold >= tower.cost) {
      // TODO: 进入建塔模式
      // console.log(`Selected tower: ${tower.name}`)
    } else {
      // 显示金币不足提示
      this.showInsufficientGoldMessage()
    }
  }

  /**
   * 显示金币不足提示
   */
  private showInsufficientGoldMessage(): void {
    const message = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      '金币不足！',
      {
        fontSize: '24px',
        color: '#e74c3c',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 }
      }
    )
    message.setOrigin(0.5)

    // 3秒后自动消失
    this.scene.time.delayedCall(3000, () => {
      message.destroy()
    })
  }

  /**
   * 获取当前游戏状态
   */
  getGameState(): typeof this.gameState {
    return { ...this.gameState }
  }

  /**
   * 销毁UI管理器
   */
  destroy(): void {
    this.uiElements.forEach(element => {
      element.destroy()
    })
    this.uiElements.clear()
  }
}