const { BrowserWindow } = require('electron')
const fs = require('fs')
const url = require('url')
const path = require('path')

let BaseLayerEditor = (function () {
  let isActive = false
  function BaseLayerEditor () {
    if (isActive) {
      BaseLayerEditor.open = () => {}
    } else {
      isActive = true
      BaseLayerEditor.open = (opts) => {
        if (opts && opts.name && opts.path && opts.mainWindow) {
          this.window = new BrowserWindow({
            'parent': opts.mainWindow,
            'title': 'mapviewer : Edit ' + opts.name,
            'width': 800,
            'height': 600,
            'show': false
          })
          this.window.loadURL(url.format({
            pathname: path.join(__dirname, '../../jsoneditor.html'),
            protocol: 'file:',
            slashes: true
          }))
          this.window.once('ready-to-show', () => {
            fs.readFile('config/baselayers.json', (err, data) => {
              if (err) throw err
              this.window.webContents.send('set-jsoneditor-data', JSON.parse(data))
              this.window.show()
            })
          })
          this.window.on('closed', () => {
            isActive = false
            this.window = null
          })
        }
      }
    }
    return BaseLayerEditor
  }
  return BaseLayerEditor
})()

exports.BaseLayerEditor = BaseLayerEditor
