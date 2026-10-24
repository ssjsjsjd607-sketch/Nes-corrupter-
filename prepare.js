const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const required = ['icon.png', 'splash.png'];

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('Created assets/ directory');
}

for (const file of required) {
  const filePath = path.join(assetsDir, file);
  if (!fs.existsSync(filePath)) {
    // Create a 1x1 transparent PNG placeholder so Capacitor doesn't crash
    const placeholder = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(filePath, placeholder);
    console.log(`Created placeholder: ${file}`);
  }
}
