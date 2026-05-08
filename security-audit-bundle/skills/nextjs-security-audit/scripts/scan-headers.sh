#!/usr/bin/env bash
# scan-headers.sh — Verifica headers de seguridad en config del proyecto
# Uso: bash scan-headers.sh [project-root]

set -uo pipefail
PROJECT_ROOT="${1:-$(pwd)}"
cd "$PROJECT_ROOT" || exit 1

echo "=== [scan-headers] $PROJECT_ROOT ===" >&2

REQUIRED_HEADERS=(
  "Content-Security-Policy"
  "Strict-Transport-Security"
  "X-Frame-Options"
  "X-Content-Type-Options"
  "Referrer-Policy"
  "Permissions-Policy"
)

CONFIGS=$(find . -maxdepth 3 -type f \( -name 'next.config.*' -o -name 'vercel.json' -o -name 'netlify.toml' -o -name '_headers' -o -name 'middleware.ts' -o -name 'middleware.js' -o -name 'src/middleware.ts' -o -name 'src/middleware.js' -o -name 'vite.config.*' \) -not -path '*/node_modules/*' 2>/dev/null)

echo "Config files found:" >&2
echo "$CONFIGS" >&2

MISSING=()
PRESENT=()
for h in "${REQUIRED_HEADERS[@]}"; do
  FOUND=0
  for cfg in $CONFIGS; do
    if grep -qiE "$h" "$cfg" 2>/dev/null; then
      FOUND=1
      PRESENT+=("$h ($cfg)")
      break
    fi
  done
  [ $FOUND -eq 0 ] && MISSING+=("$h")
done

echo "" >&2
echo "PRESENT:" >&2
printf '  - %s\n' "${PRESENT[@]:-none}" >&2
echo "MISSING:" >&2
printf '  - %s\n' "${MISSING[@]:-none}" >&2

# CSP unsafe-inline / unsafe-eval check
echo "" >&2
echo "--- CSP unsafe directives ---" >&2
grep -rnE "unsafe-inline|unsafe-eval" --include="next.config.*" --include="vercel.json" --include="_headers" --include="middleware.*" 2>/dev/null || echo "(none found)" >&2

# Cookie flags en código
echo "" >&2
echo "--- Cookie security flags ---" >&2
grep -rnE "cookies?\.(set|setAll|create)" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -l 2>/dev/null | head -20 >&2 || true

cat <<EOF
{
  "tool": "scan-headers",
  "missing": [$(printf '"%s",' "${MISSING[@]}" | sed 's/,$//')],
  "present_count": ${#PRESENT[@]}
}
EOF
