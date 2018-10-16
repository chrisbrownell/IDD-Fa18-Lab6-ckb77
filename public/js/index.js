// WebSocket connection setup
var socket = io();
var questionRecieved = false;
var video = document.getElementById("fatsVideo");
var video2 = document.getElementById("catVideo");
var endVideo = document.getElementById("patVideo");
var liveVideo = video;

// Get the button
var btn = document.getElementById("myBtn");
// keep count of question, used for IF condition.
var output = document.getElementById('output'); // store id="output" in output variable
output.innerHTML = "<h1 id=response> </h1>"; // ouput first question

// Pause and play the video, and change the button text
function muteVideo() {
    if (liveVideo.muted) {
        liveVideo.muted=false;
        btn.innerHTML = "Mute";
    } else {
        liveVideo.muted=true;
        btn.innerHTML = "Unmute";
    }
}

function sendMessage() {
  var input = document.getElementById("input").value;
  socket.emit('message', input);
  document.getElementById("input").value = "";
  document.getElementById("input").style.display = "none";
}

//push enter key (using jquery), to run bot function.
$(document).keypress(function(e) {
  if (e.which == 13 && questionRecieved === true) {
    questionRecieved = false;
    sendMessage(); // run bot function when enter key pressed
  }
});

function changeText(input) {
  document.getElementById('response').textContent = input;
}

socket.on('answer', function(msg) {
  console.log('Incomming answer:', msg);
  changeText(msg);
});
socket.on('question', function(msg) {
  console.log('Incomming Question:', msg);
  questionRecieved = true;
  document.getElementById("input").style.display = "block";
  changeText(msg);
});

socket.on('changeVid', function() {
  console.log('Changeing Video');
  liveVideo.style.zIndex = -2;
  if(liveVideo == video) {
    liveVideo = video2;
  } else {
    liveVideo = video;
  }
  liveVideo.style.zIndex = -1;
});

socket.on('muteVid', function() {
    liveVideo.muted = true;
});

socket.on('unmuteVid', function() {
    liveVideo.muted = false;
});

socket.on('toggleMute', function() {
  if(liveVideo.muted == true) {
    liveVideo.muted = false;
  } else {
    liveVideo.muted = true;
  }
});

socket.on('endVid', function() {
    liveVideo.muted = true;
    liveVideo.style.zIndex = -2;
    endVideo.style.zIndex = -1;
    endVideo.muted = false;
});

socket.on('muteVid', function(msg) {
  console.log('Changeing Font to:', msg);
  var h1 = document.getElementById('response');
  h1.style.color = 'white';
});

socket.on('connect', function() { // We let the server know that we are up and running also from the client side;
  socket.emit('loaded');
  document.getElementById("input").style.display = "none"; // Here we wait for the first question to appear
});
