/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var activeArtist = 'Chats Domino';
var activeDate = '1948';
//var video = document.getElementById("myVideo");


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.
    socket.emit('answer', "Greetings, its me, Chats Domino!"); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "What is your name?"); // Wait a moment and respond with a question.
  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Hello ' + input + ' :-)'; // output response
    waitTime = 5000;
    question = 'Would you like to hear me sing?'; // load next question
  } else if (questionNum == 1) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      socket.emit('toggleMute');
      answer = 'Great, I just cranked up the volume!';
      waitTime = 5000;
      question = 'Where are you from?';
    } else if (input.toLowerCase() === 'no' || input === 0) {
      answer = ''
      question = 'Too bad. Would you prefer a different genre?';
      waitTime = 0;
      questionNum = 3; // Go to a new question now
    } else {
      question = 'Would you like to hear me sing?'; // load next question
      answer = 'I did not understand you. Could you please answer "yes" or "no"?';
      questionNum--;
      waitTime = 5000;
    }
  } else if (questionNum == 2) {
    answer = 'Cool! I played a concert in ' + input + ' back in ' + activeDate + '.';
    waitTime = 5000;
    question = 'Do you want to keep listening?'; // load next question
  } else if (questionNum == 3) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'Great, let\'s jam for a little bit!';
      waitTime = 20000;
      question = 'Want to keep listening?';
      questionNum--;
    } else if (input.toLowerCase() === 'no' || input === 0) {
      answer = 'you said no';
      waitTime = 0;
      answer = 'I have nothing more to say! Here is my friend Chat Benatar '; // output response
      socket.emit('endVid');
      question='';
    } else {
      answer = 'you said no';
      questionNum = 5;
      waitTime = 5000;
    }
  } else if (questionNum == 4) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      console.log('ChangeVid');
      socket.emit('changeVid');
      if(activeArtist == 'Chat Stevens'){
        activeArtist = 'Chats Domino';
        activeDate = '1948';
      } else if(activeArtist == 'Chats Domino'){
        activeArtist = 'Chat Stevens';
        activeDate = '1974';
      }
      answer = 'Hey I am ' + activeArtist +'!!';
      waitTime = 5000;
      question = 'Would you like to hear me sing?';
      questionNum = 0;
    } else if (input.toLowerCase() === 'no' || input === 0) {

    } else {
    }
  } else {
    answer = 'I have nothing more to say! Here is my friend Chat Benatar '; // output response
    socket.emit('endVid');
    waitTime = 0;
    question = '';
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
