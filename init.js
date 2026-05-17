function loadMainGame() {
    if (gamesData && gamesData.length > 0) {
        const firstGame = gamesData[0];
        const iframe = document.getElementById('game-iframe');

        if (iframe && firstGame.iframeUrl) {
            iframe.src = firstGame.iframeUrl;
        }
    }
}

function getGameBadge(game) {
    const type = (game && (game.gameType || game.category || '')).toLowerCase();
    if (type.includes('fps')) return 'Shoot';
    if (type.includes('battle')) return 'Clash';
    if (type.includes('multiplayer')) return 'Match';
    if (type.includes('sniper')) return 'Aim';
    if (type.includes('action')) return 'Speed';
    if (type.includes('soccer') || type.includes('sport')) return 'Score';
    return 'Match';
}

function getGameAccent(game) {
    const type = (game && (game.gameType || game.category || '')).toLowerCase();
    if (type.includes('fps')) return 'FPS';
    if (type.includes('battle')) return 'Battle';
    if (type.includes('multiplayer')) return 'Team';
    if (type.includes('sniper')) return 'Focus';
    if (type.includes('action')) return 'Rush';
    if (type.includes('soccer') || type.includes('sport')) return 'Goal';
    return 'Play';
}

function toggleFullscreen() {
    const iframe = document.getElementById('game-iframe');
    if (!iframe) return;

    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function setupSectionReveal() {
    const sections = document.querySelectorAll('.featured-games, .game-info-section');
    if (!sections.length) return;

    const reveal = (el, index) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.transitionDelay = `${Math.min(index * 100, 400)}ms`;
    };

    if (!('IntersectionObserver' in window)) {
        sections.forEach(reveal);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const index = Array.from(sections).indexOf(entry.target);
            reveal(entry.target, index);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.18 });

    sections.forEach((section) => observer.observe(section));
}

function loadRelatedGames() {
    const container = document.getElementById('related-games-container');
    if (!container) return;

    const allGames = [
        ...(window.gamesData || []),
        ...(window.actionGames || []),
        ...(window.battleRoyaleData || []),
        ...(window.fpsData || []),
        ...(window.multiplayerGames || []),
        ...(window.sniperData || [])
    ];

    if (allGames.length === 0) return;

    const currentPath = window.location.pathname || window.location.href;
    const normalizedPath = currentPath.replace(/\\/g, '/');
    const isSubDirectory = normalizedPath.includes('/Action/') ||
        normalizedPath.includes('/BattleRoyale/') ||
        normalizedPath.includes('/FPS/') ||
        normalizedPath.includes('/Multiplayer/') ||
        normalizedPath.includes('/Sniper/');
    const imgPrefix = isSubDirectory ? '../' : '';

    const shuffledGames = shuffleArray(allGames).slice(0, 21);
    container.innerHTML = '';

    shuffledGames.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'game-item';
        card.setAttribute('data-game', game.id);
        const imageUrl = imgPrefix + game.imageUrl;
        card.innerHTML = `
            <span class="game-item-badge">${getGameBadge(game)}</span>
            <span class="game-item-accent">${getGameAccent(game)}</span>
            <img src="${imageUrl}" alt="${game.name}" onerror="this.src='${imgPrefix}img/icon/veckIo.jpg'">
            <div class="game-item-title">${game.name}</div>
        `;
        card.addEventListener('click', function() {
            loadGameById(game.id);
        });
        card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        card.style.transitionDelay = `${Math.min(index * 60, 360)}ms`;
        container.appendChild(card);
        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    });
}

function loadGameById(gameId) {
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

    if (game.link) {
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

document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname || window.location.href;
    const normalizedPath = currentPath.replace(/\\/g, '/');
    const isSubDirectory = normalizedPath.includes('/Action/') ||
        normalizedPath.includes('/BattleRoyale/') ||
        normalizedPath.includes('/FPS/') ||
        normalizedPath.includes('/Multiplayer/') ||
        normalizedPath.includes('/Sniper/');

    if (!isSubDirectory) {
        loadMainGame();
    }

    loadRelatedGames();
    setupSectionReveal();
});
