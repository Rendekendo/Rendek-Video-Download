var fs = require('fs');
const { ipcRenderer } = require('electron');

const linkTextZone = document.querySelector('textarea');
const videoTabs = document.getElementById('videoTabs');
const seekbar = document.getElementById('seekbar');
const downloadAllButton = document.getElementById('downloadAllButton');

let linksArray = [];
let currentVideoDuration = 0.0;
let currentVideoTime = 0.0;


populateVideoTabs();


//EVENT LISTENERS ----------------------------------------------------------------------------------------------
linkTextZone.addEventListener('input', function() {
    populateVideoTabs();
});
seekbar.addEventListener('input', function() {
    updateVideoCurrentTime();
});
downloadAllButton.addEventListener('click', function() {
    donwloadVideo();
});

//FUNCTIONS ----------------------------------------------------------------------------------------------------
async function getVideoJson(videoId){
    let url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    let response = await fetch(url);
    let data = await response.json(); 
    return data;
}

async function populateVideoTabs() {
    let textZoneContent = linkTextZone.value; 
    linksArray = textZoneContent.split(/\r?\n/).filter(Boolean);

    const youtubeRegex = /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.*|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11}))/;

    // Loop through the links and extract the video ID
    for (let i = 0; i < linksArray.length; i++) {
        let match = linksArray[i].match(youtubeRegex);
        if (match) {
            linksArray[i] = match[1]; 
        }
    }

    videoTabs.innerHTML = ''; 

    for (let i = 0; i < linksArray.length; i++) {
        const newDiv = document.createElement('button');
        newDiv.setAttribute('class', 'videoTitles');
        newDiv.setAttribute('onclick', `setCurrentIndex(${i})`);
        newDiv.setAttribute('index', `${i}`);
        let data = await getVideoJson(linksArray[i]);
        newDiv.textContent = data.title;
        videoTabs.appendChild(newDiv);
    }
}

function setCurrentIndex(index){
    player.loadVideoById(linksArray[index],
        0);
    document.querySelectorAll('.videoTitles').forEach(button => {
        button.style.backgroundColor = ''; 
    });
    document.querySelector(`.videoTitles[index="${index}"]`).style.backgroundColor = 'var(--accent-color)';
}
function updateSeekbar(){
    currentVideoTime = player.getCurrentTime();
    seekbar.value = (currentVideoTime / currentVideoDuration) * 100;
}
function updateVideoCurrentTime(){
    let seekTo = (currentVideoDuration / 100) * seekbar.value;
    console.log(seekbar.value);
    player.seekTo(seekTo, true);
}
function donwloadVideo(){
    ipcRenderer.send('download-all', linksArray);
}

// YOUTUBE API --------------------------------------------------------------------------
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '450',
    width: '800',
    videoId: `${linksArray[0]}`,
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        currentVideoDuration = event.target.getDuration();
      }
    setInterval(updateSeekbar, 500);
}

