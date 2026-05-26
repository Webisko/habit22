import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/text-sm\b/g, 'text-base');
content = content.replace(/text-xs\b/g, 'text-sm');
content = content.replace(/text-\[10px\]/g, 'text-xs');

fs.writeFileSync('src/App.tsx', content);
