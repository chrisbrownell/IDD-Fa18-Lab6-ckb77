# ChatBot

*A lab report by Chris Brownell*

## In this Report

Update (1pm on 10/16): 

I was able to push from the pi to this repository. The files that I updated are:

- [chatServer.js](https://github.com/chrisbrownell/IDD-Fa18-Lab6-ckb77/blob/master/chatServer.js)
- [public/js/index.js](https://github.com/chrisbrownell/IDD-Fa18-Lab6-ckb77/blob/master/public/js/index.js)
- [public/css/style.css](https://github.com/chrisbrownell/IDD-Fa18-Lab6-ckb77/blob/master/public/css/style.css)
- [public/index.html](https://github.com/chrisbrownell/IDD-Fa18-Lab6-ckb77/blob/master/public/index.html)

I also added 3 net new video assets for use in my chat bot:

- Video of Chats Domino - [public/fatstrim.mp4](https://github.com/chrisbrownell/IDD-Fa18-Lab6-ckb77/blob/master/public/fatstrim.mp4)
- Video of Chat Stevens - [public/cattrim.mp4](https://github.com/chrisbrownell/IDD-Fa18-Lab6-ckb77/blob/master/public/cattrim.mp4)
- Video of Chat Benatar - [public/pattrim.mp4](https://github.com/chrisbrownell/IDD-Fa18-Lab6-ckb77/blob/master/public/pattrim.mp4)

## Make the ChatBot your own

**Describe what changes you made to the baseline chatbot here. Don't forget to push your modified code to this repository.**

I added background video to the webpage and allow the user to toggle between *Chats Domino* and *Chat Stevens*. They can un-mute the video to listen to the music, and have a bit of banter with the chat bot. Then at the end once the user has told the bot to stop performing, the bot forwards the user on to its friend *Chat Benatar* for a short snippet of an acoustic version of "Love is a Battlefield".

The only change to index.html was to include the three videos referenced above as background videos that autoplayed.

```
<!-- Fats video -->
<video autoplay muted loop id="fatsVideo">
  <source src="fatstrim.mp4" type="video/mp4">
</video>
<!-- Cat video -->
<video autoplay muted loop id="catVideo">
  <source src="cattrim.mp4" type="video/mp4">
</video>
<!-- Pat video -->
<video autoplay muted loop id="patVideo">
  <source src="pattrim.mp4" type="video/mp4">
</video>
```

In style.css, I added styling for the three videos, including the z-index so that I could control which video the user can see in the browser:

```
#fatsVideo {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    z-index: -1;
}

#catVideo {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    z-index: -2;
}

#patVideo {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    z-index: -2;
```

Changes to index.js include the addition of new functions that I can use to mute and unmute the videos and control the z-index of each, thereby promoting a video from "hidden" to "live".

New global variables:

```
var video = document.getElementById("fatsVideo");
var video2 = document.getElementById("catVideo");
var endVideo = document.getElementById("patVideo");
var liveVideo = video;
```

New functions:
```
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
```

Changes to chatServer.js include the new workflows that call the new functions in index.js:

```
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
```



## Record someone trying out your ChatBot

**Using a phone or other video device, record someone trying out your ChatBot. Upload that video to this repository and link to it here!**

[Video of chatbot](https://drive.google.com/file/d/1zfwCOhx62c9xSiYyoHiGGQU1grxZUQ2c/view?usp=sharing)

---
Starter code by [David Goedicke](mailto:da.goedicke@gmail.com), closely based on work by [Nikolas Martelaro](mailto:nmartelaro@gmail.com) and [Captain Anonymous](https://codepen.io/anon/pen/PEVYXz), who forked original work by [Ian Tairea](https://codepen.io/mrtairea/pen/yJapwv).
