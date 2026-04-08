const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    close: () => ipcRenderer.send('close-app'),
    play: (data) => ipcRenderer.send('play', data),
})

window.addEventListener('DOMContentLoaded', () => {
    for (const dependency of ['chrome', 'node', 'electron']) {
        console.log(`${dependency}-version`, process.versions[dependency])
    }
})