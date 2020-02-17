import { app, BrowserWindow } from 'electron'
import Copier from './copier';
import store from '../renderer/store'
import fs from 'fs';


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  if (process.env.NODE_ENV === 'development') {
    mainWindow = new BrowserWindow({
      height: 350,
      useContentSize: true,
      width: 500,
      //fullscreen: true
    });
  }
  else {
    mainWindow = new BrowserWindow({
      height: 600,
      useContentSize: true,
      width: 800,
      fullscreen: true
    });
  }

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

//Initialize the applications vuex store.
app.store = store;

//Instatiate the Copier class 
app.copier = new Copier(app);
app.copier.loadStore();

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})