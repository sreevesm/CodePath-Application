// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var sixBoxesGame = false;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var triesRemaining = 3;

function setPattern(max){
  for (let i = 0; i < 8; i++){
    pattern[i] = Math.floor(Math.random() * ((max+1) - 1) + 1);
  }
}

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    triesRemaining = 3;
  if (sixBoxesGame == true){
    setPattern(6); //set pattern for harder game (6 boxes)
  }
  else{
    console.log("resetting");
    document.getElementById("button5").classList.add("hidden");
    document.getElementById("button6").classList.add("hidden");
    setPattern(4); //set pattern for regular game (4 boxes)
  }
  console.log(pattern);
  // swap the Start and Stop buttons
document.getElementById("startBtn").classList.add("hidden");
document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  sixBoxesGame = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    if (clueHoldTime > 800){
      clueHoldTime -= 30;
    }
    delay += clueHoldTime; 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Congratulations. You won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn){
    // guess is correct
    if(guessCounter == progress){
      // turn is over
      if(progress == pattern.length-1){
        // last turn
        winGame();
      }
      else{
        progress++;
        playClueSequence();
      }
    }
    else{
      // turn is not over
      guessCounter++;
    }
  }
  else{
    // guess is incorrect
    if (triesRemaining >= 1){
      triesRemaining--;
      alert("Your guess is incorrect: you have " + triesRemaining + " guess left");
      guessCounter = 0;
    }
    else{
      loseGame();
    }
  }
}

function sixBoxes(){
  //initialize game variables for harder level
    sixBoxesGame = true;
document.getElementById("button5").classList.remove("hidden");
document.getElementById("button6").classList.remove("hidden");
  startGame();
}


// Sound Synthesis Functions
const freqMap = {
  1: 200,
  2: 280,
  3: 340,
  4: 400,
  5: 480,
  6: 520
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)