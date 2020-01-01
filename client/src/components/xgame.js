import Stage from "./xstage.js";

export default class Game {

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.dimensions = { width: canvas.width, height: canvas.height }

    this.animate = this.animate.bind(this);
    this.registerEvents();
  }

  play() {
    this.running = true;
    this.animate();
  }

  restart() {
    this.running = false;
    this.score = 0;
    this.stage = new Stage(this.dimensions);
    this.animate();
  }

  registerEvents() {
    this.boundClickHandler = this.click.bind(this);
    this.ctx.canvas.addEventListener("mousedown", this.boundClickHandler);
    this.keypressHandler = this.keypress.bind(this);
    window.addEventListener("keydown", this.keypressHandler);

    this.restart();
  }

  click(e) {
    if (!this.running) {
      this.play();
    } else {
      this.restart();
    }
  }

  keypress(e) {
    let keyTranslate = {
      37: "left", 38: "up", 39: "right", 40: "down"
    }

    console.log(keyTranslate[e.keyCode]);
  }




  animate() {
    this.stage.animate(this.ctx);
    this.drawScore();

    if (this.running) {
      requestAnimationFrame(this.animate.bind(this));
    }
  }


  drawScore() {
    // const location = { x: this.dimensions.width / 2, y: this.dimensions.height / 4 }
    const location = { x: 340, y: 40 }
    this.ctx.font = "bold 30pt helvetica";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(this.score, location.x, location.y);
    // this.ctx.strokeStyle = "black";
    // this.ctx.lineWidth = 2;
    // this.ctx.strokeText(this.score, location.x, location.y);
  }

}

