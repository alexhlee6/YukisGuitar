import React from 'react';
import Game from "./components/Game";
import MIDISounds from 'midi-sounds-react';

const App = () =>  {
  return (
    <div className="App">
      <div className="stage-background">
        <Game />
      </div>
      <MIDISounds id="hidden-sound-player" ref={(ref) => (window.midiSounds = ref)} appElementName="root" drums={[36]} />	
    </div>
  );
}


export default App;
