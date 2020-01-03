import React from "react";
import Column from "./Column";
import Note from "./Note";
import $ from "jquery";
import { postLog, getLog } from "../util/api_util";
import CONSTANTS from "../util/constants";
const { SONG_URLS } = CONSTANTS; 
// import MIDISounds from 'midi-sounds-react';

class Stage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stageNum: props.stageNum,
      playing: false,
      started: false,
      songUrl: SONG_URLS[props.stageNum],
      allCtx: {},
      allColumns: {},
      loading: true,
      stageComplete: false, //
      score: {
        totalPoints: 0,
        perfect: 0,
        good: 0,
        bad: 0,
      },
      misses: 0,
      timeLog: {1: [], 2: [], 3: [], 4: []}, //hold colNums and array of times recorded
      createMode: false,
    }
    this.playSound = this.playSound.bind(this);
    this.registerEvents = this.registerEvents.bind(this);
  }

  componentDidMount() {
    this.registerEvents();
    this.setState({ playing: false, loading: false });
    $("#curtain").innerHTML = "<div className='loader'>Loading...</div>";
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
    });
    document.addEventListener("keyup", (e) => {
      this.handleKey(e.keyCode, "keyup");
    })
    window.audioPlayer = document.getElementById("audio-player");
    window.audioPlayer.load();
    window.audioPlayer.volume = 0.4;
    window.audioPlayer.addEventListener("ended", () => {
      this.setState({ stageComplete: true });
    })
  }

  trackTime(colNum) {
    let newLog = Object.assign({}, this.state.timeLog);
    newLog[colNum].push(window.audioPlayer.currentTime);
    this.setState({ timeLog: newLog });
  }

  playSound() {
    window.midiSounds.playDrumsNow([36]);
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
        // console.log("H"); // col 1
        $("#button-container-1").addClass("pressed");
        $("#key-1").addClass("pressed");
        this.checkScore(1);
        this.trackTime(1);
        this.playSound();
        break;
      case 74:
        // console.log("J"); // col 2
        $("#button-container-2").addClass("pressed");
        $("#key-2").addClass("pressed");
        this.checkScore(2);
        this.trackTime(2);
        this.playSound();
        break;
      case 75:
        // console.log("K"); // col 3
        $("#button-container-3").addClass("pressed");
        $("#key-3").addClass("pressed");
        this.checkScore(3);
        this.trackTime(3);
        this.playSound();
        break;
      case 76: 
        // console.log("L"); // col 4
        $("#button-container-4").addClass("pressed");
        $("#key-4").addClass("pressed");
        this.checkScore(4);
        this.trackTime(4);
        this.playSound();
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
      case 13: 
        if (type === "keyup" && this.state.createMode) {
          let currentLog = Object.assign({}, this.state.timeLog);
          let newLog = {};
          Object.keys(currentLog).forEach(key => {
            let newKey = `col${key}`;
            newLog[newKey] = currentLog[key];
          });
          newLog["songName"] = "marutsuke";
          newLog["songNumber"] = 1;
          postLog(newLog).then(log => console.log(log));
          break;
        }
    }
  }

  createColumns() {
    let allCtx = {};
    let allColumns = {};
    let colNums = [ 1, 2, 3, 4 ];
    colNums.forEach(colNum => {
      let id = "column-" + colNum.toString();
      let canvas = document.getElementById(id);
      let ctx = canvas.getContext("2d");
      allCtx[colNum] = ctx;
    });

    getLog(this.state.stageNum).then(log => {
      colNums.forEach(colNum => {
        let colLogs = log[`col${colNum}`];
        let ctx = allCtx[colNum];
        if (this.state.createMode) {
          colLogs = [];
        }
        allColumns[colNum] = new Column(
          ctx, colNum, this.notifyMiss.bind(this), colLogs, 
          this.notifyStarted.bind(this)
        );
      });
      this.setState({ allCtx, allColumns, logData: log });
    });
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
  }

  notifyStarted() {
    if (!this.state.started) {
      this.setState({started: true});
    }
  }

  checkScore(colNum) {
    let column = this.state.allColumns[colNum];
    let colNotes = column.allNotes;
    let note = colNotes[0];
    if (!note) return null;
    let noteY = note.y;
    let pointsEarned = this.state.score.totalPoints;
    if (!noteY) return null;
    
    if (noteY >= 580 && noteY <= 620) {
      pointsEarned += 3;
      column.removeNote(colNotes[0]);
      let perfectCount = this.state.score.perfect;
      let newScoreState = Object.assign({},this.state.score);
      newScoreState["perfect"] = perfectCount + 1;
      newScoreState["totalPoints"] = pointsEarned;
      this.setState({ score: newScoreState });
      let showScore = document.getElementById("score-playing-inner");
      showScore.innerHTML = "Perfect";
      $("#score-playing-inner").css("color", "springgreen");
      $("#score-playing-inner").animate({opacity: 1}, 200);
      setTimeout(() => {
        $("#score-playing-inner").animate({opacity: 0}, 200);
      }, 200)
    } else if (noteY >= 560 && noteY <= 640) {
      pointsEarned += 2;
      column.removeNote(colNotes[0]);
      let goodCount = this.state.score.good;
      let newScoreState = Object.assign({}, this.state.score);
      newScoreState["good"] = goodCount + 1;
      newScoreState["totalPoints"] = pointsEarned;
      this.setState({ score: newScoreState });
      let showScore = document.getElementById("score-playing-inner");
      showScore.innerHTML = "Good";
      $("#score-playing-inner").css("color", "yellow");
      $("#score-playing-inner").animate({ opacity: 1 }, 200);
      setTimeout(() => {
        $("#score-playing-inner").animate({ opacity: 0 }, 200);
      }, 200)
    } else if (noteY >= 500 && noteY <= 700 ) {
      pointsEarned += 1;
      column.removeNote(colNotes[0]);
      let badCount = this.state.score.bad;
      let newScoreState = Object.assign({}, this.state.score);
      newScoreState["bad"] = badCount + 1;
      newScoreState["totalPoints"] = pointsEarned;
      this.setState({ score: newScoreState });
      let showScore = document.getElementById("score-playing-inner");
      showScore.innerHTML = "Bad";
      $("#score-playing-inner").css("color", "blue");
      $("#score-playing-inner").animate({ opacity: 1 }, 200);
      setTimeout(() => {
        $("#score-playing-inner").animate({ opacity: 0 }, 200);
      }, 200)
    }
  }

  notifyMiss() {
    let missCount = this.state.misses;
    this.setState({ misses: missCount + 1 });
    let showScore = document.getElementById("score-playing-inner");
    showScore.innerHTML = "Miss";
    $("#score-playing-inner").css("color", "darkred");
    $("#score-playing-inner").animate({ opacity: 1 }, 200);
    setTimeout(() => {
      $("#score-playing-inner").animate({ opacity: 0 }, 200);
    }, 200)
  }

  findScore() {
    $("#stage-completed-modal").animate({opacity: 1}, 1000);

    if (!this.state.logData) return null;
    let logData = this.state.logData;
    let allLogs = [
      ...logData["col1"], ...logData["col2"], 
      ...logData["col3"], ...logData["col4"]
    ];
    let totalPossible = (allLogs.length) * 3;
    let grade;
    let numberGrade = parseInt((this.state.score.totalPoints / totalPossible) * 100); 
    if (numberGrade >= 95) {
      grade = <div className="stage-letter-grade" style={{color: "yellow"}}>S</div>;
    } else if (numberGrade >= 90) {
      grade = <div className="stage-letter-grade" style={{color: "springgreen"}}>A</div>;
    } else if (numberGrade >= 80) {
      grade = <div className="stage-letter-grade" style={{ color: "cyan" }}>B</div>;
    } else if (numberGrade >= 70) {
      grade = <div className="stage-letter-grade" style={{ color: "violet" }}>C</div>;
    } else if (numberGrade >= 60) {
      grade = <div className="stage-letter-grade" style={{ color: "blue" }}>D</div>;
    } else {
      grade = <div className="stage-letter-grade" style={{color: "darkred"}}>F</div>;
    }
    return (
      <div className="stage-completed-container">
        <h2>Stage Complete</h2>
        <div className="stage-complete-info">
          { grade }
          <div className="stage-complete-counts">
            <p><span>Perfect:</span> {this.state.score.perfect}</p>
            <p><span>Good:</span> {this.state.score.good}</p>
            <p><span>Bad:</span> {this.state.score.bad}</p>
            <p><span>Misses:</span> {this.state.misses}</p>
          </div>
        </div>
        {/* Do something with resetting and going back to home: */}
        <div onClick={() => this.setState({
          playing: false, started: false,
          songUrl: "https://www.dl.dropboxusercontent.com/s/x0fu4c23xtonypi/MARUTSUKE.mp3?dl=0",
          allCtx: {}, allColumns: {}, loading: true, stageComplete: false,
          score: { totalPoints: 0, perfect: 0, good: 0, bad: 0 },
          misses: 0, timeLog: { 1: [], 2: [], 3: [], 4: [] }, createMode: false,
        })}>EXIT</div>
      </div>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="stage-main">
          <div id="curtain" className="stage-curtain"></div>
          <audio id="audio-player" src={this.state.songUrl}></audio>
        </div>
      )
    }
    return (
      <div className="stage-main">
        {
          this.state.stageComplete ? (
            <div id="stage-completed-modal" className="stage-completed-modal">
              { this.findScore() }
            </div>
          ) : null
        }
        <div id="curtain" className="stage-curtain">
          { !this.state.started && !window.audioPlayer.paused ? (
            <div className='loader'>Loading...</div>
          ) : ( null )}
        </div>
        <div id="show-score-playing"><p id="score-playing-inner" style={{fontSize: 40}}></p></div>
        <audio id="audio-player" src={this.state.songUrl}></audio>
        {
          this.state.loading ? (
            null
          ) : (
            <div className = "all-columns">
              <div className="column-container column-1">
                <canvas id="column-1" width="93.75" height="600" />
                <div className="button-container" id="button-container-1">
                  <div className="button-key-binding" id="key-1"><span id="key-span-1">H</span></div>
                  <img className="button" src={ process.env.PUBLIC_URL + '/images/haru.jpg' } />
                </div>
              </div>
              <div className="column-container column-2">
                <canvas id="column-2" width="93.75" height="600" />
                <div className="button-container" id="button-container-2">
                    <div className="button-key-binding" id="key-2"><span id="key-span-2">J</span></div>
                  <img className="button" src={process.env.PUBLIC_URL + '/images/ueno.jpg'} />
                </div>
              </div>
              <div className="column-container column-3">
                <canvas id="column-3" width="93.75" height="600" />
                <div className="button-container" id="button-container-3">
                  <div className="button-key-binding" id="key-3"><span id="key-span-3">K</span></div>
                  <img className="button" src={process.env.PUBLIC_URL + '/images/mafu.jpg'} />
                </div>
              </div>
              <div className="column-container column-4">
                <canvas id="column-4" width="93.75" height="600" />
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