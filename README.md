# 萝卜幻想 - 塔防游戏

一款原创网页版塔防游戏，风格接近保卫萝卜但使用完全原创的素材和命名。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:3000 查看游戏

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
npm run format
```

### 测试
```bash
npm run test
npm run e2e
```

## 📁 项目结构

```
src/
├── app/                 # 应用入口、PWA注册
├── game/
│   ├── core/           # 游戏循环、ECS、对象池、空间索引
│   ├── entities/       # 塔、怪物、弹道等实体
│   ├── components/     # ECS组件
│   ├── systems/        # ECS系统
│   ├── data/           # 关卡配置、怪物/塔数据
│   └── scenes/         # 游戏场景
├── ui/                 # UI组件
└── assets/             # 美术资源、音频
```

## 🎮 游戏特色

- **原创设计**: 完全原创的美术风格和命名
- **跨平台**: 支持PC和移动端
- **PWA支持**: 可离线游玩
- **60FPS**: 流畅的游戏体验
- **ECS架构**: 可扩展的游戏架构

## 🛠️ 技术栈

- **框架**: Phaser 3
- **语言**: TypeScript
- **构建**: Vite
- **测试**: Vitest + Playwright
- **代码质量**: ESLint + Prettier
- **PWA**: Workbox

## 📋 开发进度

### ✅ 已完成 (M1原型 - 基础阶段)
- [x] 项目骨架搭建
- [x] 基础场景和UI
- [x] Git仓库和CI/CD配置

### 🔄 进行中 (M1原型 - 核心功能)
- [ ] 游戏循环和ECS架构
- [ ] 塔和怪物实体
- [ ] 基础游戏机制

### 📅 计划中
- [ ] 完整关卡系统
- [ ] PWA离线支持
- [ ] 性能优化
- [ ] 自动化测试

## 🚀 部署

项目使用GitHub Actions自动部署到GitHub Pages。

推送代码到main分支后会自动触发构建和部署流程。

## 📄 许可证

ISC License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 联系

如有问题请通过GitHub Issues联系。