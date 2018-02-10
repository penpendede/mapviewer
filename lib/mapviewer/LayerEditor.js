const { BrowserWindow } = require('electron')
const url = require('url')

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
            'height': 600})
          this.window.loadURL(url.format({
            pathname: opts.path,
            protocol: 'file:',
            slashes: true
          }))
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
            'height': 600})
          this.window.loadURL(url.format({
            pathname: opts.path,
            protocol: 'file:',
            slashes: true
          }))
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

exports.BaseLayerEditor = BaseLayerEditor
exports.FeatureLayerEditor = FeatureLayerEditor
