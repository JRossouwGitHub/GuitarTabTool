const { app, BrowserWindow, ipcMain } = require('electron')
const menu = require('./Menu.js')
const path = require('node:path')
const FluidSynth = require('./FluidSynth.js')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    })

    ipcMain.on('close-app', () => {
        app.quit()
    })

    win.loadFile('index.html')
    return win
}

app.on('ready', () => {
    let _win = createWindow()
    let fluidsynth = new FluidSynth()
    fluidsynth.instrument("guitar")
    setTimeout(() => {
        ipcMain.on('play', (event, data) => {
            fluidsynth.start(data)
        })
    }, 100)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})