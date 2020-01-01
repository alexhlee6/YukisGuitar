import React from 'react';
import Game from "./components/Game";

const App = () =>  {
  return (
    <div className="App">
      {/* <h1>Given</h1> */}
      <div class="stage-background">
        <Game />
        {/* <canvas id="game-canvas" width="375" height="600"></canvas> */}
      </div>
      {/* <img id="akihiko" src="../images/aki.jpg" />
      <img id="haruki" src="../images/haru.jpg" />
      <img id="mafuyu" src="../images/mafu.jpg" />
      <img id="uenoyama" src="../images/ueno.jpg" /> */}
    </div>
  );
}

// document.addEventListener("DOMContentLoaded", () => {
//   const canvas = document.getElementById('game-canvas');
//   new Game(canvas);
// })


export default App;
