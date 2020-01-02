import React from "react";
import Column from "./Column";
import Note from "./Note";

class Stage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      // started: false,
      allCtx: {},
      allColumns: {},
      loading: true
    }
  }

  componentDidMount() {
    this.registerEvents();
    this.setState({ playing: false, score: 0, loading: false });
  }

  componentDidUpdate() {
    let allCtxVals = Object.values(this.state.allCtx);
    if (!this.state.loading && allCtxVals.length === 0) {
      this.createColumns();
    } 
  }

  registerEvents() {
    document.addEventListener("keydown", (e) => {
      this.handleKey(e.keyCode);
    })
  }

  handleKey(key) {
    switch (key) {
      case 65: 
        console.log("A"); // col 1
        break;
      case 83:
        console.log("S"); // col 2
        break;
      case 68:
        console.log("D"); // col 3
        break;
      case 70: 
        console.log("F"); // col 4
        break;
      case 32: //SPACEBAR
        if (!this.state.playing) {
          this.playColumns();
        } else if (this.state.playing) {
          this.pauseColumns();
        }
        break;
    }
  }

  createColumns() {
    let allCtx = {};
    let allColumns = {};

    let colNums = [1, 2, 3, 4];
    colNums.forEach(colNum => {
      let id = "column-" + colNum.toString();
      let canvas = document.getElementById(id);
      let ctx = canvas.getContext("2d");
      allCtx[colNum] = ctx;

      allColumns[colNum] = new Column(ctx, colNum);
    });
    this.setState({ allCtx, allColumns });
  }

  playColumns() {
    Object.values(this.state.allColumns).forEach(col => {
      col.playColumn();
    });
    this.setState({ playing: true });
  }

  pauseColumns() {
    Object.values(this.state.allColumns).forEach(col => {
      col.pauseColumn();
    });
    this.setState({ playing: false });
  }

  render() {
    return (
      <div className="stage-main">
        <div className="stage-curtain"></div>
        {
          this.state.loading && Object.keys(this.state.allCtx).length > 0 ? (
            null
          ) : (
            <div className = "all-columns">
              <div className="column-container column-1">
                <canvas id="column-1" width="93.75" height="500" />
                <img className="button" src={ process.env.PUBLIC_URL + '/images/haru.jpg' } />
              </div>
              <div className="column-container column-2">
                <canvas id="column-2" width="93.75" height="500" />
                <img className="button" src={process.env.PUBLIC_URL + '/images/ueno.jpg'} />
              </div>
              <div className="column-container column-3">
                <canvas id="column-3" width="93.75" height="500" />
                <img className="button" src={process.env.PUBLIC_URL + '/images/mafu.jpg'} />
              </div>
              <div className="column-container column-4">
                <canvas id="column-4" width="93.75" height="500" />
                <img className="button" src={process.env.PUBLIC_URL + '/images/aki.jpg'} />
              </div>
            </div>
          )
        }
      </div>
    )
  }


}

export default Stage;