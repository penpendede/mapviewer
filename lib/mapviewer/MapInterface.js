let MapInterface = (function () {
  let L
  let map
  let currentBaseLayer
  let currentFeatureLayer = []
  const fs = require('fs')
  function MapInterface () {
    fs.readFile('config/startup.json', (err, data) => {
      if (err) throw err
      let opts = JSON.parse(data)
      if (!opts.domElementId) {
        throw new Error('DOM element id is missing')
      }
      if (!L) {
        L = require('../leaflet/leaflet')
      }
      map = L.map(opts.domElementId)
      if (opts.view) {
        if (opts.view.center && (opts.view.zoom || opts.view.zoom === 0)) {
          this.setView(opts.view)
        }
      }
      if (opts.placeHolderBaseLayer) {
        if (opts.placeHolderBaseLayer.source) {
          this.setBaseLayer(opts.placeHolderBaseLayer.source)
        }
      }
    })
  }
  MapInterface.prototype.setBaseLayer = (source) => {
    if (currentBaseLayer) {
      currentBaseLayer.removeFrom(map)
    }
    currentBaseLayer = L.tileLayer(source.uriTemplate, source.opts)
    currentBaseLayer.addTo(map)
  }
  MapInterface.prototype.toggleFeatureLayer = (source) => {
    if (currentFeatureLayer[source.uriTemplate]) {
      currentFeatureLayer[source.uriTemplate].removeFrom(map)
      currentFeatureLayer[source.uriTemplate] = null
    } else {
      currentFeatureLayer[source.uriTemplate] =
        L.tileLayer(source.uriTemplate, source.opts)
      currentFeatureLayer[source.uriTemplate].addTo(map)
    }
  }
  MapInterface.prototype.setView = (opts) => {
    map.setView(opts.center, opts.zoom, opts.options)
  }
  return MapInterface
})()

exports.MapInterface = MapInterface
