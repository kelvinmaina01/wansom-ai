const https = require('https');
const urls = ['https://ibb.co/kVk5nbRn', 'https://ibb.co/MkTnGGLj', 'https://ibb.co/kvHR7Yg'];

urls.forEach(url => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/<meta property="og:image" content="([^"]+)"/);
      console.log(url + ' => ' + (match ? match[1] : 'not found'));
    });
  });
});
