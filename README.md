# Yuki's Guitar
**Yuki's Guitar** is a rhythm game similar to *Guitar Hero*, where players earn points by accurately pressing keys to the timing of the game prompts and music. 

The game was inspired by the anime/manga series _**Given**_, and includes three songs from the anime as playable stages.

*Yuki's Guitar was created in one week for App Academy's Javascript curriculum.*

![Full1](/client/public/images/full1.png?raw=true)

This project uses Javascript for game logic, React for managing rendered components and player options (song choice, key bindings, score, etc.), and HTML/Canvas for the animated music notes.

![Full2](/client/public/images/full2.png?raw=true)

This game was designed to be responsive to different screen sizes and allow comfortable play on mobile devices.

![MobileView](/client/public/images/mobilecollage.png?raw=true)


---


## Timing and Animating Music Notes

The bulk of my difficulty for this project came from animating the music notes. 

I decided to separate the game view into four columns (*one column for each main character* ☺) and gave each column its own canvas element, color, set of timestamps, and button. Each column was responsible for rendering and animating its music notes.

Each music note needed to first be displayed at the top of its canvas, travel down its respective column, and reach the buttons at the intended moment in the song. 

To accomplish this, I set a constant rate of change for the y-coordinate of each `Note` and recorded the amount of time it takes for the music note to reach the button (3.32s), which I then used in the `Column` class. 

```javascript
// client/src/components/Column.js

playNotes() {
  let newLogs = [...this.timeLogs];
  let newNotes = [...this.allNotes];
  let notesReady = false;

  while (!notesReady) {
    if (window.audioPlayer.currentTime + 3.32 >= newLogs[0]) {
      newNotes.push(new Note(this.color, this));
      newLogs.shift();
    } else {
      notesReady = true;
    }
  }
  this.timeLogs = newLogs;
  this.allNotes = newNotes;
  this.allNotes.forEach(note => {
    note.animate(this.ctx); 
  });
}
```

In the code snippet above, I am checking whether the music note needs to reach the bottom of the canvas within 3.32 seconds of the current time in the song. If so, the `Note` is initialized and saved in `this.allNotes`, and that note's timestamp is removed from `this.timeLogs`. Then, all of the music notes currently in saved in `this.allNotes` are animated.

## Scoring Player Actions

When a player activates a button to play a music note, I needed to check that note's position (to calculate the amount of points awarded) and then remove that `Note` from the game. This is a long process that starts at the `Stage` component (on `keydown`/`touchStart`) and involves that button's associated `Column` and `Note` objects. 

```javascript
// client/src/components/Stage.js

handleKey(key, type) {
  if (!this.state.keyCodes.includes(key)) return null;
  if (type === "keydown") {
    if (key === this.state.keyCodes[0]) {
      $("#button-container-1").addClass("pressed"); 
      this.playSound();
      // Change button styling and play drum hi-hat sound to show player the button is being activated :)

      this.checkScore(1); 
      this.trackTime(1);
      // Invoked with the column number
    }
  }
}

checkScore(colNum) {
  let column = this.state.columns[colNum];
  let note = column.allNotes[0]; 
  // The first in this array is the note with the lowest position on that column's canvas (closest to button) 
  let positionY = note.y; 
  let pointsEarned = this.state.score.totalPoints;
  if (positionY >= 580 && positionY <= 620) {
    // Notify the column object to remove the played note 
    column.removeNote(colNotes[0]);
    // (Stuff to add "perfect" play to the score in the state and flash a message on screen using jQuery...)
  } 
}
```

```javascript 
// client/src/components/Column.js

  removeNote(rmNote) {
    if (this.allNotes[0] === rmNote) {
      this.allNotes.shift();
    }
    this.ctx.clearRect(rmNote.x, rmNote.y, rmNote.dimensions.width, rmNote.dimensions.height);
    // Erase music note from the column's canvas
  }
```

If a player fails to activate the button on a music note ("missed" play) and the note travels out of bounds, the alert process instead travels in the opposite direction, starting from the `Note` object up to the `Stage` component. 

```javascript 
// client/src/components/Note.js

checkPos() {
  if (this.outOfBounds()) { 
    // If the note's y-coordinate is greater than 700:
    this.parentColumn.removeMissedNote(this);
  } 
}
```

---

## Future Directions
* Add difficulty selection with greater number of buttons for hard mode.
* Display combos during game and award more points for a higher streak of perfect plays.
* Have Eli set the timing of music notes because I'm rhythmically challenged...

---

## Technologies/Libraries Used
1. Javascript 
2. HTML (with Canvas)
3. CSS
4. React
5. JQuery
6. MIDISoundsReact

Possible challenges include timing the game prompts to correctly fall into position at the correct time and matching the prompts and player responses with the stage music.


---

## MVP
1. Players respond to the prompts either by pressing arrow keys or by tapping/clicking the gamepad buttons (mobile).
1. Predetermined song(s) and keys used to calculate accuracy of player responses.
1. Timing of key-presses are scored on a scale ("perfect", "good", "bad", "miss") with differing amounts of points awarded. 
1. **Bonus:** Multiple stages with different songs; Selecting difficulty level


## Wireframes 

![Wireframe](/client/public/images/wireframe.png?raw=true)

