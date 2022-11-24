console.log('sketch loaded');

// Change Values for line 4, 5, 6
// max upper bound == 26 (D above staff), inclusive
// min lower bound == 0 (middle C), inclusive
var notesUpperBound = 24;
var notesLowerBound = 0;
var numNotes = 6;
var showNoteStems = false;

//
var showBounds = false;
//
const chromatics = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
const staffPosition = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
const ledgerlineAbove = 12;
const ledgerlineBelow = 0;

// STAFF
const staffLines = 5;
const staffStartingX = 10;
const staffStartingY = 100;
const lineSpacing = 30;
// const staffHeight = 30;

// NOTES -- should be staff position relative
const notePosX = 100;
const notePosY = 60;
const noteWidth = 35;
const noteHeight = 20;
const noteRotation = -0.3; // radian
const noteHorizontalSpace = noteWidth * 1.1;
const leftPadding = 150;
//
const stemHeight = 55;
//
const sharpWidth = 20;
const sharpHeight = 20;

var note1, staff, sharp;
var notes = []; //intialize the notes array

//
function setup() {
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log('setup called');
  createCanvas(800, 400);
  // background(220);

  //STAFF
  staff = new Staff(staffStartingX, staffStartingY, lineSpacing, 780);
  staff.display();

  //NOTE
  //   notes[0] = new Note(notePosX, notePosY, noteWidth, noteHeight, noteRotation, 1, 'black');

  //   notes[0].display();

  // center c's
  generateNotes(
    notesLowerBound,
    notesUpperBound,
    staffStartingX,
    staffStartingY
  );
  // bounds
  // clef
  clef = new Clef( staffStartingX, staffStartingY, 0, 0);
  clef.display();
}

function draw() {}

class Note {
  constructor(x, y, w, h, rotation, stroke, fill, sharp, ledgerline) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rot = rotation;
    this.fill = fill;
    this.sharp = sharp;
    this.ledgerline = ledgerline;
    // console.log("note x: " + this.x + " - " + this.y);
  }

  display() {

    strokeWeight(1);
    fill(this.fill);
    push();
    //
    translate(this.x, this.y);
    ellipseMode(CENTER);
    rotate(this.rot);
    ellipse(0, 0, this.w, this.h);
    pop();

    if(!showNoteStems) return;
    // STEM
    let stemX = this.x - (cos(this.rot) * this.w) / 2;
    let stemY = this.y - 2 - (sin(this.rot) * this.w) / 2;
    //
    strokeWeight(2);

    line(stemX, stemY, stemX, stemY + stemHeight);
    //
    // console.log("x: " + this.x + " - y:" + this.y);
  }
}

let _img;

class Clef {
  constructor(_clefStartingX, _clefStartingY, _width, _height) {
    this.x = _clefStartingX;
    this.y = _clefStartingY;
    this.width = _width;
    this.height = _height;
    this.clef = loadImage('Treble_Clef.svg', () => {
      image(this.clef, this.x-10, this.y-52, 140, 230);
    });
  }
  
  display() {
    
  }
}

//draws staff lines
class Staff {
  constructor(_staffStartingX, _staffStartingY, _lineSpacing, _width) {
    this.x = _staffStartingX;
    this.y = _staffStartingY;
    this.lineSpacing = _lineSpacing;
    this.width = _width;
  }

  display() {
    push();
    if (showBounds) {
      this.bounds();
    }
    for (var i = 0; i < staffLines; i++) {
      // console.log("staff" + this.y);
      strokeWeight(1);
      line(
        this.x,
        this.y + i * this.lineSpacing,
        this.x + this.width,
        this.y + i * this.lineSpacing
      );
    }
    pop();
  }

  bounds() {
    fill("rgba(200, 0, 0, 0.4)");
    rectMode(CORNERS);
    strokeWeight(0);
    rect(this.x, this.y, this.x + this.width, this.y + 5 * this.lineSpacing);
  }
}

class LedgerLine {
  constructor(posX, posY, displayState) {
    this.x = posX;
    this.y = posY;
    this.state = displayState;
  }

  display() {
    if (!this.state) return;
    strokeWeight(3);
    strokeCap(ROUND);
    line(this.x - 25, this.y, this.x + 25, this.y);
  }
}

