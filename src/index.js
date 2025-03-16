const iframeElement = document.querySelector('iframe');
const linkTextZone = document.querySelector('textarea');
const nextButton = document.getElementById('nextButton');
const previousButton = document.getElementById('previousButton');
const videoTabs = document.getElementById('videoTabs');
const videoButtons = document.getElementsByClassName('videoTitles');

let currentIndex = 0;
let currentVideoId = "";
let linksArray = [];


//EVENT LISTENERS ----------------------------------------------------------------------------------------------
linkTextZone.addEventListener('input', function() {
    let textZoneContent = linkTextZone.value; 
    linksArray = textZoneContent.split(/\r?\n/).filter(Boolean);
    for (let i = 0; i < linksArray.length; i++) {
        let match = linksArray[i].match(/(?:youtube\.com\/(?:[^\/]+\/.*|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (match) {
            linksArray[i] = match[1]; 
        }
    }
    console.log(linksArray);
    updateVideoDisplay();
    populateVideoTabs();
});


//FUNCTIONS ----------------------------------------------------------------------------------------------------
function updateVideoDisplay(){
    currentVideoId = linksArray[currentIndex];
    iframeElement.src = `https://www.youtube.com/embed/${currentVideoId}`
}
async function getVideoJson(videoId){
    let url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    let response = await fetch(url);
    let data = await response.json(); 
    return data;
}

async function populateVideoTabs() {
    videoTabs.innerHTML = '';

    for (let i = 0; i < linksArray.length; i++) {
        const newDiv = document.createElement('button');
        newDiv.setAttribute('class', 'videoTitles');
        newDiv.setAttribute('onclick', `setCurrentIndex(${i})`);
        
        let data = await getVideoJson(linksArray[i]);

        newDiv.textContent = data.title;

        videoTabs.appendChild(newDiv);
    }
}

function setCurrentIndex(id){
    currentIndex = id;
    updateVideoDisplay();
}