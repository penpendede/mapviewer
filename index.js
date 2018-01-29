const {app, BrowserWindow, dialog, Menu, shell} = require('electron');
const path=require('path');
const url=require('url');

let win;

let template = [
  /*
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  */
  {
    label: 'View',
    submenu: [
      {
        role: 'reload'
      },
      {
        role: 'forcereload'
      },
      {
        role: 'toggledevtools'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    label: 'Basislayer',
    submenu: [
      {
        label: 'OpenStreetMap.Mapnik',
        click: () => {
          win.webContents.send('set-base-layer', {
            uriTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            opt: {
              maxZoom: 19,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
          })
        }
      },
      {
        label: 'OpenStreetMap.BlackAndAwhite',
        click: () => {
          win.webContents.send('set-base-layer', {
            uriTemplate: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
            opt: {
              maxZoom: 18,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
          })
        }
      },
      {
        label: 'OpenStreetMap.DE',
        click: () => {
          win.webContents.send('set-base-layer', {
            uriTemplate: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
            opt: {
              maxZoom: 18,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
          })
        }
      },
      {
        label: 'OpenStreetMap.France',
        click: () => {
          win.webContents.send('set-base-layer', {
            uriTemplate: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
            opt: {
              maxZoom: 20,
              attribution: '&copy; Openstreetmap France | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
          })
        }
      },
      {
        label: 'OpenTopoMap',
        click: () => {
          win.webContents.send('set-base-layer', {
            uriTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            opt: {
              maxZoom: 17,
              attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            }
          })
        }
      },
    ]
  },
  {
    label: 'Overlaylayer',
    submenu: [
      {
        label: 'NASAGIBS.ModisTerraSnowCover',
        click: () => {
          win.webContents.send('toggle-overlay-layer', {
            uriTemplate: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_Snow_Cover/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
            opts: {
              attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
              bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
              minZoom: 1,
              maxZoom: 8,
              format: 'png',
              time: '',
              tilematrixset: 'GoogleMapsCompatible_Level',
              opacity: 0.75
            }
          })
        }
      },
      {
        label: 'Stamen TonerLines',
        click: () => {
          win.webContents.send('toggle-overlay-layer', {
            uriTemplate: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.{ext}',
            opts: {
              attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              subdomains: 'abcd',
              minZoom: 0,
              maxZoom: 20,
              ext: 'png'
            }
          })
        }
      },
      {
        label: 'Stamen TonerLabels',
        click: () => {
          win.webContents.send('toggle-overlay-layer', {
            uriTemplate: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.{ext}',
            opts: {
              attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              subdomains: 'abcd',
              minZoom: 0,
              maxZoom: 20,
              ext: 'png'
            }
          })
        }
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About',
        click: () => {
          dialog.showMessageBox({title: 'About', message: 'A simple map viewer', buttons: ['OK']})
        }
      }
      /*
      {
        label: 'Learn More',
        click () {
          shell.openExternal('https://electronjs.org')
        }
      },
      {
        label: 'Documentation',
        click () {
          shell.openExternal(
            `https://github.com/electron/electron/tree/v${process.versions.electron}/docs#readme`
          )
        }
      },
      {
        label: 'Community Discussions',
        click () {
          shell.openExternal('https://discuss.atom.io/c/electron')
        }
      },
      {
        label: 'Search Issues',
        click () {
          shell.openExternal('https://github.com/electron/electron/issues')
        }
      }
      */
    ]
  }
];

if (process.platform === 'darwin') {
  template.unshift({
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
  });
  template[1].submenu.push({
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
  });
  template[3].submenu = [
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
  template.unshift({
    label: 'File',
    submenu: [{
      role: 'quit'
    }]
  })
}


const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

let createWindow = () => {
  win = new BrowserWindow({width: 1000, height: 800});
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.on('closed', () => {
    win = null
  })
};


app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});
