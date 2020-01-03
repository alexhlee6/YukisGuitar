import React from "react";
import Stage from "./Stage";

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      started: false, playing: false, 
      stageNum: null, currentStage: null
    };
  }

  componentDidMount() {
    this.restart();
  }

  restart() {
    this.setState({
      started: false, playing: false, 
      stageNum: null, currentStage: null
    });
  }

  play(stageNum = "") {
    this.setState({ started: true, playing: true, stageNum: stageNum });
  }

  getStage() {
    return (
      <Stage stageNum={this.state.stageNum} />
    )
  }

  render() {
    if (!this.state.stageNum) {
      return (
        <div className="stage-select-main">
          <div className="stage-select-page-container">
            
            <div className="stage-select-container">
              <div className="stage-select-page-title"><img src={process.env.PUBLIC_URL + '/images/guitar1.png'} /><div>YUKI'S GUITAR</div></div>
              <div className="stage-select">
                <h2>SELECT STAGE</h2>
                <ul className="stage-select-list">
                  <li key="song-1"><i className="fas fa-play"></i>Marutsuke</li>
                  <li key="song-2"><i className="fas fa-play"></i>Fuyu no Hanashi</li>
                  <li key="song-3"><i className="fas fa-play"></i>Kizuato</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="game-main">
        { 
          this.state.started ? (
            this.getStage()
          ) : (
            null 
          )
        }

        {this.getStage()}
      </div>
    )
  }
}

export default Game;