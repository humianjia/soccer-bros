Get-ChildItem -Path "f:\DATA\MyWorkspace\h5game\soccer bros" -Recurse -Include "*.html" | Where-Object { $_.FullName -match "Action|BattleRoyale|FPS|Multiplayer|Sniper" } | ForEach-Object {
    $content = Get-Content -Path $_.FullName -Raw
    if ($content -match 'onclick="window.location.href=' "'" '../index.html'" '"') {
        $newContent = $content -replace 'onclick="window.location.href=' "'" '../index.html'" '"', ''
        $newContent = $newContent -replace '<div class="brand-area">', '<a href="../index.html" class="brand-area" style="text-decoration: none; color: inherit; display: flex; align-items: center;">'
        Set-Content -Path $_.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($_.Name)"
    }
}