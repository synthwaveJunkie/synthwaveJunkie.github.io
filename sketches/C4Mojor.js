let ready = false;
let masterVolume = -2;
let scale;

let sequence = [0, 1, 2, 3, 4, 3, -1, 7];
var kickPatterns = [0, [1], 2, 3, 4, 5, 6, 7];
var hhPattern = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

let track, track2, track3;

let hhPan = new Tone.Panner({ channelCount: 2, pan: -0.5 });
let tekPan = new Tone.Panner({ channelCount: 2, pan: 0.5 });
let solPan = new Tone.Panner({ channelCount: 2, pan: -0.4 });

let hhGain = new Tone.Gain(0.3);
let kickGain = new Tone.Gain(2.1);
let clapGain = new Tone.Gain();

this.commonBPM = 100;

var a, b, c, d, e, f, g, h; //kick beats  8n
a = 0;
b = null;
c = 2;
d = null;
e = 4;
f = null;
g = 6;
h = null;

let filter2 = new Tone.Filter({
  channelCount: 2,
  Q: 0.5,
  frequency: 350,
  type: "highpass",
  rolloff: -24,
});

/////////////////////////////////////////////////////////SAMPLES////////////////////////////
const kick = new Tone.Sampler({
  urls: {
    C4: "https://synthwavejunkie.github.io/audio/bass_sample.mp3",
  },
  //baseUrl: "",
  onload: () => {
    console.log("loaded kick");
  },
});

const hh = new Tone.Sampler({
  urls: {
    C3: "https://synthwavejunkie.github.io/audio/hh_sample.mp3",
  },
  //baseUrl: "https://synthwavejunkie.github.io/audio/",
  onload: () => {
    console.log("loaded hh");
  },
});

var choice; // passes the note durations which are needed for randomisation
var index = 0; // counts for kick's sequence // clock1
var index2 = 1; // counts for hihat's sequence  clock2
var duration = [[2], [2, 2], [2, 2, 2, 2], [null, 2], [2, 2, 2], [null, 2]];
let gui;
let v = 1;
/////////////////////////////////////Kick Clock////////////////////////////////////
const clock = new Tone.Clock((time) => {
  //kick's clock
  index++;
  index = index % 8;
  choice = random(duration);
  kickSeq.events = [
    p1(a),
    p4(choice),
    p1(c),
    p4(choice),
    p2(e),
    p4(choice),
    p1(g),
    p4(choice),
  ];
}, 100 / 60);
//clock.blockTime.value = 512
//////////////////////////////////////////Hi-hat Clock/////////////////
const clock2 = new Tone.Clock((time) => {
  //hihat's clock
  index2++;
  
  //console.log(index2)
  if (index2 == 0 || index2 == 4 || index2 == 8 || index2 == 12) {
    v = 0.8;
  } else {
    v = 0.2; //velocity
  }
  index2 = index2 % 16;
}, (100 * 4) / 60);
//clock2.blockTime.value = 512
//------------------------------------------------------------------------------------
var kickSeq = new Tone.Sequence( ///////////////   KICK DRUM   ///////////////////////
  (time, bellek) => {
    kick.triggerAttackRelease("C4", "32n", time, 1);
  },
  kickPatterns,
  "8n"
);

var hhSeq = new Tone.Sequence( /////////////////HI-HAT /////////////////////////////
  (time, hhPattern) => {
    hh.triggerAttackRelease("C3", "32n", time, v); // velocity
  },
  hhPattern,
  "16n"
);

//------------------------------------------------------------------------
var r1 = 500;
var r2 = 500;
var a1 = 0;
var a2 = 0;
var a1Inc;
var a2Inc;
var prevX;
var prevY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(0);

  r1 = random(150, 210);
  r2 = random(150, 210);

  a1Inc = random(0.1, 5);
  a2Inc = random(0.1, 1);
  console.log(r1 + "  " + r2);
  console.log(a1Inc + "  " + a2Inc);

  scale = Tonal.Scale.get("C4 major").notes;
  // put these to setup function instead of initialisation function,
  //so that  if  I click screen to initialise it again , it doesn't create synths again
  track = new Track(0, "8n", "8n", 0, 0.7); //base sequence
  track2 = new Track(6, "16n", "4n.", 3, 0.3); // melody
  track3 = new Track(-7, "1n", "1n", 0, 1); // bass
  track4 = new Track(7, "8n", "8n", 1, 0.25); // melody 2
}

