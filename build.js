// Deploy-time build script (runs on Railway during the build step).
// Extracts project.zip (the real app: frontend/ + backend/) and installs +
// builds both halves, so the runtime only has to run `node app/backend/src/server.js`.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd, cwd) {
  console.log(`> (${cwd}) ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

if (!fs.existsSync('app')) {
  const AdmZip = require('adm-zip');
  console.log('Extracting project.zip...');
  const zip = new AdmZip('project.zip');
  zip.extractAllTo('app', true);
}

run('npm install --omit=dev', path.join('app', 'backend'));
run('npm install', path.join('app', 'frontend'));
run('npm run build', path.join('app', 'frontend'));

console.log('Build finished.');
