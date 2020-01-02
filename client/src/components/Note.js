const NOTE_CONSTANTS = {
  width: 93.75,
  height: 20,
  speed: 1,
  endY: 500
}

export default class Note {
  constructor(color) {
    this.x = 0;
    this.y = 0;
    this.dimensions = { 
      width: NOTE_CONSTANTS.width,
      height: NOTE_CONSTANTS.height
    }
    this.color = color;
    this.endY = NOTE_CONSTANTS.endY;
  }

  animate(ctx) {
    this.moveNote(ctx);
    this.drawNote(ctx);
    this.checkPos();
  }



  checkPos() {
    if (this.outOfBounds()) {
      console.log("miss");
      return "miss";
    } else {
      // console.log([this.x, this.y]);
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
    return (this.y > 650);
  }

}
