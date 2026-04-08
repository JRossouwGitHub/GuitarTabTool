const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")
const resourcesPath = process.resourcesPath;
let fluidsynth = path.join(resourcesPath, "bin", "fluidsynth", "fluidsynth.exe")
let soundfont = path.join(resourcesPath, "bin", "soundfonts", "FluidR3_GM.sf2")

if (!fs.existsSync(fluidsynth)) {
    fluidsynth = path.join(__dirname, "bin", "fluidsynth", "fluidsynth.exe")
    soundfont = path.join(__dirname, "bin", "soundfonts", "FluidR3_GM.sf2")
}

const synth = spawn(fluidsynth, [soundfont])

class FluidSynth {
    constructor() {
        this.stdout = synth.stdout
        this.stderr = synth.stderr
        this.stdin = synth.stdin
        this.done = false
        this.instruments = {
            "guitar": 24
        }
        this.notes = {
            "e": 64,
            "B": 59,
            "G": 55,
            "D": 50,
            "A": 45,
            "E": 40
        }
        //this.read()
    }

    read() {
        this.stdout.on("data", d => console.log(d.toString()))
        this.stderr.on("data", d => console.error(d.toString()))
    }

    write(data) {
        this.stdin.write(data)
    }

    instrument(name) {
        this.write(`select 0 1 0 ${this.instruments[name]}\n`)
    }

    play(note, fret = 0) {
        this.write(`noteon 0 ${this.notes[note] + fret} 100\n`)
    }

    start(data) {
        let tab = 0
        let measure = 0
        let beat = 0
        this.done = data.play
        let playInterval = setInterval(() => {
            if (this.done) {
                clearInterval(playInterval)
                return
            }
            let line = data.tabs[tab][measure][beat].map((n, i) => n !== null ? [data.notes[i], n] : []).filter(n => n.length > 0)
            line.map((n) => this.play(n[0], n[1]))
            beat++
            if (beat >= data.tabs[tab][measure].length) {
                beat = 0
                measure++
                if (measure >= data.tabs[tab].length) {
                    measure = 0
                    tab++
                    if (tab >= data.tabs.length) {
                        tab = 0
                        this.done = true
                    }
                }
            }
        }, data.timing)
    }

    stop(note, fret = 0) {
        this.write(`noteoff 0 ${this.notes[note] + fret}\n`)
    }

    kill() {
        synth.kill()
    }
}

module.exports = FluidSynth