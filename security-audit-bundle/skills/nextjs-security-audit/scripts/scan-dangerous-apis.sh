#!/usr/bin/env bash
# scan-dangerous-apis.sh — Detecta APIs peligrosas en el código JS/TS
# eval, Function(), dangerouslySetInnerHTML, document.write, target=_blank sin rel, etc.

set -uo pipefail
PROJECT_ROOT="${1:-$(pwd)}"
cd "$PROJECT_ROOT" || exit 1

echo "=== [scan-dangerous-apis] $PROJECT_ROOT ===" >&2

EXCLUDES='--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=build --exclude-dir=.git --exclude-dir=public'
INCLUDES='--include=*.ts --include=*.tsx --include=*.js --include=*.jsx --include=*.mjs --include=*.cjs'

declare -A PATTERNS=(
  ["dangerouslySetInnerHTML"]="dangerouslySetInnerHTML"
  ["eval()"]='[^A-Za-z_]eval\s*\('
  ["new Function()"]='new\s+Function\s*\('
  ["document.write"]='document\.write\s*\('
  ["innerHTML ="]='\.innerHTML\s*='
  ["window.location user input"]='window\.location\.(href|assign|replace)\s*=\s*[^"'"'"']*\bsearch'
  ["target=_blank sin rel"]='target=["'"'"']_blank["'"'"'](?![^>]*rel=["'"'"'][^"'"'"']*noopener)'
  ["http:// hardcoded (no localhost)"]='["'"'"']http:\/\/(?!localhost|127\.0\.0\.1)'
  ["Math.random como token"]='token.*Math\.random|Math\.random.*token|sessionId.*Math\.random'
  ["MD5/SHA1 password"]='(md5|sha1)\s*\(\s*[^)]*pass'
  ["console.log con tokens"]='console\.log\([^)]*(token|secret|password|apiKey)'
  ["Fetch sin credentials check"]='fetch\([^)]+\)\.then'
)

ISSUES=0
for label in "${!PATTERNS[@]}"; do
  pat="${PATTERNS[$label]}"
  RESULTS=$(grep -rEn $EXCLUDES $INCLUDES "$pat" . 2>/dev/null || true)
  if [ -n "$RESULTS" ]; then
    echo "" >&2
    echo "[$label]" >&2
    echo "$RESULTS" | head -10 >&2
    COUNT=$(echo "$RESULTS" | wc -l)
    ISSUES=$((ISSUES+COUNT))
  fi
done

# CORS abierto
echo "" >&2
echo "--- CORS Access-Control-Allow-Origin: * ---" >&2
grep -rEn $EXCLUDES "Access-Control-Allow-Origin.*\*|origin:\s*['\"]?\\*" --include="*.ts" --include="*.js" --include="*.json" . 2>/dev/null | head -10 >&2 || true

# Open redirect heurística
echo "" >&2
echo "--- Posibles open redirects (res.redirect / NextResponse.redirect con input) ---" >&2
grep -rEn $EXCLUDES "redirect\(.*req\.|redirect\(.*searchParams|redirect\(.*query\." --include="*.ts" --include="*.tsx" --include="*.js" . 2>/dev/null | head -10 >&2 || true

# SQL string concat
echo "" >&2
echo "--- Posibles SQL injection (concatenación) ---" >&2
grep -rEn $EXCLUDES "(query|sql)\s*\(\s*['\"\`][^'\"\`]*\\\$\{|\\\`SELECT.*\\\$\{|\\\`INSERT.*\\\$\{|\\\`UPDATE.*\\\$\{|\\\`DELETE.*\\\$\{" --include="*.ts" --include="*.js" . 2>/dev/null | head -10 >&2 || true

cat <<EOF
{"tool":"scan-dangerous-apis","total_matches":$ISSUES}
EOF
