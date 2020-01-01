import React from "react";
import Stage from "./Stage";

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.restart();
  }

  restart() {
    this.setState({
      started: false, playing: false, stage: null
    });
    // this.animate();
  }

  play(stageName = "") {
    this.setState({ started: true, playing: true, stage: stageName });
  }

  getStage() {
    return (
      <Stage />
    )
  }

  render() {
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