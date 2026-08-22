const https = require('https');
const fs = require('fs');

const url = 'https://player.vimeo.com/progressive_redirect/playback/1041691481/rendition/1080p/file.mp4?loc=external&signature=d0ebf2a4565f824ddb4590c7b5f848e981c6f887f27c904221d3654797bd56f9';

function download(dest) {
  const file = fs.createWriteStream(dest);
  function fetch(u) {
    https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        console.log('Redirecting to CDN...');
        fetch(res.headers.location);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => { });
        console.error('Error status:', res.statusCode);
        return;
      }
      console.log('Downloading Aroma full restaurant & food video, size:', res.headers['content-length']);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download complete for full restaurant video!');
      });
    }).on('error', e => console.error(e.message));
  }
  fetch(url);
}

download('public/restaurant-hero.mp4');
