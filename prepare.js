const fs = require('fs'), path = require('path');
fs.mkdirSync('www', { recursive: true });
fs.copyFileSync('app.html', path.join('www', 'index.html'));
const src = ['dist/jsnes.min.js', 'dist/jsnes.js'].map(p => path.join('node_modules', 'jsnes', p)).find(fs.existsSync);
if (src) fs.copyFileSync(src, path.join('www', 'jsnes.min.js'));
else console.warn('jsnes not found, NES playback will be unavailable');
