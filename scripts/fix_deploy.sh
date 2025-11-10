#!/usr/bin/env bash
set -euo pipefail
echo "Running deploy-fix helper..."

if [ ! -d .git ]; then
  echo ".git not found: make sure you are in the repo root" >&2
fi

echo "Removing node_modules from git index (cached)..."
git rm -r --cached node_modules || true

echo "Ensuring .gitignore exists and contains entries..."
cat > .gitignore <<'EOF'
node_modules/
.env
.DS_Store
npm-debug.log*
package-lock.json
dist/
/.vscode/
uploads/
EOF

echo "Installing dependencies locally to generate package-lock.json (may take a minute)..."
npm install

echo "Staging changes..."
git add .gitignore package-lock.json
git commit -m "chore: remove node_modules from repo, add .gitignore and package-lock" || true

echo "Pushing to origin (master)..."
git push origin master

echo "Done. Now clear build cache on Render and trigger a redeploy (or run the deploy pipeline)."
