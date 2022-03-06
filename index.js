const { Midi } = require('@tonejs/midi');

const _midi = require('@tonaljs/tonal');
const { Chord } = require('@tonaljs/tonal');

const fs = require('fs');
const data = fs.readFileSync('data.csv', 'utf8').split('\r\n');

const res = [];
for (const note of data) {
    const time = note.split(',')[0];
    let chordName = note.split(',')[1];

    if (chordName.indexOf('/') !== -1) {
        chordName = chordName.split('/')[0];
    }

    if (chordName == 'N') continue;

    res.push({
        time: time,
        note: Chord.get(chordName),
    });

}

const midi = new Midi();
const track = midi.addTrack();

for (let i = 0; i < res.length; i++) {
    const chord = res[i];
    let duration;
    if (i === res.length - 1) duration = 1;
    else duration = res[i + 1].time - chord.time;

    // }
    // for (const chord of res) {

    chord.note = Chord.getChord(chord.note.aliases[0], chord.note.tonic + '4', chord.note.tonic + '4');

    for (const n of chord.note.notes) {
        track.addNote({
            midi: _midi.Midi.toMidi(n),
            time: chord.time,
            duration: duration,
        });
    }
}

fs.writeFileSync('output.mid', new Buffer(midi.toArray()));