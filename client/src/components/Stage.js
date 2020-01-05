import React from "react";
import Column from "./Column";
import $ from "jquery";
import { postLog, getLog } from "../util/api_util";
import CONSTANTS from "../util/constants";
const { SONG_URLS } = CONSTANTS; 

class Stage extends React.Component {
  constructor(props) {
    super(props);
    this.notifyGameEnded = props.notifyGameEnded;
    this.state = {
      songName: props.songName,
      stageNum: props.stageNum,
      playing: false,
      starting: true,
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
      muted: false,
      misses: 0,
      timeLog: {1: [], 2: [], 3: [], 4: []}, //hold colNums and array of times recorded
      createMode: false,
    }
    this.playSound = this.playSound.bind(this);
    this.registerEvents = this.registerEvents.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
  }

  componentDidMount() {
    this.keydownEvent = (e) => {
      this.handleKey(e.keyCode, "keydown");
    }
    this.keyupEvent = (e) => {
      this.handleKey(e.keyCode, "keyup");
    }
    this.registerEvents();
    this.setState({ playing: false, loading: false });
    $("#curtain").innerHTML = "<div className='loader'>Loading...</div>";
    $(".column-container").height(window.innerHeight + 'px');
  }

  componentDidUpdate() {
    let allCtxVals = Object.values(this.state.allCtx);
    if (!this.state.loading && allCtxVals.length === 0) {
      this.createColumns();
    } 
  }

  componentWillUnmount() {
    this.detachEvents();
  }

  detachEvents() {
    document.removeEventListener("keydown", this.keydownEvent);
    document.removeEventListener("keyup", this.keyupEvent);
    let oldElement = document.getElementById("audio-player");
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
  }

  registerEvents() {
    window.midiSounds.setMasterVolume(0.8);
    document.addEventListener("keydown", this.keydownEvent);
    document.addEventListener("keyup", this.keyupEvent);
    window.audioPlayer = document.getElementById("audio-player");
    window.audioPlayer.load();
    window.audioPlayer.volume = 0.4;
    window.audioPlayer.addEventListener("ended", () => {
      this.pauseColumns();
      this.setState({ stageComplete: true });
      window.audioPlayer = null;
      $("#stage-completed-modal").animate({ opacity: 1 }, 500);
    })
  }

  setKeys(num) {
    if (num === 1) { //ASDF
      this.setState({
        starting: false,
        keyCodes: [65, 83, 68, 70],
        keys: { 1: [65, "A"], 2: [83, "S"], 3: [68, "D"], 4: [70, "F"] }
      });
    } else { //HJKL
      this.setState({
        starting: false,
        keyCodes: [72, 74, 75, 76],
        keys: { 1: [72, "H"], 2: [74, "J"], 3: [75, "K"], 4: [76, "L"] }
      });
    }
    this.playColumns();
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
    if (this.state.keys && !this.state.keyCodes.includes(key)) return null;
    if (type === "keyup") {
      if (key === 72 || key === 65) {
        $("#button-container-1").removeClass("pressed");
        $("#key-1").removeClass("pressed");
        return;
      } else if (key === 74 || key === 83) {
        $("#button-container-2").removeClass("pressed");
        $("#key-2").removeClass("pressed");
        return;
      } else if (key === 75 || key === 68) {
        $("#button-container-3").removeClass("pressed");
        $("#key-3").removeClass("pressed");
        return;
      } else if (key === 76 || key === 70) {
        $("#button-container-4").removeClass("pressed");
        $("#key-4").removeClass("pressed");
        return;
      }
    }
    if (key === 72 || key === 65) {
      $("#button-container-1").addClass("pressed");
      $("#key-1").addClass("pressed");
      this.checkScore(1);
      this.trackTime(1);
      this.playSound();
      return;
    } else if (key === 74 || key === 83) {
      $("#button-container-2").addClass("pressed");
      $("#key-2").addClass("pressed");
      this.checkScore(2);
      this.trackTime(2);
      this.playSound();
    } else if(key === 75 || key === 68) {
      $("#button-container-3").addClass("pressed");
      $("#key-3").addClass("pressed");
      this.checkScore(3);
      this.trackTime(3);
      this.playSound();
    } else if (key === 76 || key === 70) {
      $("#button-container-4").addClass("pressed");
      $("#key-4").addClass("pressed");
      this.checkScore(4);
      this.trackTime(4);
      this.playSound();
    }
    if (key === 13 && type === "keyup" && this.state.createMode) {
      let currentLog = Object.assign({}, this.state.timeLog);
      let newLog = {};
      Object.keys(currentLog).forEach(key => {
        let newKey = `col${key}`;
        newLog[newKey] = currentLog[key];
      });
      newLog["songName"] = this.state.songName;
      newLog["songNumber"] = this.state.stageNum;
      postLog(newLog).then(log => console.log(log));
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
      $("#score-playing-inner").animate({opacity: 0.5}, 200);
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
      $("#score-playing-inner").animate({ opacity: 0.5 }, 200);
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
      $("#score-playing-inner").animate({ opacity: 0.5 }, 200);
      setTimeout(() => {
        $("#score-playing-inner").animate({ opacity: 0 }, 200);
      }, 200)
    }
  }

