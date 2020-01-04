import React from "react";
import Stage from "./Stage";
import $ from "jquery";

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      started: false, 
      stageNum: null,
      loading: true
    };
  }

  componentDidMount() {
    this.restart();
    this.setState({loading: false});
    let bodyh = document.body.clientHeight;
    let windowh = window.innerHeight;

    // $(window).on('resize', () => {
    //   let bodyh = document.body.clientHeight;
    //   $("html").height(bodyh + "px");
    //   $("body").height(bodyh + "px");
    //   $(".column-container").height(document.body.clientHeight + 'px');
    //   $('.stage-select-main').height(document.body.clientHeight + 'px');
    //   $(".stage-select-page-container").height(document.body.clientHeight + 'px');
    // });

    // const width = window.innerWidth || document.documentElement.clientWidth ||
    //   document.body.clientWidth;
    // const height = window.innerHeight || document.documentElement.clientHeight ||
    //   document.body.clientHeight;

    // window.onresize = () => {
      // $("html").height(bodyh + "px");
      // $("body").height(bodyh + "px");
      // $(".column-container").height(document.body.clientHeight + 'px');
      // $('.stage-select-main').height(document.body.clientHeight + 'px');
      // $(".stage-select-page-container").height(document.body.clientHeight + 'px');
    // }
    
    // $("html").height(window.innerHeight + "px");
    // $("body").height(window.innerHeight + "px");
  }

  restart() {
    this.setState({
      started: false, 
      stageNum: null, 
    });
  }

  componentDidUpdate() {
    if (window.audioPlayer) {
      // let viewportHeight = 
      $(".column-container").height(document.body.clientHeight + 'px');
    }
    if (!this.state.started && !this.state.loading) {
      $('.stage-select-main').height(document.body.clientHeight + 'px');
      $(".stage-select-page-container").height(document.body.clientHeight + 'px');
    }
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
                  <li key="song-1" onClick={() => this.setStage(1)}><i className="fas fa-play"></i>Marutsuke</li>
                  <li key="song-2" onClick={() => this.setStage(2)}><i className="fas fa-play"></i>Fuyu no Hanashi</li>
                  <li key="song-3" onClick={() => this.setStage(3)}><i className="fas fa-play"></i>Kizuato</li>
                </ul>
              </div>
            </div>
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