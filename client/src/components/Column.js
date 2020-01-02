import Note from "./Note";
import CONSTANTS from "../util/constants";
const COLUMN_OPTIONS = CONSTANTS.COLUMN_OPTIONS;

// All notes in column are same color 
// Only need start time and whether game is playing (ability to pause)
export default class Column {

  constructor(ctx, colNum) {
    this.ctx = ctx;
    this.colNum = colNum;
    this.color = COLUMN_OPTIONS[colNum].COLOR;
    this.dimensions = {
      width: ctx.canvas.width,
      height: ctx.canvas.height
    }
    this.running = true;
    this.started = false;
    this.playing = false;
    this.allNotes = [];
    this.animate(ctx)
  }

  animate(ctx) {
    if (!this.started) {
      this.preloadNotes(ctx);
    } else if (this.playing){
      this.playColumn();
    }
    if (!this.requestedAnimation) {
      this.requestedAnimation = () => requestAnimationFrame(this.animate.bind(this));
    }
  }

  pauseColumn() {
    console.log("PAUSE COLUMN");
    cancelAnimationFrame(this.requestedAnimation);
    this.requestedAnimation = () => requestAnimationFrame(this.animate.bind(this));
    this.playing = false;
    this.running = false;
  }

  playColumn() {
    console.log("PLAY COLUMN");
    requestAnimationFrame(this.requestedAnimation);
    this.playNotes();
    this.playing = true;
    this.running = true;
  }

  preloadNotes(ctx) {
    let allNotes = [];
    let testNotes = [
      1000
    ]; // want to setTimeout to these numbers of ms
    testNotes.forEach(ms => {
      let newNote = new Note(this.color);
      allNotes.push(newNote);
    });
    this.requestedAnimation = () => requestAnimationFrame(this.animate.bind(this));
    this.allNotes = allNotes;
    this.started = true;
    this.animate(ctx);
  }

  playNotes() {
    this.allNotes.forEach(note => {
      note.animate(this.ctx);
    });
    this.playing = true;
  }
}