  // handleShowScore(word, color) {
  //   let showScore = document.getElementById("score-playing-inner");
  //   showScore.innerHTML = word;
  //   $("#score-playing-inner").css("color", color);
  //   $("#score-playing-inner").animate({ opacity: 0.5 }, 200);
  // }

  notifyMiss() {
    let missCount = this.state.misses;
    let newScore = Object.assign({}, this.state.score);
    let newTotal = this.state.score.totalPoints - 3;
    if (newTotal < 0) {
      newTotal = 0;
    }
    newScore["totalPoints"] = newTotal;
    this.setState({ misses: missCount + 1, score: newScore });
    let showScore = document.getElementById("score-playing-inner");
    showScore.innerHTML = "Miss";
    $("#score-playing-inner").css("color", "darkred");
    $("#score-playing-inner").animate({ opacity: 0.5 }, 200);
    setTimeout(() => {
      $("#score-playing-inner").animate({ opacity: 0 }, 200);
    }, 200)
  }

  findScore() {
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
        <div 
          className="stage-complete-exit-button"
          onClick={() => {
            this.notifyGameEnded();
            this.setState({
              playing: false, started: false,
              songUrl: null,
              allCtx: {}, allColumns: {}, loading: true, stageComplete: false,
              score: { totalPoints: 0, perfect: 0, good: 0, bad: 0 },
              misses: 0, timeLog: { 1: [], 2: [], 3: [], 4: [] }, createMode: false,
            });
          }}><i className="fas fa-angle-left"></i>Back to Home</div>
      </div>
    );
  }

  getControls() {
    if (!window.audioPlayer) return null;
    if (this.state.starting) return null;
    if (this.state.stageComplete) return null;
    let volumeControls;
    if (this.state.muted) {
      volumeControls = (
        <i className="fas fa-volume-off" 
          onClick={() => {
            window.audioPlayer.volume = 0.4;
            this.setState({muted: false});
        }}></i>
      );
    } else if (!this.state.muted) {
      volumeControls = (
        <i className="fas fa-volume-up"
        onClick={() => {
          window.audioPlayer.volume = 0;
          this.setState({muted: true});
        }}></i>
      )
    }
    if (window.audioPlayer.paused && window.audioPlayer.duration && !this.state.playing) {
      return (
        <div className="controls-container">
          <i className="fas fa-angle-double-left"
            onClick={ () => { 
              this.pauseColumns();
              window.audioPlayer = null;
              this.detachEvents();
              this.notifyGameEnded();
            }}
          ></i>
          <i className="fas fa-play" 
            onClick={() => {
              this.playColumns()
          }}></i>
          { volumeControls }
        </div>
      )
    } else if (!window.audioPlayer.paused && this.state.playing) {
      return (
        <div className="controls-container">
          <i className="fas fa-angle-double-left"
            onClick={() => {
              this.pauseColumns();
              window.audioPlayer = null;
              this.detachEvents();
              this.notifyGameEnded();
            }}
          ></i>
          <i className="fas fa-pause"
            onClick={() => {
              this.pauseColumns()
          }}></i>
          { volumeControls }
        </div>
      )
    }
  }

  render() {
    let grade;
    if (this.state.stageComplete) {
      grade = (
        <div id="stage-completed-modal" className="stage-completed-modal">
          {this.findScore()}
        </div>
      )
    }
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
        { grade }

        {this.state.starting ? (
            <div className="start-modal click-anywhere" onClick={() => {
              this.playColumns();
              this.setState({ starting: false });
            }}>
              <div className="start-modal-click-anywhere">CLICK ANYWHERE TO START</div>
            </div>
        ) : (
            null
        )}
        {this.state.starting ? (
          <div className="start-modal key-bindings">
            <div className="select-key-bindings-container">
              <span>SELECT KEY BINDINGS</span>
              <div className="key-bindings-container">
                <div className="key-bindings-1" onClick={() => this.setKeys(1)}>
                  <span>A</span><span>S</span><span>D</span><span>F</span>
                </div>
                <div className="key-bindings-2" onClick={() => this.setKeys(2)}>
                  <span>H</span><span>J</span><span>K</span><span>L</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
            null
        )}


        { this.getControls() }

        {(this.state.started && !this.state.starting ) ? (
          <div className="score-count-module">
            <p>{ this.state.score.totalPoints }</p>
          </div>
        ) : (
          null
        )}

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
                <div className="button-container" id="button-container-1"
                  onTouchStart={() => {
                    this.handleKey(72, "keydown");
                  }}
                  onTouchEnd={() => {
                    this.handleKey(72, "keyup")
                }}>
                  <div 
                    className="button-key-binding" id="key-1">
                      {this.state.keys ? <span id="key-span-1">{this.state.keys[1][1]}</span> : null}
                  </div>
                  <img className="button" src={ process.env.PUBLIC_URL + '/images/haru.jpg' } />
                </div>
              </div>
              <div className="column-container column-2">
                <canvas id="column-2" width="93.75" height="600" />
                <div className="button-container" id="button-container-2"
                  onTouchStart={() => this.handleKey(74, "keydown")}
                  onTouchEnd={() => this.handleKey(74, "keyup")}
                >
                    <div className="button-key-binding" id="key-2">
                      {this.state.keys ? <span id="key-span-2">{this.state.keys[2][1]}</span> : null}
                    </div>
                  <img className="button" src={process.env.PUBLIC_URL + '/images/ueno.jpg'} />
                </div>
              </div>
              <div className="column-container column-3">
                <canvas id="column-3" width="93.75" height="600" />
                <div className="button-container" id="button-container-3"
                  onTouchStart={() => this.handleKey(75, "keydown")}
                  onTouchEnd={() => this.handleKey(75, "keyup")}
                >
                  <div className="button-key-binding" id="key-3">
                      {this.state.keys ? <span id="key-span-3">{this.state.keys[3][1]}</span> : null}
                  </div>
                  <img className="button" src={process.env.PUBLIC_URL + '/images/mafu.jpg'} />
                </div>
              </div>
              <div className="column-container column-4">
                <canvas id="column-4" width="93.75" height="600" />
                <div className="button-container" id="button-container-4"
                  onTouchStart={() => this.handleKey(76, "keydown")}
                  onTouchEnd={() => this.handleKey(76, "keyup")}
                >
                  <div className="button-key-binding" id="key-4">
                      {this.state.keys ? <span id="key-span-4">{this.state.keys[4][1]}</span> : null}
                  </div>
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