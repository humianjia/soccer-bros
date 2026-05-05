# 批量更新子游戏页面脚本
$basePath = "f:\DATA\MyWorkspace\h5game\soccer bros"

# 获取所有子游戏HTML文件
$htmlFiles = @()
$htmlFiles += Get-ChildItem -Path (Join-Path $basePath "Action") -Filter "*.html"
$htmlFiles += Get-ChildItem -Path (Join-Path $basePath "BattleRoyale") -Filter "*.html"
$htmlFiles += Get-ChildItem -Path (Join-Path $basePath "FPS") -Filter "*.html" -Exclude "Hazmob_FPS.html"
$htmlFiles += Get-ChildItem -Path (Join-Path $basePath "Multiplayer") -Filter "*.html"
$htmlFiles += Get-ChildItem -Path (Join-Path $basePath "Sniper") -Filter "*.html"

Write-Host "找到 $($htmlFiles.Count) 个文件需要更新..."

foreach ($file in $htmlFiles) {
    Write-Host "正在更新: $($file.Name)"
    
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # 1. 更新Logo区域添加点击跳转
    $oldLogo = '<div class="brand-area">
                <div class="logo-mark">
                    <i class="fas fa-futbol"></i>
                </div>
                <span class="brand-name">Soccer<span>Bros</span></span>
            </div>'
    $newLogo = '<div class="brand-area" onclick="window.location.href=`'../index.html`'" style="cursor: pointer;">
                <div class="logo-mark">
                    <i class="fas fa-futbol"></i>
                </div>
                <span class="brand-name">Soccer<span>Bros</span></span>
            </div>'
    
    # 先尝试更灵活的匹配方式
    $content = $content -replace '<div class="brand-area">\s*<div class="logo-mark">\s*<i class="fas fa-futbol"></i>\s*</div>\s*<span class="brand-name">Soccer<span>Bros</span></span>\s*</div>', $newLogo
    
    # 2. 更新内容区域，添加侧边栏广告
    # 查找hero-section之后的game-player-section
    if ($content -match '(</section>\s*<section class="game-player-section">)') {
        # 找到正确的模式进行替换
        $oldContent = '</section>

        <section class="game-player-section">
            <div class="player-card">
                <div class="player-window">
                    <iframe id="game-iframe" src="[^"]+" allowfullscreen></iframe>
                </div>
                <div class="player-bar">
                    <div class="current-game">
                        <div class="game-thumb">
                            <img src="[^"]+" id="game-icon" alt="[^"]+">
                        </div>
                        <div class="game-details">
                            <h2 class="game-name" id="current-game-title">[^<]+</h2>
                        </div>
                    </div>
                    <div class="player-actions">
                        <button class="action-btn fullscreen-btn" onclick="toggleFullscreen\(\)">
                            <i class="fas fa-futbol"></i>
                            <span>Fullscreen</span>
                        </button>
                    </div>
                </div>
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
                    [^<]+
                </div>
                <div class="info-content-block">
                    <h2 class="block-title">About The Game</h2>
                    [^<]+<a href="[^"]+" target="_blank">SoccerBros.io</a></p>
                </div>
                <div class="tags-display">
                    [^<]+
                </div>
            </div>
        </section>
    </main>'
        
        # 我们需要用更实际的方法，基于我们已经修改的Hazmob_FPS.html的结构来替换
        # 让我们查找从hero-section结束到main结束的内容
        $startPattern = '</section>\s*<section class="game-player-section">'
        $endPattern = '</section>\s*</main>'
        
        # 找到中间的内容
        $startIndex = $content.IndexOf('</section>')
        $playerSectionIndex = $content.IndexOf('<section class="game-player-section">')
        $mainEndIndex = $content.LastIndexOf('</main>')
        
        if ($playerSectionIndex -gt 0 -and $mainEndIndex -gt 0) {
            $beforePlayerSection = $content.Substring(0, $playerSectionIndex - 1)
            $afterSectionStart = $content.Substring($playerSectionIndex, $mainEndIndex - $playerSectionIndex + 7)
            
            # 我们需要构建新的内容
            $newContent = ''
            $newContent += $beforePlayerSection + "`r`n"
            $newContent += '        <div class="main-layout">
            <aside class="sidebar-ad left-ad">
                <div class="ad-placeholder"></div>
            </aside>

            <div class="main-content-area">
        '
            $newContent += $afterSectionStart.Replace('</section>
    </main>', '')
            $newContent += '
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

                <section class="game-info-section">'
            
            # 找到game-info-section部分
            $gameInfoSectionStart = $content.IndexOf('<section class="game-info-section">')
            $gameInfoSectionEnd = $content.IndexOf('</section>', $gameInfoSectionStart + 1)
            
            if ($gameInfoSectionStart -gt 0 -and $gameInfoSectionEnd -gt 0) {
                $gameInfoSection = $content.Substring($gameInfoSectionStart, $gameInfoSectionEnd - $gameInfoSectionStart + 10)
                $newContent += $gameInfoSection.Replace('<section class="game-info-section">', '')
            }
            
            $newContent += '
            </div>

            <aside class="sidebar-ad right-ad">
                <div class="ad-placeholder"></div>
            </aside>
        </div>
    </main>'
            
            # 重新组合完整内容
            $finalContent = $content.Substring(0, $playerSectionIndex - 1) + $newContent.Substring($beforePlayerSection.Length)
            
            # 但是这种方式太复杂了，让我们用更简单的方式：直接基于固定模式替换
            
            # 我们使用已经知道的模板模式
            if ($content -match '(</section>)([\s\S]*?)(</main>)') {
                $matchedContent = $matches[2]
                
                # 构建新的中间内容
                $replacement = @"
        </section>

        <div class="main-layout">
            <aside class="sidebar-ad left-ad">
                <div class="ad-placeholder"></div>
            </aside>

            <div class="main-content-area">
                <section class="game-player-section">
                    <div class="player-card">
                        <div class="player-window">
                            <iframe id="game-iframe" src="https://html5.gamedistribution.com/623baec23d504c83acab0b5250859ba8/?gd_sdk_referrer_url=https%3A%2F%2Fwww.onlinegames.io%2Fcat-runner%2F" allowfullscreen></iframe>
                        </div>
                        <div class="player-bar">
                            <div class="current-game">
                                <div class="game-thumb">
                                    <img src="../img/icon/FPS/HazmobFPS.jpg" id="game-icon" alt="Hazmob FPS">
                                </div>
                                <div class="game-details">
                                    <h2 class="game-name" id="current-game-title">Hazmob FPS</h2>
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
                            Welcome to SoccerBros.io - Play Hazmob FPS and more free online games
                        </div>
                        <div class="info-content-block">
                            <h2 class="block-title">About The Game</h2>
                            <p>Hazmob FPS is a fast-paced online multiplayer first-person shooter game. It features various game modes including Free for All, Team Death Match, Domination, Capture the Flag, Gun Race, Elimination, and Search and Destroy. Players can choose from a variety of weapons and engage in intense battles across different maps. The game is known for its responsive controls and competitive gameplay. Play for free on <a href="https://soccerbros.gg/" target="_blank">SoccerBros.io</a></p>
                        </div>
                        <div class="tags-display">
                            <span class="game-tag">
                                <i class="fas fa-futbol"></i> SoccerBros
                            </span>
                            <span class="game-tag">
                                <i class="fas fa-gamepad"></i> FPS
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
"@
                
                # 这还是太复杂了，让我们采用更简单的方法：直接复制已经处理好的Hazmob_FPS.html作为模板，然后只修改游戏特定的内容
                
                Write-Host "使用模板方法更新 $($file.Name)"
                
                # 读取模板文件
                $templateFile = Join-Path $basePath "FPS\Hazmob_FPS.html"
                $templateContent = Get-Content -Path $templateFile -Raw -Encoding UTF8
                
                # 读取当前文件的内容，获取游戏名称等信息
                $gameName = $file.Name.Replace('.html', '').Replace('_', ' ')
                
                # 获取游戏类型文件夹
                $parentDir = Split-Path -Parent $file.FullName
                $folderName = Split-Path -Leaf $parentDir
                
                # 从当前文件中提取游戏相关的信息
                $currentContent = Get-Content -Path $file.FullName -Raw -Encoding UTF8
                
                # 获取游戏图标路径
                if ($currentContent -match '<img src="([^"]+)" id="game-icon"') {
                    $gameIcon = $matches[1]
                } else {
                    # 构建默认路径
                    $gameIcon = "../img/icon/$folderName/$($file.Name.Replace('.html', '.jpg'))"
                }
                
                # 获取iframe src
                if ($currentContent -match '<iframe id="game-iframe" src="([^"]+)"') {
                    $iframeSrc = $matches[1]
                } else {
                    $iframeSrc = ""
                }
                
                # 获取游戏标题
                if ($currentContent -match '<title>([^<]+)</title>') {
                    $pageTitle = $matches[1]
                } else {
                    $pageTitle = "$gameName - Play Free Online | SoccerBros.io"
                }
                
                # 获取游戏描述
                if ($currentContent -match '<meta name="description" content="([^"]+)"') {
                    $gameDescription = $matches[1]
                } else {
                    $gameDescription = ""
                }
                
                # 获取游戏介绍部分
                $aboutText = ""
                if ($currentContent -match '<h2 class="block-title">About The Game</h2>\s*<p>([^<]+)</p>') {
                    $aboutText = $matches[1]
                }
                
                # 获取info-banner文本
                $bannerText = ""
                if ($currentContent -match '<div class="info-banner">\s*<i class="fas fa-futbol"></i>\s*([^<]+)</div>') {
                    $bannerText = $matches[1]
                }
                
                # 现在让我们用Hazmob_FPS.html作为基础，替换游戏特定的内容
                $finalContent = $templateContent
                
                # 替换页面标题
                if ($currentContent -match '<title>([^<]+)</title>') {
                    $finalContent = $finalContent -replace '<title>[^<]+</title>', "`$0"
                }
                
                # 替换游戏图标
                $finalContent = $finalContent -replace '<img src="[^"]+" id="game-icon" alt="[^"]+">', "<img src=`"$gameIcon`" id=`"game-icon`" alt=`"$gameName`">"
                
                # 替换游戏标题
                $finalContent = $finalContent -replace '<h2 class="game-name" id="current-game-title">[^<]+</h2>', "<h2 class=`"game-name`" id=`"current-game-title`">$gameName</h2>"
                
                # 替换iframe src
                if ($iframeSrc) {
                    $finalContent = $finalContent -replace '<iframe id="game-iframe" src="[^"]+"', "<iframe id=`"game-iframe`" src=`"$iframeSrc`""
                }
                
                # 替换hero标题
                $finalContent = $finalContent -replace '<h1 class="hero-title">Hazmob FPS</h1>', "<h1 class=`"hero-title`">$gameName</h1>"
                
                # 替换info-banner文本
                if ($bannerText) {
                    $finalContent = $finalContent -replace '<div class="info-banner">\s*<i class="fas fa-futbol"></i>\s*[^<]+</div>', "<div class=`"info-banner`">`n                    <i class=`"fas fa-futbol`"></i>`n                    $bannerText`n                </div>"
                }
                
                # 替换about the game文本
                if ($aboutText) {
                    $finalContent = $finalContent -replace '<h2 class="block-title">About The Game</h2>\s*<p>[^<]+</p>', "<h2 class=`"block-title`">About The Game</h2>`n                    <p>$aboutText</p>"
                }
                
                # 替换meta description
                if ($gameDescription) {
                    $finalContent = $finalContent -replace '<meta name="description" content="[^"]+">', "<meta name=`"description`" content=`"$gameDescription`">"
                }
                
                # 替换页面标题
                $finalContent = $finalContent -replace '<title>[^<]+</title>', "<title>$pageTitle</title>"
                
                # 现在保存这个内容
                Set-Content -Path $file.FullName -Value $finalContent -Encoding UTF8 -NoNewline
                
                Write-Host "已更新: $($file.Name)"
            }
        }
    }
}

Write-Host "所有文件更新完成！"