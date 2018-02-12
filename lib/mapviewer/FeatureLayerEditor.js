const { BrowserWindow } = require('electron')
const fs = require('fs')
const url = require('url')
const path = require('path')

let FeatureLayerEditor = (function () {
  let isActive = false
  function FeatureLayerEditor () {
    if (isActive) {
      FeatureLayerEditor.open = () => {}
    } else {
      isActive = true
      FeatureLayerEditor.open = (opts) => {
        if (opts && opts.name && opts.path && opts.mainWindow) {
          this.window = new BrowserWindow({
            'parent': opts.mainWindow,
            'title': 'mapviewer : Edit ' + opts.name,
            'width': 800,
            'height': 600,
            'show': false
          })
          this.window.loadURL(url.format({
            pathname: path.join(__dirname, '../../layereditor.html'),
            protocol: 'file:',
            slashes: true
          }))
          this.window.once('ready-to-show', () => {
            fs.readFile('config/featurelayers.json', (err, data) => {
              if (err) throw err
              this.window.webContents.send('set-jsoneditor-data', {
                'json': JSON.parse(data),
                'schema': JSON.parse(fs.readFileSync('schemata/layerFileSchema.json', 'utf8')),
                'schemaRefs': {
                  'point': JSON.parse(fs.readFileSync('schemata/pointSchema.json', 'utf8')),
                  'layer': JSON.parse(fs.readFileSync('schemata/layerSchema.json', 'utf8')),
                  'latLngBounds': JSON.parse(fs.readFileSync('schemata/latLngBoundsSchema.json', 'utf8')),
                  'layerSource': JSON.parse(fs.readFileSync('schemata/layerSourceSchema.json', 'utf8')),
                  'layerOpts': JSON.parse(fs.readFileSync('schemata/layerOptsSchema.json', 'utf8')),
                  'subDomain': JSON.parse(fs.readFileSync('schemata/subDomainsSchema.json', 'utf8'))
                }
              })
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
    return FeatureLayerEditor
  }
  return FeatureLayerEditor
})()

exports.FeatureLayerEditor = FeatureLayerEditor
