import React from "react";
import Column from "./Column";
import Note from "./Note";
import $ from "jquery";

class Stage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      songUrl: "https://www.dl.dropboxusercontent.com/s/x0fu4c23xtonypi/MARUTSUKE.mp3?dl=0",
      allCtx: {},
      allColumns: {},
      loading: true,
      score: 0,
      misses: 0,
      timeLog: {1: [], 2: [], 3: [], 4: []} //hold colNums and array of times recorded
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
      this.handleKey(e.keyCode, "keydown");
      // console.log(e.keyCode);
    });
    document.addEventListener("keyup", (e) => {
      this.handleKey(e.keyCode, "keyup");
    })
    window.audioPlayer = document.getElementById("audio-player");
    window.audioPlayer.load();
    window.audioPlayer.volume = 0.4;
  }

  trackTime(colNum) {
    let newLog = Object.assign({}, this.state.timeLog);
    newLog[colNum].push(window.audioPlayer.currentTime);
    this.setState({ timeLog: newLog });
  }

  handleKey(key, type) {
    if (type === "keyup") {
      if (key === 72) {
        $("#button-container-1").removeClass("pressed");
        $("#key-1").removeClass("pressed");
        return;
      } else if (key === 74) {
        $("#button-container-2").removeClass("pressed");
        $("#key-2").removeClass("pressed");
        return;
      } else if (key === 75) {
        $("#button-container-3").removeClass("pressed");
        $("#key-3").removeClass("pressed");
        return;
      } else if (key === 76) {
        $("#button-container-4").removeClass("pressed");
        $("#key-4").removeClass("pressed");
        return;
      }
    }
    switch (key) {
      case 72: 
        console.log("H"); // col 1
        $("#button-container-1").addClass("pressed");
        $("#key-1").addClass("pressed");
        this.trackTime(1);
        break;
      case 74:
        console.log("J"); // col 2
        $("#button-container-2").addClass("pressed");
        $("#key-2").addClass("pressed");
        this.trackTime(2);
        break;
      case 75:
        console.log("K"); // col 3
        $("#button-container-3").addClass("pressed");
        $("#key-3").addClass("pressed");
        this.trackTime(3);
        break;
      case 76: 
        console.log("L"); // col 4
        $("#button-container-4").addClass("pressed");
        $("#key-4").addClass("pressed");
        this.trackTime(4);
        break;
      case 32: //SPACEBAR
        if (type === "keydown") {
          if (window.audioPlayer.paused) {
            this.playColumns();
          } else if (window.audioPlayer.src && !window.audioPlayer.paused) {
            this.pauseColumns();
          }
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

      allColumns[colNum] = new Column(ctx, colNum, this.notifyMiss.bind(this));
    });
    this.setState({ allCtx, allColumns });
  }

  playColumns() {
    window.audioPlayer.play();
    Object.values(this.state.allColumns).forEach(col => {
      col.playColumn();
    });
    this.setState({ playing: true });
  }

  pauseColumns() {
    window.audioPlayer.pause();
    Object.values(this.state.allColumns).forEach(col => {
      col.pauseColumn();
    });
    this.setState({ playing: false });
    console.log(this.state);
  }

  checkScore() {

  }

  notifyMiss() {
    let missCount = this.state.misses;
    this.setState({ misses: missCount + 1 });
  }

  render() {
    return (
      <div className="stage-main">
        <div className="stage-curtain"></div>
        <audio id="audio-player" src={this.state.songUrl}></audio>
        {
          this.state.loading && Object.keys(this.state.allCtx).length > 0 ? (
            null
          ) : (
            <div className = "all-columns">
              <div className="column-container column-1">
                <canvas id="column-1" width="93.75" height="500" />
                <div className="button-container" id="button-container-1">
                  <div className="button-key-binding" id="key-1"><span id="key-span-1">H</span></div>
                  <img className="button" src={ process.env.PUBLIC_URL + '/images/haru.jpg' } />
                </div>
              </div>
              <div className="column-container column-2">
                <canvas id="column-2" width="93.75" height="500" />
                <div className="button-container" id="button-container-2">
                    <div className="button-key-binding" id="key-2"><span id="key-span-2">J</span></div>
                  <img className="button" src={process.env.PUBLIC_URL + '/images/ueno.jpg'} />
                </div>
              </div>
              <div className="column-container column-3">
                <canvas id="column-3" width="93.75" height="500" />
                <div className="button-container" id="button-container-3">
                  <div className="button-key-binding" id="key-3"><span id="key-span-3">K</span></div>
                  <img className="button" src={process.env.PUBLIC_URL + '/images/mafu.jpg'} />
                </div>
              </div>
              <div className="column-container column-4">
                <canvas id="column-4" width="93.75" height="500" />
                <div className="button-container" id="button-container-4">
                    <div className="button-key-binding" id="key-4"><span id="key-span-4">L</span></div>
                  <img className="button" src={process.env.PUBLIC_URL + '/images/aki.jpg'} />
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }


}

export default Stage;