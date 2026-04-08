let resetBtn = document.getElementById('resetBTN')
let setBtn = document.getElementById('setBTN')
let playBtn = document.getElementById('playBTN')

let measuresPerTab = 2
let bpm = document.getElementById('bpmIN').value
let measure = document.getElementById('measuresIN').value
let beats = document.getElementById('beatsIN').value
let notes = ['e', 'B', 'G', 'D', 'A', 'E']
let tabs = []
let tab = []

song.map((_tabs, i) => {
    _tabs.map(_beat => {
        tab.push(_beat)
    })
    tabs.push(tab)
    tab = []
})

console.log(tabs)

let root = document.getElementById('root')
let tabContainer = document.createElement('div')
tabContainer.setAttribute('id', 'tab-container')
root.appendChild(tabContainer)

resetBtn.addEventListener('click', resetTabs)
setBtn.addEventListener('click', setTabs)
playBtn.addEventListener('click', () => {
    api.play({tabs: [tabs], notes: notes, timing: 60000 / bpm})
})

creatTabs()

function resetTabs(){
    bpm = 120
    measure = 4
    beats = 4
    document.getElementById('bpmIN').value = bpm
    document.getElementById('measuresIN').value = measure
    document.getElementById('beatsIN').value = beats
    creatTabs()
}

function setTabs(){
    bpm = document.getElementById('bpmIN').value
    measure = document.getElementById('measuresIN').value
    beats = document.getElementById('beatsIN').value
    creatTabs()
}

function creatTabs(){
    console.log("Called")
    tabContainer.innerHTML = ''
    let tunings = document.createElement('div')
    tunings.setAttribute('id', 'tunings')
    for(let i = 0; i < notes.length; i++){
        let note = document.createElement('div')
        note.setAttribute('class', 'notes')
        note.innerHTML = notes[i]
        tunings.appendChild(note)
    }
    tabContainer.appendChild(tunings)

    for(let j = 0; j < measuresPerTab; j++){
        for(let i = 0; i < measure; i++){
            let measureCounter = document.createElement('div')
            measureCounter.setAttribute('class', 'measure-counter')
            measureCounter.innerHTML = (j*measure) + (i+1)
            measureCounter.appendChild(createMeasure((j*measure) + i))
            measureCounter.appendChild(createBeat())
            tabContainer.appendChild(measureCounter)
        }
    }

    tabs.map((tab, i) => {
        tab.map((line, j) => {
            line.map((note, k) => {
                if(note != null){
                    let mnb = i + notes[k] + j
                    let _note = document.createElement('div')
                    _note.setAttribute('class', 'note')
                    _note.innerHTML = note
                    document.getElementById(mnb).appendChild(_note) 
                }
            })
        })
    })
}

function createBeat(){
    let beatContainer = document.createElement('div')
    beatContainer.setAttribute('class', 'beat-container')
    for(let i = 0; i < beats; i++){
        let beat = document.createElement('div')
        beat.setAttribute('class', 'beat')
        beatContainer.appendChild(beat)
    }
    return beatContainer
}

function createMeasure(m){
    let measureContainer = document.createElement('div')
    measureContainer.setAttribute('class', 'measure-container')
    for(let i = 0; i < 6; i++){
        measureContainer.appendChild(createString(m + notes[i]))
    }
    return measureContainer
}

function createString(b){
    let stringContainer = document.createElement('div')
    stringContainer.setAttribute('class', 'string-container')
    for(let i = 0; i < beats; i++){
        let string = document.createElement('div')
        string.setAttribute('id', b + i)
        string.setAttribute('class', 'string')
        stringContainer.appendChild(string)
    }
    return stringContainer
}