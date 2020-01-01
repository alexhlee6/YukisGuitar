import Column from "./xcolumn";
import CONSTANTS from "../util/constants";
const COLUMN_OPTIONS = CONSTANTS.COLUMN_OPTIONS;


export default class Stage {

  constructor(dimensions, running, options = {}) {
    this.dimensions = dimensions;
    this.allColumns = [];
    this.createColumns(dimensions);
    this.running = running;
  }

  animate(ctx) {
    this.allColumns.forEach(col => {
      col.animate(ctx);
    });
    // if (this.running){
    //   requestAnimationFrame(this.animate.bind(this));
    // }
  }

  createColumns(dimensions) {
    let [LEFT, UP, DOWN, RIGHT] = Object.values(COLUMN_OPTIONS);
    [LEFT, UP, DOWN, RIGHT].forEach(colOptions => {
      this.allColumns.push(new Column(dimensions, colOptions))
    });
  }



}