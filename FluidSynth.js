const { spawn } = require("child_process")
const path = require("path")
const resourcesPath = process.resourcesPath || __dirname; 
const fluidsynth = path.join(resourcesPath, "bin", "fluidsynth", "fluidsynth.exe")
const soundfont = path.join(resourcesPath, "bin", "soundfonts", "FluidR3_GM.sf2")

const synth = spawn(fluidsynth, [soundfont])

class FluidSynth {
    constructor() {
        this.stdout = synth.stdout
        this.stderr = synth.stderr
        this.stdin = synth.stdin
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

    read(){
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

    stop(note, fret = 0) {
        this.write(`noteoff 0 ${this.notes[note] + fret}\n`)
    }

    kill() {
        synth.kill()
    }
}

module.exports = FluidSynth