import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  preload() {
    // 加载菜单资源
  }

  create() {
    const { width, height } = this.scale

    // 标题
    const title = this.add.text(width / 2, height / 3, '萝卜幻想', {
      fontSize: '48px',
      color: '#ffffff'
    })
    title.setOrigin(0.5)

    // 开始游戏按钮
    const startButton = this.add.text(width / 2, height / 2, '开始游戏', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#3498db',
      padding: { x: 20, y: 10 }
    })
    startButton.setOrigin(0.5)
    startButton.setInteractive()

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene')
    })

    // 设置按钮
    const settingsButton = this.add.text(width / 2, height / 2 + 60, '设置', {
      fontSize: '20px',
      color: '#ffffff'
    })
    settingsButton.setOrigin(0.5)
    settingsButton.setInteractive()

    settingsButton.on('pointerdown', () => {
      // TODO: 打开设置界面
    })
  }
}