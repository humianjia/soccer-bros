// 加载游戏到主页 iframe
function loadMainGame() {
    if (gamesData && gamesData.length > 0) {
        const firstGame = gamesData[0];
        const iframe = document.getElementById('game-iframe');
        const title = document.getElementById('current-game-title');
        const icon = document.getElementById('game-icon');
        
        if (iframe && firstGame.iframeUrl) {
            iframe.src = firstGame.iframeUrl;
        }
        
        if (title) {
            title.textContent = firstGame.name || 'Game';
        }
        
        if (icon && firstGame.imageUrl) {
            icon.src = firstGame.imageUrl.replace('game_icon', 'icon');
            icon.onerror = function() {
                this.src = 'img/icon/veckIo.jpg';
            };
        }
    }
}

// 加载游戏（用于点击游戏卡片）
function loadGame(gameIndex) {
    if (gamesData && gamesData[gameIndex]) {
        const game = gamesData[gameIndex];
        const iframe = document.getElementById('game-iframe');
        const title = document.getElementById('current-game-title');
        const icon = document.getElementById('game-icon');
        
        if (iframe) {
            iframe.src = game.iframeUrl || '';
        }
        
        if (title) {
            title.textContent = game.name || 'Game';
        }
        
        if (icon && game.imageUrl) {
            icon.src = game.imageUrl.replace('game_icon', 'icon');
            icon.onerror = function() {
                this.src = 'img/icon/veckIo.jpg';
            };
        }
    }
}

// 全屏切换
function toggleFullscreen() {
    const iframe = document.getElementById('game-iframe');
    if (iframe) {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
        }
    }
}

// 打乱数组顺序（用于随机排序）
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 动态生成21个随机游戏卡片
function loadRelatedGames() {
    const container = document.getElementById('related-games-container');
    if (!container) return;

    // 合并所有分类的游戏数据
    const allGames = [
        ...(window.gamesData || []),
        ...(window.actionGames || []),
        ...(window.battleRoyaleData || []),
        ...(window.fpsData || []),
        ...(window.multiplayerGames || []),
        ...(window.sniperData || [])
    ];

    if (allGames.length === 0) return;

    // 判断当前页面是否在子目录中 - 使用更可靠的检测方法
    const currentPath = window.location.pathname || window.location.href;
    const normalizedPath = currentPath.replace(/\\/g, '/');
    const isSubDirectory = normalizedPath.includes('/Action/') ||
                            normalizedPath.includes('/BattleRoyale/') ||
                            normalizedPath.includes('/FPS/') ||
                            normalizedPath.includes('/Multiplayer/') ||
                            normalizedPath.includes('/Sniper/');
    const imgPrefix = isSubDirectory ? '../' : '';

    // 随机打乱游戏数据，取前21个
    const shuffledGames = shuffleArray(allGames).slice(0, 21);

    // 清空容器
    container.innerHTML = '';

    // 生成游戏卡片
    shuffledGames.forEach((game) => {
        const card = document.createElement('div');
        card.className = 'game-item';
        card.setAttribute('data-game', game.id);
        const imageUrl = imgPrefix + game.imageUrl;
        card.innerHTML = `
            <img src="${imageUrl}" alt="${game.name}" onerror="this.src='${imgPrefix}img/icon/veckIo.jpg'">
            <div class="game-item-title">${game.name}</div>
        `;
        card.addEventListener('click', function() {
            loadGameById(game.id);
        });
        container.appendChild(card);
    });
}

// 根据游戏ID跳转到游戏页面
function loadGameById(gameId) {
    // 合并所有分类的游戏数据
    const allGames = [
        ...(window.gamesData || []),
        ...(window.actionGames || []),
        ...(window.battleRoyaleData || []),
        ...(window.fpsData || []),
        ...(window.multiplayerGames || []),
        ...(window.sniperData || [])
    ];

    const game = allGames.find(g => g.id === gameId);
    if (!game) return;

    // 跳转到游戏页面
    if (game.link) {
        // 判断当前页面是否在子目录中 - 使用更可靠的检测方法
        const currentPath = window.location.pathname || window.location.href;
        const normalizedPath = currentPath.replace(/\\/g, '/');
        const isSubDirectory = normalizedPath.includes('/Action/') ||
                                normalizedPath.includes('/BattleRoyale/') ||
                                normalizedPath.includes('/FPS/') ||
                                normalizedPath.includes('/Multiplayer/') ||
                                normalizedPath.includes('/Sniper/');
        const prefix = isSubDirectory ? '../' : '';
        window.location.href = prefix + game.link;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 判断当前页面是否在子目录中
    const currentPath = window.location.pathname || window.location.href;
    const normalizedPath = currentPath.replace(/\\/g, '/');
    const isSubDirectory = normalizedPath.includes('/Action/') ||
                            normalizedPath.includes('/BattleRoyale/') ||
                            normalizedPath.includes('/FPS/') ||
                            normalizedPath.includes('/Multiplayer/') ||
                            normalizedPath.includes('/Sniper/');

    // 只在主页加载游戏iframe内容，子游戏页面已经有正确的游戏信息
    if (!isSubDirectory) {
        loadMainGame();
    }

    // 加载21个随机游戏
    loadRelatedGames();
});

// 粒子背景效果
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particle.style.width = (3 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// 鼠标跟随光效
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
    });
}