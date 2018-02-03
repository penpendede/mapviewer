const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

let win
let menuTemplate
let menu

fs.readFile('config/menutemplate.json', (err, data) => {
  if (err) throw err
  menuTemplate = JSON.parse(data)

  if (process.platform === 'darwin') {
    menuTemplate.unshift({
      label: 'Electron',
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })
    menuTemplate[1].submenu.push({
      type: 'separator'
    }, {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    })
    menuTemplate[3].submenu = [
      {
        role: 'close'
      },
      {
        role: 'minimize'
      },
      {
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        role: 'front'
      }
    ]
  } else {
    menuTemplate.unshift({
      label: 'File',
      submenu: [{
        role: 'quit'
      }]
    })
  }

  fs.readFile('config/baselayers.json', (err, data) => {
    if (err) throw err
    let baseLayerSubMenu = []
    let layers = JSON.parse(data)
    for (let element of layers) {
      baseLayerSubMenu.push({
        'label': element.label,
        'click': () => {
          win.webContents.send('set-base-layer', element.source)
        }
      })
    }
    fs.readFile('config/featurelayers.json', (err, data) => {
      if (err) throw err
      let featureLayerSubMenu = []
      let layers = JSON.parse(data)
      for (let element of layers) {
        featureLayerSubMenu.push({
          'label': element.label,
          'click': () => {
            win.webContents.send('toggle-feature-layer', element.source)
          }
        })
      }
      menuTemplate[3] = {
        'label': 'Baselayers',
        'submenu': baseLayerSubMenu
      }
      menuTemplate[4] = {
        'label': 'Featurelayers',
        'submenu': featureLayerSubMenu
      }
      menu = Menu.buildFromTemplate(menuTemplate)
      Menu.setApplicationMenu(menu)
    })
  })
})

let createWindow = () => {
  win = new BrowserWindow({width: 1000, height: 800})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
