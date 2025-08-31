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

        // 创建背景
        this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50)

        // 标题
        const title = this.add.text(width / 2, height / 3, '萝卜幻想', {
            fontSize: '48px',
            color: '#ffffff'
        })
        title.setOrigin(0.5)

        // 副标题
        const subtitle = this.add.text(width / 2, height / 3 + 60, '塔防游戏', {
            fontSize: '24px',
            color: '#bdc3c7'
        })
        subtitle.setOrigin(0.5)

        // 开始游戏按钮
        const startButton = this.add.text(width / 2, height / 2, '开始游戏', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#3498db',
            padding: { x: 20, y: 10 }
        })
        startButton.setOrigin(0.5)
        startButton.setInteractive()

        // 按钮悬停效果
        startButton.on('pointerover', () => {
            startButton.setStyle({ backgroundColor: '#2980b9' })
        })
        startButton.on('pointerout', () => {
            startButton.setStyle({ backgroundColor: '#3498db' })
        })

        startButton.on('pointerdown', () => {
            console.log('Starting game...')
            this.scene.start('GameScene')
        })

        // 设置按钮
        const settingsButton = this.add.text(width / 2, height / 2 + 60, '设置', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#95a5a6',
            padding: { x: 15, y: 8 }
        })
        settingsButton.setOrigin(0.5)
        settingsButton.setInteractive()

        settingsButton.on('pointerover', () => {
            settingsButton.setStyle({ backgroundColor: '#7f8c8d' })
        })
        settingsButton.on('pointerout', () => {
            settingsButton.setStyle({ backgroundColor: '#95a5a6' })
        })

        settingsButton.on('pointerdown', () => {
            console.log('Settings clicked')
            // TODO: 打开设置界面
        })

        console.log('MenuScene created successfully')
    }
}