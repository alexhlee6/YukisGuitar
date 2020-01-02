const NOTE_CONSTANTS = {
  width: 93.75,
  height: 30,
  speed: 4,
  endY: 500
}

export default class Note {
  constructor(color, column) {
    this.x = 0;
    this.y = 0;
    this.dimensions = { 
      width: NOTE_CONSTANTS.width,
      height: NOTE_CONSTANTS.height
    }
    this.color = color;
    this.endY = NOTE_CONSTANTS.endY;
    this.parentColumn = column;
  }

  animate(ctx) {
    this.moveNote(ctx);
    this.drawNote(ctx);
    this.checkPos();
  }



  checkPos() {
    if (this.outOfBounds()) {
      // console.log("OutOFBOUNDS");
      // console.log(window.audioPlayer.currentTime);
      this.parentColumn.removeMissedNote(this);
    } // else if clicked (not out of bounds) then this.parentColumn.removeNote()
    if(this.y === 500) {
      // console.log(window.audioPlayer.currentTime);
    }
  }

  moveNote(ctx) {
    ctx.clearRect(this.x, this.y, this.dimensions.width, this.dimensions.height);
    this.y = this.y + NOTE_CONSTANTS.speed;
  }

  drawNote(ctx) {
    ctx.fillStyle = this.color; //this.color
    ctx.fillRect(this.x, this.y, this.dimensions.width, this.dimensions.height);
  }

  bounds() {
    return {
      left: this.x,
      right: this.x + NOTE_CONSTANTS.width,
      top: this.y,
      bottom: this.y + NOTE_CONSTANTS.height
    }
  }

  outOfBounds() {
    const endY = 650;
    return (this.y > 600);
  }

}
