const iframeElement = document.querySelector('iframe');
const linkTextZone = document.querySelector('textarea');
const nextButton = document.getElementById('nextButton');
const previousButton = document.getElementById('previousButton');
const videoTabs = document.getElementById('videoTabs');
const videoButtons = document.getElementsByClassName('videoTitles');
const seekbar = document.getElementById('seekbar');

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
    for (let i = 0; i < linksArray.length; i++) {
        let match = linksArray[i].match(/(?:youtube\.com\/(?:[^\/]+\/.*|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (match) {
            linksArray[i] = match[1]; 
        }
    }
    console.log(linksArray);

    videoTabs.innerHTML = '';

    for (let i = 0; i < linksArray.length; i++) {
        const newDiv = document.createElement('button');
        newDiv.setAttribute('class', 'videoTitles');
        newDiv.setAttribute('onclick', `setCurrentIndex(${i})`);
        let data = await getVideoJson(linksArray[i]);
        newDiv.textContent = data.title;
        videoTabs.appendChild(newDiv);

        console.log(linksArray);
    }
}

function setCurrentIndex(index){
    player.loadVideoById(linksArray[index],
        0);
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

