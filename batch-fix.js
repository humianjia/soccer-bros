const fs = require('fs');
const path = require('path');

const basePath = 'f:\\DATA\\MyWorkspace\\h5game\\soccer bros';
const folders = ['Action', 'BattleRoyale', 'FPS', 'Multiplayer', 'Sniper'];

const oldPattern = /<div class="brand-area" onclick="window\.location\.href='\.\.\/index\.html'" style="cursor: pointer;">/g;
const newStart = '<a href="../index.html" class="brand-area" style="text-decoration: none; color: inherit; display: flex; align-items: center;">';
const oldEnd = '</div>';
const newEnd = '</a>';

folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.html'));

        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            console.log('Processing:', filePath);

            let content = fs.readFileSync(filePath, 'utf8');

            // Replace opening tag
            content = content.replace(oldPattern, newStart);

            // Replace closing tag - but be careful not to break other </div> tags
            // We need to find the specific </div> that closes the brand-area div
            const brandAreaMatch = content.match(/<a href="\.\.\/index\.html" class="brand-area"[^>]*>[\s\S]*?<\/a>/);
            if (brandAreaMatch) {
                console.log('Found and fixed brand-area in:', file);
            } else {
                // Try alternative approach - find and replace the specific pattern
                content = content.replace(/<div class="brand-area"([^>]*)>(\s*<div class="logo-mark">[\s\S]*?<\/div>\s*<span class="brand-name">Soccer<span>Bros<\/span><\/span>\s*)<\/div>/,
                    '<a href="../index.html" class="brand-area"$1>$2</a>');
            }

            fs.writeFileSync(filePath, content, 'utf8');
        });
    }
});

console.log('Done!');