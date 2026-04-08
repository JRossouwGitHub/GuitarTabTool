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
            let tab = 0
            let measure = 0
            let beat = 0
            let done = false
            setInterval(() => {
                if(done) return
                let line = data.tabs[tab][measure][beat].map((n,i) => n !== null ? [data.notes[i], n] : []).filter(n => n.length > 0)
                line.map((n) => fluidsynth.play(n[0], n[1]))
                beat++
                if(beat >= data.tabs[tab][measure].length){
                    beat = 0
                    measure++
                    if(measure >= data.tabs[tab].length){
                        measure = 0
                        tab++
                        if(tab >= data.tabs.length){
                            tab = 0
                            done = true
                        }
                    }
                }
            }, data.timing)
        })
    }, 1000)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})