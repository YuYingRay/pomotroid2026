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
  - [New in v0.14.0](#new-in-v0140)
  - [Themes](#themes)
- [Install](#install)
  - [Windows](#windows)
  - [macOS](#macos)
  - [Linux](#linux)
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

### New in v0.14.0

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

Download the latest version from the [releases](https://github.com/YuYingRay/pomotroid2026/releases) page.

### Windows

1. Download `pomotroid-x.x.x-setup.exe` (installer) or `pomotroid-x.x.x-portable.exe` (portable)
2. Run the installer or portable executable
3. If Windows SmartScreen shows a warning, click "More info" then "Run anyway"

### macOS

1. Download `pomotroid-x.x.x-macos-arm64.zip` (Apple Silicon M1/M2/M3) or `pomotroid-x.x.x-macos-x64.zip` (Intel)
2. Unzip the file to get `Pomotroid.app`
3. Move `Pomotroid.app` to the `/Applications` folder
4. **Important**: Since the app is not signed with an Apple Developer certificate, you need to remove the quarantine attribute:

   Open Terminal and run:
   ```bash
   sudo xattr -rd com.apple.quarantine /Applications/Pomotroid.app
   ```
   Enter your password when prompted.

5. Now you can open Pomotroid from the Applications folder

> **Note**: This is a standard procedure for unsigned open-source applications on macOS. The `xattr` command removes the quarantine flag that macOS adds to downloaded files.

### Linux

1. Download one of the following:
   - `pomotroid-x.x.x-linux.AppImage` - Universal format, works on most distributions
   - `pomotroid-x.x.x-linux.deb` - For Debian/Ubuntu-based distributions
   - `pomotroid-x.x.x-linux.tar.gz` - Compressed archive

2. For AppImage:
   ```bash
   chmod +x pomotroid-x.x.x-linux.AppImage
   ./pomotroid-x.x.x-linux.AppImage
   ```

3. For .deb:
   ```bash
   sudo dpkg -i pomotroid-x.x.x-linux.deb
   ```

## Development

Pomotroid is built with [Vue.js](https://github.com/vuejs/vue), [Electron](https://github.com/electron/electron), and [electron-vue](https://github.com/SimulatedGREG/electron-vue).

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
