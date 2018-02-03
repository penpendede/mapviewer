const { dialog } = require('electron')

let LayerEditor = (function () {
  function LayerEditor () {
  }
  LayerEditor.prototype.open = (opts) => {
    if (opts && opts.name && opts.path) {
      dialog.showMessageBox({
        'title': opts.name,
        'message': 'Editing "' + opts.path + '" is not implemented yet.',
        'buttons': ['OK']
      })
    }
  }
  return LayerEditor
})()

exports.LayerEditor = LayerEditor
