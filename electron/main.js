const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

// Keep a global reference of the window object
let mainWindow
let splashWindow

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  const splashHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #1e1b4b, #3730a3, #1e1b4b);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: white;
          overflow: hidden;
        }
        .logo {
          font-size: 3.5rem;
          font-weight: bold;
          background: linear-gradient(45deg, #a855f7, #ec4899, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          margin-bottom: 10px;
          animation: glow 2s ease-in-out infinite alternate;
        }
        .subtitle {
          font-size: 1.5rem;
          color: #c084fc;
          margin-bottom: 40px;
          text-align: center;
        }
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(168, 85, 247, 0.3);
          border-left: 4px solid #a855f7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .loading-text {
          color: #e2e8f0;
          font-size: 1rem;
        }
        .version {
          position: absolute;
          bottom: 20px;
          right: 20px;
          color: #64748b;
          font-size: 0.8rem;
        }
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(168, 85, 247, 0.6);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        @keyframes glow {
          from { text-shadow: 0 0 20px #a855f7, 0 0 30px #a855f7, 0 0 40px #a855f7; }
          to { text-shadow: 0 0 10px #a855f7, 0 0 20px #ec4899, 0 0 30px #ec4899; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 1; }
          50% { transform: translateY(-40px) translateX(-10px); opacity: 0.7; }
          75% { transform: translateY(-20px) translateX(5px); opacity: 1; }
        }
      </style>
    </head>
    <body>
      <div class="particles">
        ${Array.from({length: 20}, (_, i) => 
          `<div class="particle" style="left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-delay: ${Math.random() * 5}s;"></div>`
        ).join('')}
      </div>
      
      <div class="logo">MADRIGAL<br>ASCENSION</div>
      <div class="subtitle">Rise Above the Clouds</div>
      
      <div class="loading">
        <div class="spinner"></div>
        <div class="loading-text">Initializing the mystical world...</div>
      </div>
      
      <div class="version">v1.0.0</div>
    </body>
    </html>
  `
  
  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(splashHTML)}`)
  
  // Auto-close splash after 3 seconds
  setTimeout(() => {
    if (splashWindow) {
      splashWindow.close()
      splashWindow = null
    }
  }, 3000)
}

function createMainWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1e1b4b'
  })

  // Remove default menu for a cleaner game experience
  const template = [
    {
      label: 'Madrigal Ascension',
      submenu: [
        {
          label: 'About Madrigal Ascension',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Madrigal Ascension',
              message: 'Madrigal Ascension v1.0.0',
              detail: 'A next-generation MMORPG with AI-powered assistance.\n\nBuilt with modern web technologies for optimal performance.\n\n© 2024 Madrigal Studios'
            })
          }
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            // TODO: Open settings window
            console.log('Settings clicked')
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Game',
      submenu: [
        {
          label: 'Take Screenshot',
          accelerator: 'F12',
          click: async () => {
            try {
              const image = await mainWindow.capturePage()
              const { filePath } = await dialog.showSaveDialog(mainWindow, {
                defaultPath: `madrigal-screenshot-${Date.now()}.png`,
                filters: [{ name: 'PNG Images', extensions: ['png'] }]
              })
              if (filePath) {
                require('fs').writeFileSync(filePath, image.toPNG())
                dialog.showMessageBox(mainWindow, {
                  type: 'info',
                  message: 'Screenshot saved successfully!'
                })
              }
            } catch (error) {
              console.error('Screenshot error:', error)
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Performance Monitor',
          click: () => {
            mainWindow.webContents.toggleDevTools()
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Game Guide',
          click: () => {
            // TODO: Open in-game help or external guide
            console.log('Game Guide clicked')
          }
        },
        {
          label: 'Report Bug',
          click: () => {
            shell.openExternal('https://github.com/madrigal-ascension/issues')
          }
        },
        { type: 'separator' },
        {
          label: 'Visit Website',
          click: () => {
            shell.openExternal('https://madrigal-ascension.com')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../out/index.html')}`
  
  mainWindow.loadURL(startUrl)

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Prevent navigation away from the app
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    if (parsedUrl.origin !== startUrl && !startUrl.includes('localhost')) {
      event.preventDefault()
    }
  })
}

// App event handlers
app.whenReady().then(() => {
  createSplashWindow()
  
  setTimeout(() => {
    createMainWindow()
  }, 1000)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers for game features
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options)
  return result
})

ipcMain.handle('get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    electronVersion: process.versions.electron
  }
})

// Performance monitoring
ipcMain.handle('get-memory-usage', () => {
  return process.memoryUsage()
})

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    shell.openExternal(navigationUrl)
  })
})

// Handle certificate errors for HTTPS
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (isDev) {
    event.preventDefault()
    callback(true)
  } else {
    callback(false)
  }
})

console.log('Madrigal Ascension Desktop Client - Electron Main Process Started')