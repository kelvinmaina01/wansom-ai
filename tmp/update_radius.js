import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePaths = [
  path.resolve(__dirname, '../components/DocumentInsights.tsx'),
  path.resolve(__dirname, '../components/Files.tsx')
];

for (const filePath of filePaths) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/rounded-2xl/g, 'rounded-[15px]');
    content = content.replace(/rounded-xl/g, 'rounded-[15px]');
    content = content.replace(/rounded-\[2rem\]/g, 'rounded-[15px]');
    content = content.replace(/rounded-\[2.5rem\]/g, 'rounded-[15px]');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}