//------------------------------------------------------------------------

//-------------------------------Initialization---------------------------------------------
function initializeAudio() {
  let hhRev = new R(1.5, 0.02, 0.15);
  let bRev = new R(2, 0.01, 0.1);
  let tekRev = new R(2, 0.1, 0.1);
  let melRev = new R(2, 0.001, 0.3);
  let kickRev = new R(0.1, 0.01, 0.0);
  let arpRev = new R(2, 0.001, 0.4);
  
  this.durationLoop2 = new Tone.Loop((time)=> {
    let p1 = ["4n.","8n", "16n","8n","4n."]
    let p2 = random(p1);
    if (p2 == "8n"){track2.pattern.interval = "8n"}
    else if(p2 == "16n") {track2.pattern.interval = "16n"}
    else if(p2 == "4n.") {track2.pattern.interval = "4n."}
   
  }, "4m").start("+20m");

   this.durationLoop4 = new Tone.Loop((time)=> {
    let p1 = ["8n", "16n","8t","8n","8n"]
    let p2 = random(p1);
    if (p2 == "8n"){track4.pattern.interval = "8n"}
    else if(p2 == "16n") {track4.pattern.interval = "16n"}
    else if(p2 == "8t") {track4.pattern.interval = "8t"}
   
  }, "8m").start("+4m");

  this.loop = new Tone.Loop( ////////////////randomlar ve  aralarındaki  süre
    (time) => {
      let options = [mixup, rotateLeft, rotateRight];
      let choice = random(options);

      choice();
    },
    "2m" //2 measures
  ).start("+4m");

  hhSeq.start("+2m");
  clock2.start("+1m");
  clock.start("+2m");
  kickSeq.start("+1m");

  kick.chain(kickGain, kickRev.reverb, Tone.Destination);
  hh.chain(hhGain, hhPan, hhRev.reverb, Tone.Destination);

  track4.synthGain.chain(tekPan, arpRev.reverb, Tone.Destination);
  track3.synthGain.chain(Tone.Destination);
  track2.synthGain.chain(solPan, arpRev.reverb, Tone.Destination);
  track.synthGain.chain(melRev.reverb, Tone.Destination);

  track4.pattern.start("+1m");
  track3.pattern.start();
  track2.pattern.start("+4m");
  track.pattern.start("+7m");

  Tone.Transport.bpm.value = commonBPM;
  Tone.Transport.start();

  Tone.Master.volume.value = masterVolume;
}

function stopAll() {
  Tone.Transport.stop();
  clock2.stop();
  clock.stop();
  hhSeq.stop();
  kickSeq.stop();
  track3.pattern.stop();
  track2.pattern.stop();
  track.pattern.stop();
  //pattern.stop();
  loop.stop();
}
//------------------------------------------------------------------------
function windowResized() {
  resizeCanvas(windowsWidth, windowsHeight);
}

function text1() {
  noStroke();
  fill(255);
  textAlign(LEFT, BOTTOM);
  textSize(25);
  push();
  for (let i = 0; i < sequence.length; i++) {
    text(sequence[i], 20, 40);
    translate(30, 0);
  }
  pop();
}
//------------------------------------------------------------------------
function draw() {
  if (ready) {
    //visual stuff here

    translate(width / 2, height / 2);
    for (let i = 0; i < 500; i++) {
      var x1 = r1 * cos(a1);
      var y1 = r1 * sin(a1);

      var x2 = x1 + r2 * cos(a2);
      var y2 = y1 + r2 * sin(a2);
      let red = floor(random(0, 255));
      var r = map(sin(frameCount), -1, 1, 0, 0);
      var g = map(cos(frameCount), -1, 1, 80, 0);
      var b = map(sin(frameCount), -1, 1, 0, 0);

      stroke(p1(r), p2(g), p1(b));

      line(prevX, prevY, x2, y2);

      prevX = x2;
      prevY = y2;

      a1 += a1Inc;
      a2 += a2Inc;
    }
  } else {
    //console.log("1")
    background(0);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text("click to start", width / 2, height / 2);
  }
}

