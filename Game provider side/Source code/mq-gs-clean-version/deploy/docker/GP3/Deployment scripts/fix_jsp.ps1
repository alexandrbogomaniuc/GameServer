$path = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\web-gs\src\main\webapp\real\mp\template.jsp"
$content = Get-Content $path -Raw

# Fix Broken Block: // for POV standalone client need return JSON
# This was split across multiple lines, causing "POV", "standalone" etc to be read as code.
$content = $content -replace "(?s)//\s*for\s+POV\s+standalone\s+client\s+need\s+return\s+JSON", "    // for POV standalone client need return JSON"

Set-Content -Path $path -Value $content -Force
Write-Host "JSP POV Block Fixed"
