const iframeElement = document.querySelector('iframe');
const linkTextZone = document.querySelector('textarea');

linkTextZone.addEventListener('input', function() {
    let links = linkTextZone.value; 
    iframeElement.src = links
  });

