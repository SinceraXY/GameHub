<div align="center">

# 🎮 GameHub - 精品小游戏合集

[![GitHub stars](https://img.shields.io/github/stars/SinceraXY/GameHub?style=social)](https://github.com/SinceraXY/GameHub/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/SinceraXY/GameHub?style=social)](https://github.com/SinceraXY/GameHub/network/members)
[![GitHub issues](https://img.shields.io/github/issues/SinceraXY/GameHub)](https://github.com/SinceraXY/GameHub/issues)
[![GitHub license](https://img.shields.io/github/license/SinceraXY/GameHub)](https://github.com/SinceraXY/GameHub/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/SinceraXY/GameHub/pulls)

**[中文](README.md) | [English](README_EN.md)**

一个精美炫酷的HTML5游戏合集主页，包含42款精心分类的小游戏。

[⚡ 快速开始](QUICKSTART.md) | [📖 完整文档](https://github.com/SinceraXY/GameHub#readme) | [🚀 部署指南](docs/DEPLOYMENT.md) | [🐛 报告问题](https://github.com/SinceraXY/GameHub/issues)

</div>

---

## 🎯 如何运行

### 本地快速体验

1. **克隆项目**
   ```bash
   git clone https://github.com/SinceraXY/GameHub.git
   cd GameHub
   ```

2. **打开主页**
   - 直接双击 `index.html` 文件，或
   - 使用本地服务器（推荐）：
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server -p 8000
   ```
   然后访问 `http://localhost:8000`

3. **开始游戏** 🎮
   - 浏览42款游戏
   - 点击任意游戏卡片即可开始

> 📖 更多运行方式请查看 [快速开始指南](QUICKSTART.md)

### 在线部署

如需在线部署，请参考 [部署指南](docs/DEPLOYMENT.md)，支持：
- GitHub Pages（免费）
- Netlify / Vercel
- 自托管服务器

---

## 🌟 特色功能

### 🎨 **精美设计**
- ✨ 现代化渐变UI设计
- 🌈 丰富的色彩搭配
- 💫 流畅的动画效果
- 🎭 动态背景特效

### 🎯 **智能分类**
- 📂 7大游戏分类
- 🔍 实时搜索功能
- 🏷️ 一键过滤分类
- 📊 可视化统计

### 🎮 **游戏体验**
- 🚀 即点即玩，无需下载
- 📱 全平台响应式设计
- ⚡ 快速加载
- 🎯 42款精品游戏

---

## 📁 项目结构

```
小游戏部署集合/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 交互脚本
├── README.md           # 说明文档
└── games/              # 游戏目录
    ├── Puzzle/         # 益智解谜 (8款)
    │   ├── 2048/
    │   ├── Jigsaw-Puzzle/
    │   ├── Klotski/
    │   ├── Maze-Escape/
    │   ├── Minesweeper/
    │   ├── Spot-Difference/
    │   ├── Sudoku/
    │   └── Tilting-Maze/
    ├── Action/         # 动作反应 (11款)
    │   ├── Archery/
    │   ├── Breakout/
    │   ├── Crossy-Road/
    │   ├── Emoji-Catcher/
    │   ├── Flappy-Bird/
    │   ├── Fruit-Slicer/
    │   ├── Insect-Catch/
    │   ├── Piano-Tiles/
    │   ├── Ping-Pong/
    │   ├── Shape-Clicker/
    │   └── Whack-A-Mole/
    ├── Arcade/         # 经典街机 (8款)
    │   ├── Bubble-Shooter/
    │   ├── Candy-Crush/
    │   ├── Jump-Game/
    │   ├── Pac-Man/
    │   ├── Snake/
    │   ├── Space-Invaders/
    │   ├── Tetris/
    │   └── Tower-Blocks/
    ├── Board/          # 棋牌策略 (3款)
    │   ├── Gomoku/
    │   ├── Rock-Paper-Scissors/
    │   └── Tic-Tac-Toe/
    ├── Memory/         # 记忆训练 (4款)
    │   ├── Color-Match/
    │   ├── Match-Pairs/
    │   ├── Memory-Card/
    │   └── Simon-Says/
    ├── Typing/         # 打字练习 (4款)
    │   ├── Hangman/
    │   ├── Speed-Typing/
    │   ├── Type-Master/
    │   └── Typing-Speed-Challenge/
    └── Casual/         # 休闲娱乐 (4款)
        ├── Dice-Roll-Simulator/
        ├── Quiz/
        ├── Speak-Number-Guessing/
        └── Type-Number-Guessing/
```

---

## 🚀 快速开始

### 方法1：直接打开（推荐）
1. 双击 `index.html` 文件
2. 浏览器会自动打开主页
3. 开始畅玩游戏！

### 方法2：使用本地服务器
```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (http-server)
npx http-server -p 8000

# 使用 VSCode Live Server
# 右键 index.html -> Open with Live Server
```

然后访问：`http://localhost:8000`

---

## 🎯 游戏分类详情

### 🧩 Puzzle（益智解谜）- 8款
> 需要逻辑思维和策略规划

- **2048** - 经典数字合并益智游戏
- **Jigsaw Puzzle** - 趣味拼图挑战
- **Klotski** - 华容道滑块解谜
- **Maze Escape** - 迷宫逃脱冒险
- **Minesweeper** - 经典扫雷游戏
- **Spot Difference** - 找不同挑战
- **Sudoku** - 数独逻辑游戏
- **Tilting Maze** - 重力迷宫

### ⚡ Action（动作反应）- 11款
> 需要快速反应和手眼协调

- **Archery** - 射箭竞技
- **Breakout** - 打砖块游戏
- **Crossy Road** - 过马路挑战
- **Emoji Catcher** - 表情符号捕捉
- **Flappy Bird** - 飞翔的小鸟
- **Fruit Slicer** - 水果切切乐
- **Insect Catch** - 昆虫捕捉
- **Piano Tiles** - 别踩白块
- **Ping Pong** - 乒乓球对战
- **Shape Clicker** - 形状点击
- **Whack A Mole** - 打地鼠游戏

### 🕹️ Arcade（经典街机）- 8款
> 经典游戏，怀旧元素

- **Bubble Shooter** - 泡泡龙射击
- **Candy Crush** - 糖果消消乐
- **Jump Game** - 跳跃冒险
- **Pac-Man** - 经典吃豆人
- **Snake** - 贪吃蛇
- **Space Invaders** - 太空入侵者
- **Tetris** - 俄罗斯方块
- **Tower Blocks** - 叠叠乐

### ♟️ Board（棋牌策略）- 3款
> 策略对战，规则博弈

- **Gomoku** - 五子棋对战
- **Rock Paper Scissors** - 石头剪刀布
- **Tic Tac Toe** - 井字棋

### 🧠 Memory（记忆训练）- 4款
> 训练记忆力和观察力

- **Color Match** - 颜色匹配记忆
- **Match Pairs** - 配对记忆
- **Memory Card** - 记忆卡片翻牌
- **Simon Says** - 西蒙说记忆

### ⌨️ Typing（打字练习）- 4款
> 提升打字速度和准确度

- **Hangman** - 猜单词游戏
- **Speed Typing** - 速度打字练习
- **Type Master** - 打字大师
- **Typing Speed Challenge** - 打字速度挑战

### 🎲 Casual（休闲娱乐）- 4款
> 轻松休闲，简单有趣

- **Dice Roll Simulator** - 骰子模拟器
- **Quiz** - 知识问答
- **Speak Number Guessing** - 语音猜数字
- **Type Number Guessing** - 打字猜数字

---

## 💡 功能说明

### 🔍 搜索功能
- 在顶部搜索框输入游戏名称
- 支持模糊搜索
- 实时显示搜索结果

### 🏷️ 分类过滤
- 点击分类按钮快速过滤
- 显示当前分类游戏数量
- 支持"全部"查看所有游戏

### 📊 统计信息
- 可视化显示各分类游戏数量
- 百分比进度条
- 动画效果展示

### 🎨 视觉效果
- 动态渐变背景
- 悬停动画
- 平滑滚动
- 响应式设计

---

## 🛠️ 技术栈

- **HTML5** - 结构语义化
- **CSS3** - 现代化样式
  - Flexbox / Grid 布局
  - CSS Variables
  - 动画和过渡
  - 渐变效果
- **Vanilla JavaScript** - 原生JS
  - DOM操作
  - 事件处理
  - Intersection Observer
  - 动态渲染

---

## 📱 浏览器兼容性

| 浏览器 | 版本 | 支持 |
|--------|------|------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| Opera | 76+ | ✅ |

---

## 🎯 使用建议

### **新手推荐**
1. **Casual** - 轻松上手
2. **Arcade** - 经典易懂
3. **Board** - 规则简单

### **进阶挑战**
1. **Puzzle** - 挑战智力
2. **Action** - 考验反应
3. **Typing** - 提升技能

### **专项训练**
1. **Memory** - 记忆力训练
2. **Typing** - 打字速度提升
3. **Puzzle** - 逻辑思维锻炼

---

## 📈 统计数据

```
总游戏数: 42款
总分类数: 7类

分类占比:
┌─────────────────────────┐
│ Action  ████████ 26%    │
│ Puzzle  ████████ 19%    │
│ Arcade  ████████ 19%    │
│ Memory  ████ 10%        │
│ Typing  ████ 10%        │
│ Casual  ████ 10%        │
│ Board   ███ 7%          │
└─────────────────────────┘
```

---

## 🔧 自定义修改

### 添加新游戏
1. 在 `games/` 对应分类文件夹中添加游戏
2. 修改 `script.js` 中的 `gamesData` 对象
3. 添加游戏信息：名称、路径、图标、描述

```javascript
{
    name: '游戏名称',
    path: 'games/分类/游戏文件夹/index.html',
    icon: 'fas fa-图标',
    desc: '游戏描述'
}
```

### 修改主题颜色
在 `style.css` 的 `:root` 中修改CSS变量：

```css
:root {
    --primary: #667eea;      /* 主色调 */
    --secondary: #764ba2;    /* 次要色 */
    --accent: #f093fb;       /* 强调色 */
    /* ... */
}
```

---

## 🎨 设计特点

### 色彩系统
- **Puzzle** - 紫色系（#667eea）
- **Action** - 粉色系（#f093fb）
- **Arcade** - 黄色系（#feca57）
- **Board** - 蓝色系（#48dbfb）
- **Memory** - 红色系（#ff6348）
- **Typing** - 绿色系（#1dd1a1）
- **Casual** - 玫红系（#ee5a6f）

### 动画效果
- 淡入动画
- 悬停提升
- 渐变移动
- 进度条动画
- 背景漂浮

---

## 🎯 核心亮点

| 特性 | 说明 |
|------|------|
| 🎮 **42款游戏** | 精心挑选的HTML5游戏，涵盖7大分类 |
| 🚀 **即点即玩** | 无需下载安装，打开浏览器即可畅玩 |
| 📱 **响应式设计** | 完美适配桌面、平板和移动设备 |
| 🎨 **精美UI** | 现代化设计，渐变色彩，流畅动画 |
| 🔍 **智能搜索** | 实时搜索，快速定位你想玩的游戏 |
| 🏷️ **分类过滤** | 7大游戏分类，一键筛选 |
| ⚡ **性能优化** | 懒加载、动画优化，流畅体验 |
| 🎯 **易于部署** | 支持GitHub Pages等多种部署方式 |

---

## 📝 更新日志

### v1.0.0 (2025-10-28)
- ✅ 初始版本发布
- ✅ 42款游戏完整收录
- ✅ 7大分类系统
- ✅ 搜索和过滤功能
- ✅ 响应式设计
- ✅ 精美UI界面
- ✅ 动画特效
- ✅ 完整文档和部署指南

---

## 🗺️ 路线图

- [ ] 添加更多游戏（目标：100+款）
- [ ] 用户账号系统
- [ ] 游戏收藏功能
- [ ] 游戏评分和评论
- [ ] 多语言支持（英语、日语等）
- [ ] 深色/浅色主题切换
- [ ] PWA支持（离线游戏）
- [ ] 游戏排行榜
- [ ] 社交分享功能
- [ ] 游戏推荐算法

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=SinceraXY/GameHub&type=Date)](https://star-history.com/#SinceraXY/GameHub&Date)

---

## 🤝 贡献指南

欢迎贡献新游戏或改进建议！

1. Fork 本项目
2. 创建特性分支
3. 提交改动
4. 推送到分支
5. 创建 Pull Request

---

## 📄 许可证

Apache License

---

## 🙏 致谢

感谢所有游戏开发者的辛勤付出！

---

## 📞 联系方式

如有问题或建议，欢迎反馈！

- 🐙 **GitHub**: [SinceraXY/GameHub](https://github.com/SinceraXY/GameHub)
- 📧 **Email**: 2952671670@qq.com
- 💬 **QQ**: 2952671670

---

<div align="center">

**🎮 GameHub - 让游戏更有趣！**

Made with ❤️ for gamers