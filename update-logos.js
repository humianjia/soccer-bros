const fs = require('fs');
const path = require('path');

const basePath = 'f:\\DATA\\MyWorkspace\\h5game\\soccer bros';
const folders = ['Action', 'BattleRoyale', 'FPS', 'Multiplayer', 'Sniper'];

folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.html'));
        
        files.forEach(file => {
            if (folder === 'FPS' && file === 'Hazmob_FPS.html') {
                console.log('跳过已处理的文件:', file);
                return;
            }
            
            const filePath = path.join(folderPath, file);
            console.log('正在更新:', filePath);
            
            let content = fs.readFileSync(filePath, 'utf8');
            
            // 更新Logo添加点击跳转
            content = content.replace(
                /<div class="brand-area">/g,
                '<div class="brand-area" onclick="window.location.href=\'../index.html\'" style="cursor: pointer;">'
            );
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('已更新:', file);
        });
    }
});

console.log('所有Logo更新完成！');