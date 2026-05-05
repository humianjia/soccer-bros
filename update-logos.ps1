# 批量更新Logo跳转脚本
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
    
    # 更新Logo区域添加点击跳转
    $oldPattern = '<div class="brand-area">\s*<div class="logo-mark">\s*<i class="fas fa-futbol"></i>\s*</div>\s*<span class="brand-name">Soccer<span>Bros</span></span>\s*</div>'
    $newLogo = '<div class="brand-area" onclick="window.location.href=`'../index.html`'" style="cursor: pointer;">
                <div class="logo-mark">
                    <i class="fas fa-futbol"></i>
                </div>
                <span class="brand-name">Soccer<span>Bros</span></span>
            </div>'
    
    # 使用正则表达式匹配
    $content = $content -replace $oldPattern, $newLogo
    
    # 另一种更简单的匹配方式，不关心空格
    $content = $content -replace '<div class="brand-area">', '<div class="brand-area" onclick="window.location.href=`'../index.html`'" style="cursor: pointer;">'
    
    # 保存文件
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    
    Write-Host "已更新: $($file.Name)"
}

Write-Host "所有Logo更新完成！"