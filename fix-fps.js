const fs = require('fs');
const path = require('path');

const basePath = 'f:\\DATA\\MyWorkspace\\h5game\\soccer bros';
const folders = ['FPS'];

folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.html'));

        files.forEach(file => {
            // Skip Hazmob_FPS.html as it was manually updated
            if (file === 'Hazmob_FPS.html') {
                console.log('Skipping (manually updated):', file);
                return;
            }

            const filePath = path.join(folderPath, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Skip if already has main-layout
            if (content.includes('main-layout')) {
                console.log('Skipping (has main-layout):', file);
                return;
            }

            // Get game name from title or h1
            let gameName = file.replace('.html', '').replace(/_/g, ' ');

            // Get game icon path
            let gameIcon = `../img/icon/${folder}/${file.replace('.html', '.jpg')}`;

            // Get iframe src if exists
            let iframeSrc = '';
            const iframeMatch = content.match(/<iframe id="game-iframe" src="([^"]+)"/);
            if (iframeMatch) {
                iframeSrc = iframeMatch[1];
            }

            // Get hero title
            let heroTitle = gameName;
            const heroTitleMatch = content.match(/<h1 class="hero-title">([^<]+)<\/h1>/);
            if (heroTitleMatch) {
                heroTitle = heroTitleMatch[1];
            }

            // Get game icon from file
            const iconMatch = content.match(/<img src="([^"]+)" id="game-icon"/);
            if (iconMatch) {
                gameIcon = iconMatch[1];
            }

            // Get info banner text
            let bannerText = 'Welcome to SoccerBros.io - Play ' + heroTitle + ' and more free online games';
            const bannerMatch = content.match(/<div class="info-banner">\s*<i class="fas fa-futbol"><\/i>\s*([^<]+)<\/div>/);
            if (bannerMatch) {
                bannerText = bannerMatch[1].trim();
            }

            // Get about text
            let aboutText = heroTitle + ' is a free online game. Play now on SoccerBros.io!';
            const aboutMatch = content.match(/<h2 class="block-title">About The Game<\/h2>\s*<p>([^<]+)<\/p>/);
            if (aboutMatch) {
                aboutText = aboutMatch[1];
            }

            console.log('Creating new structure for:', file);

            // Create new content with main-layout
            const newContent = `    <main class="content-container">
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">${heroTitle}</h1>
                <p class="hero-subtitle">Play free online on SoccerBros.io</p>
            </div>
        </section>

        <div class="main-layout">
            <aside class="sidebar-ad left-ad">
                <div class="ad-placeholder"></div>
            </aside>

            <div class="main-content-area">
                <section class="game-player-section">
                    <div class="player-card">
                        <div class="player-window">
                            <iframe id="game-iframe" src="${iframeSrc}" allowfullscreen></iframe>
                        </div>
                        <div class="player-bar">
                            <div class="current-game">
                                <div class="game-thumb">
                                    <img src="${gameIcon}" id="game-icon" alt="${heroTitle}">
                                </div>
                                <div class="game-details">
                                    <h2 class="game-name" id="current-game-title">${heroTitle}</h2>
                                </div>
                            </div>
                            <div class="player-actions">
                                <button class="action-btn fullscreen-btn" onclick="toggleFullscreen()">
                                    <i class="fas fa-futbol"></i>
                                    <span>Fullscreen</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="bottom-ad-section">
                    <div class="bottom-ad">
                        <div class="ad-placeholder horizontal"></div>
                    </div>
                </section>

                <section class="featured-games">
                    <div class="section-header">
                        <i class="fas fa-fire"></i>
                        <h3 class="section-heading">Popular Games</h3>
                    </div>
                    <div class="games-collection" id="related-games-container">
                    </div>
                </section>

                <section class="game-info-section">
                    <div class="info-card">
                        <div class="info-banner">
                            <i class="fas fa-futbol"></i>
                            ${bannerText}
                        </div>
                        <div class="info-content-block">
                            <h2 class="block-title">About The Game</h2>
                            <p>${aboutText} Play for free on <a href="https://soccerbros.gg/" target="_blank">SoccerBros.io</a></p>
                        </div>
                        <div class="tags-display">
                            <span class="game-tag">
                                <i class="fas fa-futbol"></i> SoccerBros
                            </span>
                            <span class="game-tag">
                                <i class="fas fa-gamepad"></i> ${folder}
                            </span>
                            <span class="game-tag">
                                <i class="fas fa-globe"></i> Browser Game
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            <aside class="sidebar-ad right-ad">
                <div class="ad-placeholder"></div>
            </aside>
        </div>
    </main>

    <footer class="site-footer">
        <div class="footer-wrapper">
            <div class="footer-nav">
                <a href="../index.html" class="footer-link">About</a>
                <a href="../contact.html" class="footer-link">Contact</a>
                <a href="../contact.html" class="footer-link">DMCA</a>
                <a href="../privacy-policy.html" class="footer-link">Privacy</a>
                <a href="../terms-of-service.html" class="footer-link">Terms</a>
                <a href="../cookie-policy.html" class="footer-link">Cookies</a>
            </div>
            <p class="copyright-text">Copyright 2024 SoccerBros.io - Free Online Soccer Games. All rights reserved.</p>
        </div>
    </footer>

    <script src="../js/game_data/games.js"></script>
    <script src="../js/game_data/action.js"></script>
    <script src="../js/game_data/battleRoyale.js"></script>
    <script src="../js/game_data/fps.js"></script>
    <script src="../js/game_data/multiplayer.js"></script>
    <script src="../js/game_data/sniper.js"></script>
    <script src="../init.js"></script>
</body>
</html>`;

            // Replace the main section only (from <main> to </main>)
            content = content.replace(/<main class="content-container">[\s\S]*<\/main>/, newContent);

            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated:', file);
        });
    }
});

console.log('Done!');