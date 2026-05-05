const fs = require('fs');

const pages = ['contact.html', 'privacy-policy.html', 'terms-of-service.html', 'cookie-policy.html'];

pages.forEach(file => {
    const filePath = `f:\\DATA\\MyWorkspace\\h5game\\soccer bros\\${file}`;
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has main-layout
    if (content.includes('main-layout')) {
        console.log('Skipping (has main-layout):', file);
        return;
    }

    console.log('Fixing:', file);

    // Extract the content between hero-section and before footer
    const mainContentMatch = content.match(/<section class="game-info-section">[\s\S]*?(?=\s*<footer)/);
    if (!mainContentMatch) {
        console.log('No content found:', file);
        return;
    }

    const mainContent = mainContentMatch[0];

    // Create new content with main-layout
    const newMainContent = `        <div class="main-layout">
            <aside class="sidebar-ad left-ad">
                <div class="ad-placeholder"></div>
            </aside>

            <div class="main-content-area">
${mainContent}

                <section class="bottom-ad-section">
                    <div class="bottom-ad">
                        <div class="ad-placeholder horizontal"></div>
                    </div>
                </section>
            </div>

            <aside class="sidebar-ad right-ad">
                <div class="ad-placeholder"></div>
            </aside>
        </div>`;

    // Replace the game-info-section content with the new layout
    content = content.replace(/(<section class="game-info-section">[\s\S]*?)(?=\s*<footer)/, newMainContent);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', file);
});

console.log('Done!');