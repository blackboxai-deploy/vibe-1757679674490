const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Performance monitoring
  getMemoryUsage: () => ipcRenderer.invoke('get-memory-usage'),
  
  // Dialog functions
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // Game-specific functions
  platform: process.platform,
  isElectron: true,
  
  // Performance metrics
  getPerformanceMetrics: () => {
    return {
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      timestamp: Date.now()
    }
  },
  
  // Screenshot functionality
  takeScreenshot: () => ipcRenderer.invoke('take-screenshot'),
  
  // Settings management
  getSetting: (key) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  
  // Game client specific features
  gameClient: {
    minimize: () => ipcRenderer.invoke('minimize-window'),
    maximize: () => ipcRenderer.invoke('maximize-window'),
    close: () => ipcRenderer.invoke('close-window'),
    isMaximized: () => ipcRenderer.invoke('is-window-maximized'),
    
    // Game performance settings
    setPerformanceMode: (mode) => ipcRenderer.invoke('set-performance-mode', mode),
    getPerformanceMode: () => ipcRenderer.invoke('get-performance-mode'),
    
    // Audio settings
    setMasterVolume: (volume) => ipcRenderer.invoke('set-master-volume', volume),
    getMasterVolume: () => ipcRenderer.invoke('get-master-volume'),
    
    // Display settings
    setFullscreen: (fullscreen) => ipcRenderer.invoke('set-fullscreen', fullscreen),
    isFullscreen: () => ipcRenderer.invoke('is-fullscreen'),
    
    // Network status
    isOnline: () => navigator.onLine,
    
    // Hardware acceleration
    isHardwareAccelerated: () => ipcRenderer.invoke('is-hardware-accelerated')
  }
})

// Enhanced game client features
contextBridge.exposeInMainWorld('madrigalClient', {
  version: '1.0.0',
  name: 'Madrigal Ascension Desktop Client',
  
  // Client-specific optimizations
  optimizations: {
    // Enable high-performance GPU when available
    enableHighPerformanceGPU: () => ipcRenderer.invoke('enable-high-performance-gpu'),
    
    // Memory optimization
    optimizeMemory: () => ipcRenderer.invoke('optimize-memory'),
    
    // Network optimization
    optimizeNetwork: () => ipcRenderer.invoke('optimize-network'),
    
    // Rendering optimization
    setRenderingQuality: (quality) => ipcRenderer.invoke('set-rendering-quality', quality)
  },
  
  // Game state persistence
  persistence: {
    saveGameState: (state) => ipcRenderer.invoke('save-game-state', state),
    loadGameState: () => ipcRenderer.invoke('load-game-state'),
    clearGameState: () => ipcRenderer.invoke('clear-game-state')
  },
  
  // Social features
  social: {
    shareScreenshot: (imagePath) => ipcRenderer.invoke('share-screenshot', imagePath),
    inviteFriend: (friendCode) => ipcRenderer.invoke('invite-friend', friendCode),
    joinVoiceChat: (channelId) => ipcRenderer.invoke('join-voice-chat', channelId)
  },
  
  // Anti-cheat integration
  security: {
    verifyClient: () => ipcRenderer.invoke('verify-client'),
    reportSuspiciousActivity: (activity) => ipcRenderer.invoke('report-suspicious-activity', activity)
  },
  
  // Analytics and telemetry (with user consent)
  analytics: {
    trackEvent: (event, data) => ipcRenderer.invoke('track-event', event, data),
    trackPerformance: (metrics) => ipcRenderer.invoke('track-performance', metrics),
    setAnalyticsEnabled: (enabled) => ipcRenderer.invoke('set-analytics-enabled', enabled)
  }
})

// Console logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('Madrigal Ascension - Preload script loaded')
  console.log('Platform:', process.platform)
  console.log('Electron version:', process.versions.electron)
  console.log('Node version:', process.versions.node)
}

// Add client detection for the web app
window.addEventListener('DOMContentLoaded', () => {
  // Add a class to body to indicate this is the desktop client
  document.body.classList.add('madrigal-desktop-client')
  
  // Add client info to window object for game detection
  window.MADRIGAL_CLIENT = {
    isDesktop: true,
    version: '1.0.0',
    platform: process.platform,
    capabilities: {
      highPerformance: true,
      fileSystem: true,
      nativeNotifications: true,
      hardwareAcceleration: true,
      voiceChat: true,
      screenshotSharing: true
    }
  }
})

// Performance monitoring
let performanceInterval
window.addEventListener('load', () => {
  // Start performance monitoring for the game
  performanceInterval = setInterval(() => {
    const memory = process.memoryUsage()
    const performance = {
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024), // MB
      external: Math.round(memory.external / 1024 / 1024), // MB
      fps: Math.round(1000 / 16.67), // Approximate FPS
      timestamp: Date.now()
    }
    
    // Emit performance data to the game if it's listening
    if (window.gamePerformanceMonitor) {
      window.gamePerformanceMonitor(performance)
    }
  }, 5000) // Every 5 seconds
})

window.addEventListener('beforeunload', () => {
  if (performanceInterval) {
    clearInterval(performanceInterval)
  }
})