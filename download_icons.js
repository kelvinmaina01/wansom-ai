import fs from 'fs';
import https from 'https';
import path from 'path';

const ICONS = [
  { name: 'gdrive.svg', slug: 'googledrive', color: '#4285F4' }, // Actually Google Drive is multi-color, but we will use the brand primary blue if simple-icons is mono
  { name: 'gsheets.svg', slug: 'googlesheets', color: '#34A853' },
  { name: 'onedrive.svg', slug: 'microsoftonedrive', color: '#0078D4' },
  { name: 'slack.svg', slug: 'slack', color: '#E01E5A' },
  { name: 'gmail.svg', slug: 'gmail', color: '#EA4335' },
  { name: 'teams.svg', slug: 'microsoftteams', color: '#6264A7' },
  { name: 'gcal.svg', slug: 'googlecalendar', color: '#4285F4' },
  { name: 'outlook.svg', slug: 'microsoftoutlook', color: '#0078D4' }
];

const DIR = path.join(process.cwd(), 'lawlify-ai', 'public', 'integrations');

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

async function downloadIcons() {
  for (const icon of ICONS) {
    const url = `https://cdn.jsdelivr.net/npm/simple-icons@10.0.0/icons/${icon.slug}.svg`;
    
    await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            // simple-icons SVG markup is like <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>...</title><path d="..."/></svg>
            // We want to add fill="color"
            const svgWithColor = data.replace('<svg ', `<svg fill="${icon.color}" `);
            fs.writeFileSync(path.join(DIR, icon.name), svgWithColor);
            console.log(`Saved ${icon.name}`);
          } else {
            console.error(`Failed to download ${icon.slug}: HTTP ${res.statusCode}`);
          }
          resolve();
        });
      }).on('error', reject);
    });
  }
}

downloadIcons();
