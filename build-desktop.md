# 💻 Building Madrigal Ascension Desktop Client

## Prerequisites

Make sure you have all dependencies installed:

```bash
pnpm install
```

## Build Process

### 1. Build Web Application
```bash
# Build the Next.js application for production
BUILD_ELECTRON=true pnpm build
```

### 2. Test Electron in Development
```bash
# Test the desktop client in development mode
pnpm electron:dev
```

### 3. Package for Current Platform
```bash
# Package for your current operating system
pnpm electron:pack
```

### 4. Build Platform-Specific Distributions

#### Windows
```bash
# Builds Windows installer (.exe)
pnpm pack-win

# Output: dist/madrigal-ascension Setup 1.0.0.exe
```

#### macOS  
```bash
# Builds macOS DMG (requires macOS)
pnpm pack-mac

# Output: dist/madrigal-ascension-1.0.0.dmg
```

#### Linux
```bash
# Builds Linux AppImage
pnpm pack-linux

# Output: dist/madrigal-ascension-1.0.0.AppImage
```

## Desktop Client Features

### Enhanced Performance
- **Hardware Acceleration**: Native GPU access for better 3D rendering
- **Memory Optimization**: Dedicated process without browser overhead  
- **Faster Loading**: Asset caching reduces subsequent load times
- **Background Processing**: Game continues processing when minimized

### Native Integration
- **System Notifications**: Native alerts for game events
- **Tray Integration**: Minimize to system tray
- **Auto-Updates**: Built-in update mechanism (future)
- **File System Access**: Direct save/load capabilities

### Game-Specific Features
- **Screenshot Tool**: Built-in capture with F12 hotkey
- **Performance Monitor**: Real-time FPS and memory usage
- **Windowed/Fullscreen**: Native window controls
- **Multiple Resolutions**: Support for various screen sizes

## Configuration

### Build Configuration
The desktop build is configured in `package.json`:

```json
{
  "build": {
    "appId": "com.madrigalstudios.madrigal-ascension",
    "productName": "Madrigal Ascension",
    "directories": {
      "output": "dist"
    },
    "files": [
      "out/**/*",
      "electron/**/*",
      "node_modules/**/*"
    ]
  }
}
```

### Environment Variables
- `BUILD_ELECTRON=true` - Enables static export mode
- `NODE_ENV=production` - Production build optimizations

## Distribution

### File Sizes (Approximate)
- **Windows**: ~150MB installer
- **macOS**: ~180MB DMG  
- **Linux**: ~160MB AppImage

### System Requirements
- **Windows**: Windows 10 or later
- **macOS**: macOS 10.14 or later
- **Linux**: Modern distribution with AppImage support

## Troubleshooting

### Common Issues

#### Build Fails on Static Export
```bash
# Ensure BUILD_ELECTRON is set
BUILD_ELECTRON=true pnpm build
```

#### Electron Window Won't Open
- Check main.js path in package.json
- Verify preload.js exists
- Check for JavaScript errors in console

#### Missing Dependencies
```bash
# Clean install all dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Debug Mode
```bash
# Run with debug output
DEBUG=electron* pnpm electron:dev
```

## Advanced Configuration

### Custom Icon
Place your icon files in `assets/` directory:
- `assets/icon.png` - Main application icon
- `assets/icon.ico` - Windows icon
- `assets/icon.icns` - macOS icon

### Code Signing (Production)
For production releases, configure code signing:

```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/certificate.p12",
      "certificatePassword": "password"
    },
    "mac": {
      "identity": "Developer ID Application: Your Name"
    }
  }
}
```

### Auto-Updater
Configure automatic updates:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "madrigal-ascension",
      "repo": "madrigal-ascension"
    }
  }
}
```

## Security Considerations

### Sandboxing
The desktop client uses Electron's security best practices:
- Context isolation enabled
- Node integration disabled in renderer
- Secure IPC communication via preload script

### Content Security Policy
Web content runs with CSP headers for security:
- No inline scripts
- Restricted resource loading
- Safe external link handling

---

**Ready to build your desktop client?**

1. Run `pnpm install` to install dependencies
2. Run `BUILD_ELECTRON=true pnpm build` to build the web app
3. Run `pnpm pack-win` (or your target platform) to create installer
4. Find your installer in the `dist/` directory!

*Your Madrigal Ascension desktop client is ready for distribution! 🚀*