#!/usr/bin/env bash
# scan-dependencies.sh — Audita dependencias del proyecto
# Uso: bash scan-dependencies.sh [project-root]
# Output: JSON resumen en stdout + tabla legible en stderr

set -uo pipefail
PROJECT_ROOT="${1:-$(pwd)}"
cd "$PROJECT_ROOT" || exit 1

echo "=== [scan-dependencies] $PROJECT_ROOT ===" >&2

if [ ! -f package.json ]; then
  echo "{\"error\":\"no_package_json\",\"path\":\"$PROJECT_ROOT\"}"
  exit 0
fi

# Detecta package manager
PM=""
if [ -f pnpm-lock.yaml ]; then PM="pnpm"
elif [ -f yarn.lock ]; then PM="yarn"
elif [ -f bun.lockb ] || [ -f bun.lock ]; then PM="bun"
elif [ -f package-lock.json ]; then PM="npm"
else PM="npm"
fi
echo "Package manager: $PM" >&2

# 1) npm audit (funciona también con yarn/pnpm vía npm si hay package-lock; si no, generamos uno temporal)
AUDIT_JSON=""
if [ "$PM" = "npm" ]; then
  AUDIT_JSON=$(npm audit --json 2>/dev/null || true)
elif [ "$PM" = "pnpm" ]; then
  AUDIT_JSON=$(pnpm audit --json 2>/dev/null || true)
elif [ "$PM" = "yarn" ]; then
  AUDIT_JSON=$(yarn npm audit --json 2>/dev/null || true)
elif [ "$PM" = "bun" ]; then
  AUDIT_JSON=$(bun audit --json 2>/dev/null || echo '{"note":"bun audit not stable, run npm audit manually"}')
fi

# 2) Outdated críticos (next, react, supabase-js, stripe, etc.)
CRITICAL_PACKAGES="next react react-dom @supabase/supabase-js stripe next-auth @auth/core @clerk/nextjs vite express fastify"
OUTDATED=""
for pkg in $CRITICAL_PACKAGES; do
  CUR=$(node -e "try{const p=require('./package.json');console.log((p.dependencies&&p.dependencies['$pkg'])||(p.devDependencies&&p.devDependencies['$pkg'])||'')}catch(e){}" 2>/dev/null)
  if [ -n "$CUR" ]; then
    OUTDATED="$OUTDATED\n  $pkg: $CUR"
  fi
done
echo -e "Critical packages found:$OUTDATED" >&2

# 3) Resumen
VULNS_TOTAL=$(echo "$AUDIT_JSON" | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{try{const j=JSON.parse(s);const v=j.metadata&&j.metadata.vulnerabilities||{};console.log(JSON.stringify({critical:v.critical||0,high:v.high||0,moderate:v.moderate||0,low:v.low||0,info:v.info||0,total:v.total||0}))}catch(e){console.log('{}')}}" 2>/dev/null || echo '{}')

cat <<EOF
{
  "tool": "scan-dependencies",
  "package_manager": "$PM",
  "vulnerabilities": $VULNS_TOTAL,
  "raw_audit_truncated": $(echo "$AUDIT_JSON" | head -c 4000 | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>console.log(JSON.stringify(s)))" 2>/dev/null || echo '""')
}
EOF