class Sharp {
  constructor(posX, posY, displayState) {
    this.x = posX;
    this.y = posY;
    this.state = displayState;
  }

  display() {
    if (!this.state) return;
    if (showBounds) {
      this.bounds();
    }

    strokeWeight(2.5);
    strokeCap(SQUARE);
    line(this.x - 13.5, this.y - 4, this.x + 13.5, this.y - 6);
    line(this.x - 14, this.y + 7, this.x + 13.5, this.y + 5);
    line(this.x - 5, this.y - 13.5, this.x - 5, this.y + 14);
    line(this.x + 5, this.y - 14, this.x + 5, this.y + 13.5);
  }

  bounds() {
    fill("rgba(200, 0, 0, 0.4)");
    rectMode(CORNERS);
    strokeWeight(0);
    rect(this.x - 14, this.y - 14, this.x + 14, this.y + 14);
  }
}

class Slur {
  constructor(firstNote, lastNote) {
    //console.log("Slur: ")
    //console.log(lastNote);
    console.log(firstNote.x, firstNote.y, lastNote.x, lastNote.y);
    this.start = firstNote;
    this.end = lastNote;
  }

  display() {
    stroke(0);
    noFill();
    bezier(
      this.start.x,
      this.start.y - 10,
      this.start.x,
      0,
      this.end.x,
      0,
      this.end.x,
      this.end.y
    );
  }
}

// generateNotes upperBounds ARE inclusive
function generateNotes(lowerBounds, upperBounds, staffStartX, staffStartY) {
  console.log("bounds", lowerBounds, upperBounds);
  
  for (let i = 0; i < numNotes; i++) {
    let val = floor(random(upperBounds - lowerBounds + 1)) + lowerBounds;
    // console.log('val: ' + val);
    let posX = i * 90 + leftPadding + staffStartingX;
    // algorithm for notes from middle c

    console.log("val: " + val);
    console.log("octave: " + floor(val / 12));
    // check chromatic?
    let chromatic = false;
    console.log("chromatic? :" + chromatics[val % 12]);
    if (chromatics[val % 12] === 1) {
      console.log("should be chromatic");
      chromatic = true;
      val = val - 1;
    }

    // adjust posY
    let octave = floor(val / 12);
    console.log("staff position: " + staffPosition[val % 12]);

    adjustVal = octave * 7 + staffPosition[val % 12];
    console.log("adjustval:" + adjustVal);

    let posY = staffStartingY + lineSpacing * 5 - (adjustVal * lineSpacing) / 2;

    console.log("posY: " + posY);

    // let posY = val * lineSpacing/2 + staffStartingY;
    let newNote = new Note(
      posX,
      posY,
      noteWidth,
      noteHeight,
      noteRotation,
      1,
      "black"
    );
    notes.push(newNote);
    newNote.display();
    if (chromatic) {
      sharp = new Sharp(posX - 40, posY, true);
      sharp.display();
    }
    // above staff
    if (ledgerlineAbove <= adjustVal && octave > 0) {
      //if odd val
      if (adjustVal % 2 != 0) {
        adjustVal -= 1;
      }
      while (adjustVal >= ledgerlineAbove) {
        let adjPosY =
          staffStartingY + lineSpacing * 5 - (adjustVal * lineSpacing) / 2;
        let newLedge = new LedgerLine(posX, adjPosY, true);
        console.log("ledger line");
        newLedge.display();
        adjustVal -= 2;
      }
    }

    // below staff
    if (ledgerlineBelow >= adjustVal && octave == 0) {
      //if odd val
      if (adjustVal % 2 != 0) {
        adjustVal -= 1;
      }
      while (adjustVal >= ledgerlineBelow) {
        let adjPosY =
          staffStartingY + lineSpacing * 5 - (adjustVal * lineSpacing) / 2;
        let newLedge = new LedgerLine(posX, adjPosY, true);
        console.log("ledger line");
        newLedge.display();
        adjustVal -= 2;
      }
    }
  }
  console.log("-------");
  let newSlur = new Slur(notes[0], notes[notes.length - 1]);
  //newSlur.display();
}
