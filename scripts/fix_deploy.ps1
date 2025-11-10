<#
PowerShell helper to remove tracked node_modules, add .gitignore, commit lockfile, and push.
Run this from the project root in PowerShell (as your user):
    cd "C:\Users\User\Desktop\Sigma 6.0\Web development\project-1\wanderLust"
    .\scripts\fix_deploy.ps1
#>

Write-Host "Running deploy-fix helper..."

if (-Not (Test-Path .git)) {
    Write-Host ".git not found: make sure you are in the repo root" -ForegroundColor Yellow
}

Write-Host "Removing node_modules from git index (cached)..."
git rm -r --cached node_modules 2>$null

Write-Host "Ensuring .gitignore exists and contains entries..."
$ignore = @(
    'node_modules/',
    '.env',
    '.DS_Store',
    'npm-debug.log*',
    'package-lock.json',
    'dist/',
    '/.vscode/',
    'uploads/'
)
$ignore | Out-File -FilePath .gitignore -Encoding utf8

Write-Host "Installing dependencies locally to generate package-lock.json (may take a minute)..."
npm install

Write-Host "Staging changes..."
git add .gitignore package-lock.json
git commit -m "chore: remove node_modules from repo, add .gitignore and package-lock" -q

Write-Host "Pushing to origin (master)..."
git push origin master

Write-Host "Done. Now clear build cache on Render and trigger a redeploy (or run the deploy pipeline)." -ForegroundColor Green
