# Instala el skill seo-lighthouse-audit en Claude Code CLI (global)
$source = "$env:USERPROFILE\Documents\Proyectos\React\Nat\seo-skill-tmp"
$dest   = "$env:USERPROFILE\.claude\skills\seo-lighthouse-audit"

Copy-Item -Path $source -Destination $dest -Recurse -Force
Write-Host "✅ Skill instalado en: $dest"
