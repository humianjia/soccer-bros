const fs = require('fs');
const path = require('path');

const basePath = 'f:\\DATA\\MyWorkspace\\h5game\\soccer bros';
const folders = ['Action', 'BattleRoyale', 'FPS', 'Multiplayer', 'Sniper'];

folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.html'));

        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Check if this file needs fixing - has plain div brand-area
            if (content.includes('<div class="brand-area">')) {
                console.log('Fixing:', filePath);

                // Replace <div class="brand-area"> with <a href...>
                content = content.replace(
                    /<div class="brand-area">(\s*<div class="logo-mark">)/g,
                    '<a href="../index.html" class="brand-area" style="text-decoration: none; color: inherit; display: flex; align-items: center;">$1'
                );

                // Replace the closing </div> for brand-area - need to be careful
                // Find the pattern: </div> after brand-name span
                content = content.replace(
                    /(<\/span>\s*)<\/div>(\s*<div class="category-menu">)/g,
                    '$1</a>$2'
                );

                fs.writeFileSync(filePath, content, 'utf8');
                console.log('Fixed:', filePath);
            }
        });
    }
});

console.log('Done!');