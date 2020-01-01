import CONSTANTS from "../util/constants";

export default class Column {

  constructor(dimensions, options) {
    this.options = options;
    this.dimensions = dimensions;
  }

  animate(ctx) {
    if (!this.ctx) {
      this.ctx = ctx;
    }
    this.createColumn(this.ctx);
  }

  createColumn(ctx) {
    let startY = 0;
    let startX = (this.options.NUM - 1) * 93.75;
    let height = 600;
    let width = 93.75;
    ctx.fillStyle = this.options.BACKGROUND_COLOR;
    ctx.fillRect(startX, startY, width, height);
    this.createButton(ctx);
    ctx.closePath();
  }

  createButton(ctx) {
    let radius = 40;
    let pos = this.options.POS;
    this.target = pos;

    let img = new Image();
    img.src = this.options.IMAGE_PATH;
    let drawImage = function () {
      console.log(img.src);
      // debugger;
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], radius, 0, 2 * Math.PI, true);
      ctx.clip();
      ctx.closePath();
      ctx.drawImage(img, pos[0] - 40, pos[1] - 40, 90, 90);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fill();
      ctx.save();
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
    };
    img.onload = drawImage;
    console.log(ctx.globalCompositeOperation);
  }


}