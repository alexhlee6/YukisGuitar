import React from "react";
import Column from "./Column";

class Stage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      // allColumns: []
      loading: true
    }
    // this.createColumns();
  }

  componentDidMount() {
    this.setState({ playing: true, score: 0, loading: false });
    this.registerEvents();
  }

  componentDidUpdate() {
    if (!this.state.loading && document.getElementById("column-1")) {
      this.drawColumns();
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
    }
  }

  drawColumns() {
    let allCtx = {};
    let ids = [1, 2, 3, 4];
    ids.forEach(id => {
      let canvas = document.getElementById(id);
      
    })
  }

  animate(ctx) {

  }

  render() {
    return (
      <div className="stage-main">
        <div className="stage-curtain"></div>
        {
          this.state.loading ? (
            null
          ) : (
            <div className = "all-columns">
              <div className="column-container column-1">
                <canvas id="column-1" width="93.75" height="500" />
                <img className="baby" src={ process.env.PUBLIC_URL + '/images/haru.jpg' } />
              </div>
              <div className="column-container column-2">
                <canvas id="column-2" width="93.75" height="500" />
                <img className="baby" src={process.env.PUBLIC_URL + '/images/ueno.jpg'} />
              </div>
              <div className="column-container column-3">
                <canvas id="column-3" width="93.75" height="500" />
                <img className="baby" src={process.env.PUBLIC_URL + '/images/mafu.jpg'} />
              </div>
              <div className="column-container column-4">
                <canvas id="column-4" width="93.75" height="500" />
                <img className="baby" src={process.env.PUBLIC_URL + '/images/aki.jpg'} />
              </div>
            </div>
          )
        }
      </div>
    )
  }


}

export default Stage;