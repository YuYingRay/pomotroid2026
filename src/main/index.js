'use strict'

import { logger } from './../renderer/utils/logger'
import { createLocalStore } from './../renderer/utils/LocalStore'
import {
  app,
  globalShortcut,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage,
  screen
} from 'electron'
import { init as websocketInit } from './sockets'

const electron = require('electron')
const path = require('path')
const localStore = createLocalStore()

// i18n messages for main process
const messages = {
  en: {
    view: 'View',
    exit: 'Exit'
  },
  'zh-CN': {
    view: '显示',
    exit: '退出'
  }
}

function getLocaleMessages() {
  const locale = localStore.get('locale') || 'en'
  return messages[locale] || messages.en
}

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, tray, celebrationWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${__dirname}/index.html`

app.disableHardwareAcceleration()

app.whenReady().then(() => {
  logger.info('app ready')
  createWindow()
  const minToTray = localStore.get('minToTray')
  const alwaysOnTop = localStore.get('alwaysOnTop')

  if (minToTray) {
    createTray()
  }

  // this must be set after window has been created on ubuntu 18.04
  mainWindow.setAlwaysOnTop(alwaysOnTop)

  // remove menu to stop the window being closed on Ctrl+W. See #121
  mainWindow.setMenu(null)

  // load shortcuts from storage
  loadGlobalShortcuts(localStore.get('globalShortcuts'))

  // launch local websocket on port 1314
  websocketInit(1314)
})

app.on('window-all-closed', () => {
  logger.info('quitting app...')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('toggle-alwaysOnTop', (event, arg) => {
  mainWindow.setAlwaysOnTop(arg)
})

let breakAlwaysOnTop

ipcMain.on('toggle-breakAlwaysOnTop', (event, arg) => {
  breakAlwaysOnTop = arg
  if (breakAlwaysOnTop === false) {
    mainWindow.setAlwaysOnTop(true)
  }
})

ipcMain.on('onBreak', (event, arg) => {
  if (breakAlwaysOnTop === true) {
    mainWindow.setAlwaysOnTop(!arg)
  }
})

ipcMain.on('toggle-minToTray', (event, arg) => {
  if (arg) {
    createTray()
  } else {
    tray.destroy()
  }
})

ipcMain.on('window-close', (event, arg) => {
  mainWindow.close()
})

ipcMain.on('window-minimize', (event, arg) => {
  if (arg) {
    mainWindow.hide()
  } else {
    mainWindow.minimize()
  }
})

ipcMain.on('tray-icon-update', (event, image) => {
  const nativeImg = nativeImage.createFromDataURL(image)
  tray.setImage(nativeImg)
})

ipcMain.on('reload-global-shortcuts', (event, shortcuts) => {
  // reload shortcuts when they are modified.
  logger.info('reload global shortcuts')
  globalShortcut.unregisterAll()
  loadGlobalShortcuts(shortcuts)
})

// Handle locale change from renderer
ipcMain.on('locale-changed', (event, locale) => {
  logger.info(`Locale changed to: ${locale}`)
  updateTrayMenu()
})

// Handle celebration window
ipcMain.on('show-celebration', (event, options) => {
  createCelebrationWindow(options)
})

ipcMain.on('close-celebration', () => {
  if (celebrationWindow) {
    celebrationWindow.close()
    celebrationWindow = null
  }
})

function createCelebrationWindow(options) {
  const { duration, style } = options
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.bounds

  // Close existing celebration window if any
  if (celebrationWindow) {
    celebrationWindow.close()
    celebrationWindow = null
  }

  celebrationWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    frame: false,
    transparent: false,
    backgroundColor: '#00000050',
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  const celebrationURL = process.env.NODE_ENV === 'development'
    ? `file://${path.join(__dirname, '../../static/celebration.html')}?duration=${duration}&style=${style}`
    : `file://${path.join(__static, 'celebration.html')}?duration=${duration}&style=${style}`

  celebrationWindow.loadURL(celebrationURL)
  celebrationWindow.setIgnoreMouseEvents(false)
  celebrationWindow.focus()

  // Auto close after duration + buffer time
  setTimeout(() => {
    if (celebrationWindow) {
      celebrationWindow.close()
      celebrationWindow = null
    }
  }, (duration + 1) * 1000)

  celebrationWindow.on('closed', () => {
    celebrationWindow = null
  })
}

function getNewWindowPosition() {
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()

  const electronScreen = electron.screen
  const primaryDisplay = electronScreen.getPrimaryDisplay()

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  )

  // Position window 4 pixels vertically below the tray icon
  // Adjust according if tray is at the bottom
  let y = Math.round(trayBounds.y + trayBounds.height + 4)
  if (y > primaryDisplay.workAreaSize.height) {
    y = trayBounds.y - trayBounds.height - windowBounds.height
  }

  return { x: x, y: y }
}

function toggleWindow() {
  if (mainWindow === null) {
    createWindow()
  } else {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  }

  if (process.platform === 'darwin') {
    const position = getNewWindowPosition()
    mainWindow.setPosition(position.x, position.y, false)
  }
}

function createTray() {
  const trayIconFile =
    process.platform === 'darwin' ? 'icon--macos--tray.png' : 'icon.png'
  tray = new Tray(path.join(__static, trayIconFile))
  tray.setToolTip('Pomotroid\nClick to Restore')
  updateTrayMenu()
  tray.on('click', () => {
    toggleWindow()
  })
}

function updateTrayMenu() {
  if (!tray) return
  const t = getLocaleMessages()
  const contextMenu = electron.Menu.buildFromTemplate([
    {
      label: t.view,
      click: function() {
        toggleWindow()
      }
    },
    {
      label: t.exit,
      click: function() {
        app.isQuiting = true
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
}

function createWindow() {
  const alwaysOnTop = localStore.get('alwaysOnTop')
  mainWindow = new BrowserWindow({
    alwaysOnTop,
    backgroundColor: '#2F384B',
    fullscreenable: true,
    frame: false,
    icon:
      process.platform === 'darwin'
        ? path.join(__static, 'icon--macos.png')
        : path.join(__static, 'icon.png'),
    resizable: false,
    useContentSize: true,
    width: 360,
    height: 478,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  mainWindow.loadURL(winURL)

  // send event to renderer on window restore
  mainWindow.on('restore', () => {
    mainWindow.webContents.send('win-restore')
  })

  // send event to renderer on window show
  mainWindow.on('show', () => {
    mainWindow.webContents.send('win-show')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function loadGlobalShortcuts(globalShortcuts) {
  Object.keys(globalShortcuts).forEach(key => {
    logger.info(`Registering shortcut for ${key}: ${globalShortcuts[key]}`)
    globalShortcut.register(globalShortcuts[key], () => {
      logger.info(`Command received: ${key}`)
      mainWindow.webContents.send('event-bus', key)
    })
  })
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
