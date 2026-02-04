<div align="center">
  <img alt="Pomotroid" src=".github/images/pomotroid-title.png" width="800px">
</div>
<div align="center">
  <img alt="Pomotroid in action" src=".github/images/pomotroid-screens.png" width="800px">
</div>

<p align="center">Simple and visually-pleasing Pomodoro timer.</p>

<p align="center">
  <strong>🌐 English | 简体中文</strong>
</p>

---

- [Overview](#overview)
- [Features](#features)
  - [New in v0.13.1](#new-in-v0131)
  - [Themes](#themes)
- [Install](#install)
  - [Download](#download)
- [Development](#development)
  - [Build Setup](#build-setup)
- [License](#license)

## Overview

Pomotroid is a simple and configurable Pomodoro timer. It aims to provide a visually-pleasing and reliable way to track productivity using the Pomodoro Technique.

This is an enhanced fork with Chinese language support and celebration effects.

## Features

- Customize times and number of rounds (persistent)
- Charming timer alert sounds (optional)
- Desktop notifications (optional)
- Minimize to tray (optional)
- Several themes included with the ability to create custom themes
- Timer activity logging

### New in v0.13.1

- **🌐 Multi-language Support**: Switch between English and Simplified Chinese
  - Language switcher in titlebar
  - First-launch language selection
  - All UI text internationalized including tray menu and theme names

- **🎉 Celebration Effects**: Visual celebration when completing focus sessions
  - Three styles: Confetti, Fireworks, Stars
  - Configurable trigger (work complete, break complete, all, or cycle complete)
  - Adjustable duration (3-10 seconds)
  - Works even when minimized to system tray
  - Click or press ESC to close

### Themes

Pomotroid provides many themes. It's also theme-able, allowing you to customize its appearance.

![Screenshots of Pomotroid using various themes](./.github/images/pomotroid_themes-preview--914x219.png)

Visit the [theme documentation](./docs/themes/themes.md) to view the full list of official themes and for instruction on creating your own.

## Install

### Download

Download the latest version from the [releases](https://github.com/YuYingRay/pomotroid2026/releases) page.

- **Setup installer**: `pomotroid-x.x.x-setup.exe` - Standard Windows installer
- **Portable version**: `pomotroid-x.x.x-portable.exe` - No installation required

## Development

Pomotroid is built with [Vue.js](https://github.com/vuejs/vue), [Electron](https://github.com/electron/electron), and [electron-vue](https://github.com/SimulatedGREG/electron-vue).

_Note: depending on your OS settings, you may receive a security warning upon installation. This has to do with Pomotroid being an unsigned application._

### Build Setup

```bash
# install dependencies
npm i

# serve with hot reload at localhost:9080
npm run dev

# build Pomotroid for production
npm run build
```

## License

MIT &copy; [Christopher Murphy](https://github.com/Splode)

Enhanced by [YuYingRay](https://github.com/YuYingRay)
