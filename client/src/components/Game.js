import React from "react";
import Stage from "./Stage";
import $ from "jquery";

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      started: false, 
      stageNum: null,
      loading: true,
      instructonsShowing: false
    };
  }

  componentDidMount() {
    this.restart();
    this.setState({loading: false});
  }

  restart() {
    this.setState({
      started: false, 
      stageNum: null, 
    });
  }

  componentDidUpdate() {
    // const width = window.innerWidth || document.documentElement.clientWidth ||
    //   document.body.clientWidth;
    // const height = window.innerHeight || document.documentElement.clientHeight ||
    //   document.body.clientHeight;
  }


  setStage(stageNum) {
    this.setState({ stageNum, started: true });
  }

  getStage() {
    if (!this.state.started) return null;
    let songName;
    if (this.state.stageNum === 1) {
      songName = "marutsuke";
    } else if (this.state.stageNum === 2) {
      songName = "fuyu no hanashi";
    } else if (this.state.stageNum === 3) {
      songName = "kizuato";
    }
    return (
      <Stage
        stageNum={this.state.stageNum}
        songName={songName}
        notifyGameEnded={this.notifyGameEnded.bind(this)}
      />
    )
  }

  notifyGameEnded() {
    this.restart();
  }

  handleInfoModule(action) {
    switch(action) {
      case "INFO BUTTON":
        if (!this.state.infoShowing) {
          this.setState({ infoShowing: true });
          $(".info-modal").css("display", "flex");
          // $(".info-modal").css("z-index", 0);
          // $(".stage-select-container").animate({ opacity: 0 }, 300);
          $(".fa-times-circle").css("z-index", 3);
          setTimeout(() => $(".info-modal").animate({ opacity: 1 }, 300));
          break;
        } else {
          this.setState({ infoShowing: false });
          $(".info-modal").animate({ opacity: 0 }, 300);
          setTimeout(() => $(".info-modal").css("display", "none"), 300);
          return;
        }
      case "EXIT BUTTON":
        this.setState({ infoShowing: false });
        $(".info-modal").animate({ opacity: 0 }, 300);
        setTimeout(() => $(".info-modal").css("display", "none"), 300);
        // $(".stage-select-container").animate({opacity: 1}, 300);
        break;
      case "BOX":
        break;
    }
  }

  render() {

    let stageSelectContent = this.state.instructonsShowing ? (
      <div className="stage-select-container">
        <div className="how-to-play">
          <div className="how-to-button" onClick={() => this.setState({ instructonsShowing: false })}>
            Back to Select <i className="fas fa-chevron-right"></i>
          </div>
          <h3>How to Play</h3>
          <ul>
            <li>Choose one of the three songs on the select screen to start.</li>
            <li>When a music note reaches the bottom of a column, activate the matching button.</li>
            <li>Aim for a higher score by accurately timing your plays!</li>
          </ul>
        </div>
      </div>
    ) : (
      <div className="stage-select-container">
        <div className="how-to-button" onClick={() => this.setState({ instructonsShowing: true })}>
          How to Play <i className="fas fa-chevron-right"></i>
        </div>
        <div className="stage-select-page-title">
          <img src={process.env.PUBLIC_URL + '/images/guitar1.png'} />
          <h1>YUKI'S GUITAR</h1>
        </div>

        <div className="stage-select">
          <h2>SELECT STAGE</h2>
          <ul className="stage-select-list">
            <li key="song-1" onClick={() => this.setStage(1)}><i className="fas fa-play"></i>Marutsuke - <span> Easy</span></li>
            <li key="song-2" onClick={() => this.setStage(2)}><i className="fas fa-play"></i>Fuyu no Hanashi - <span> Medium</span></li>
            <li key="song-3" onClick={() => this.setStage(3)}><i className="fas fa-play"></i>Kizuato - <span> Hard</span></li>
          </ul>
        </div>
      </div>
    );

    if (!this.state.stageNum) {
      return (
        <div className="stage-select-main">
          <div className="stage-select-page-container">
            <div className="info-modal">
              <div className="info-module-container" onClick={() => this.handleInfoModule("BOX")}>
                <div className="info-pic-name">
                  <img className="info-module-pic" 
                    src={process.env.PUBLIC_URL + '/images/me.jpg'}>
                  </img>
                  <div className="info-name-links">
                    <div>Alex Lee</div>
                    <a href="https://github.com/alex629lee"><i class="fab fa-github"></i> Github</a>
                    <a href="https://www.linkedin.com/in/alex-lee-b09a7310a/"><i class="fab fa-linkedin"></i> LinkedIn</a>
                    <a href="https://github.com/alex629lee/YukisGuitar"><i class="fab fa-github-square"></i> Git Repo</a>
                  </div>
                </div>
                <img className="info-module-given-pic"
                  src={process.env.PUBLIC_URL + '/images/given-transparent.png'}>
                </img>
              </div>
            </div>

            {this.state.infoShowing ? (
              <i className="fas fa-times-circle" 
                onClick={() => this.handleInfoModule("EXIT BUTTON")}>
              </i>
            ) : (
              <i className="fas fa-info-circle" onClick={() => {
                this.handleInfoModule("INFO BUTTON")
              }}></i>
            )}

            { stageSelectContent }
          </div>
        </div>
      )
    }
    return (
      <div className="game-main">
        {this.getStage()}
      </div>
    )
  }
}

export default Game;