function mapNote(noteNumber, scale) {
  let numNotes = scale.length;
  let i = modulo(noteNumber, numNotes);
  let note = scale[i];
  let zeroOctave = Tonal.Note.octave(scale[0]);
  let noteOctave = zeroOctave + floor(noteNumber / numNotes);
  let noteName = Tonal.Note.pitchClass(note);
  return noteName + noteOctave;
}

function modulo(noteNumber, numNotes) {
  return ((noteNumber % numNotes) + numNotes) % numNotes;
}
//------------------------------------------------------------------------
function mousePressed() {
  if (!ready) {
    //do all audio stuff here
    ready = true;
    background(0);
    initializeAudio();
  } else {
    stopAll();
    background(0);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text("click to start", width / 2, height / 2);
    ready = false;
  }
}

class Track {
  constructor(
    tranpose = 0,
    noteDuration = "8n",
    tempo = "8n",
    patternType = 0,
    gain = 1
  ) {
    this.level = gain;
    this.synthGain = new Tone.Gain(this.level);
    this.tranpose = tranpose;
    this.patternLine = ["up", "down", "upDown", "downUp", "alternateUp"];
    this.noteDuration = noteDuration;
    this.tempo = tempo;
    this.synth = new Tone.Synth();
    this.synth.chain(this.synthGain);

    this.pattern = new Tone.Pattern(
      (time, index) => {
        let note = mapNote(sequence[index] + this.tranpose, scale);
        this.synth.triggerAttackRelease(note, noteDuration, time);
        this.currentNote = note;
      },
      Array.from(sequence.keys()),
      this.patternLine[patternType]
    );
    this.pattern.interval = this.tempo;
    this.pattern;
    this.currentNote;
  }
}
//---------------------------------------------------------------------------
function mixup() {
  shuffle(sequence, true); // modify srquence in place
}
function rotateLeft(params) {
  sequence = Tonal.Collection.rotate(1, sequence);
}
function rotateRight(params) {
  sequence = Tonal.Collection.rotate(-1, sequence);
}
function invert() {
  for (let i = 0; i < sequence.length; i++) {
    sequence[i] = scale.length - sequence[i];
  }
}
function mutate() {
  let i = floor(random(sequence.length));
  if (random(1) < 0.5) sequence[i]++;
  else sequence[i]--;
}

function p1(input) {
  ////////////////////////////////////////////////// %90 ///////////////////////
  let = input = input;
  let p1 = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  let p2 = random(p1);
  if (p2 == 1) {
    return input;
  } else {
    return null;
  }
}
function p2(input) {
  //////////////////////////////////////////////// %80 ///////////////////////
  let = input = input;
  let p1 = [0, 1, 1, 1, 1];
  let p2 = random(p1);
  if (p2 == 1) {
    return input;
  } else {
    return null;
  }
}
function p3(input) {
  ////////////////////////////////////////////// %60 ///////////////////////
  let = input = input;
  let p1 = [0, 1, 1, 1, 0];
  let p2 = random(p1);
  if (p2 == 1) {
    return input;
  } else {
    return null;
  }
}
function p4(input) {
  /////////////////////////////////////////// %30 ///////////////////////
  let = input = input;
  let p1 = [0, 1, 0];
  let p2 = random(p1);
  if (p2 == 1) {
    return input;
  } else {
    return null;
  }
}

class R {
  ////////////////////////gerek yok gibi görünüyor ama var/ bunu silme buradan ////////////
  constructor(decay = 0, preDelay = 0, wet = 0) {
    this.decay = decay;
    this.preDelay = preDelay;
    this.wet = wet;
    this.reverb = new Tone.Reverb({
      decay: decay,
      preDelay: preDelay,
      wet: wet,
      channelCount: 2,
    });
    this.reverb;
  }
}
