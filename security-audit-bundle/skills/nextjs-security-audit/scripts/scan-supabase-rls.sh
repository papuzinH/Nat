#!/usr/bin/env bash
# scan-supabase-rls.sh — Heurística para detectar uso de Supabase y RLS faltante
# Solo aplica si Supabase está en el proyecto. No reemplaza una review SQL real.

set -uo pipefail
PROJECT_ROOT="${1:-$(pwd)}"
cd "$PROJECT_ROOT" || exit 1

echo "=== [scan-supabase-rls] $PROJECT_ROOT ===" >&2

EXCLUDES='--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=build --exclude-dir=.git'

if ! grep -qE '"@supabase/(supabase-js|ssr|auth-helpers)' package.json 2>/dev/null; then
  echo "{\"tool\":\"scan-supabase-rls\",\"applicable\":false,\"reason\":\"supabase not detected\"}"
  exit 0
fi

echo "Supabase detected" >&2
ISSUES=0

# 1) Service role key usada en client-side
echo "" >&2
echo "--- service_role usado fuera de server ---" >&2
SR_USAGES=$(grep -rEn $EXCLUDES "SUPABASE_SERVICE_ROLE_KEY|service_role" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null || true)
echo "$SR_USAGES" >&2
# Si aparece en archivos client (no /api/, no server/, no app/api/)
SR_BAD=$(echo "$SR_USAGES" | grep -vE '/api/|/server/|app/api/|route\.(ts|js)|\.server\.(ts|js)|/lib/server|edge-functions/|supabase/functions/' || true)
if [ -n "$SR_BAD" ]; then
  echo "CRITICAL: service_role referenced from likely client code:" >&2
  echo "$SR_BAD" >&2
  ISSUES=$((ISSUES+1))
fi

# 2) Migrations / SQL que crean tablas sin RLS
echo "" >&2
echo "--- Tablas sin 'enable row level security' ---" >&2
SQL_FILES=$(find . -type f \( -name '*.sql' \) -not -path '*/node_modules/*' 2>/dev/null)
for f in $SQL_FILES; do
  TABLES=$(grep -iE "create table" "$f" 2>/dev/null | grep -oiE "create table[^(]+" | awk '{print $NF}' | tr -d '"' | tr -d "'")
  for t in $TABLES; do
    if ! grep -iE "alter table[[:space:]]+(public\.)?$t.*enable row level security|enable row level security" "$f" >/dev/null 2>&1; then
      echo "POSSIBLY MISSING RLS: table=$t in $f" >&2
      ISSUES=$((ISSUES+1))
    fi
  done
done

# 3) supabase.from(...) con .rpc o .insert sin auth context (heurística débil, solo para flag)
echo "" >&2
echo "--- supabase.from() / .rpc() usages (manual review) ---" >&2
grep -rnE "supabase\.from\(|supabase\.rpc\(" $EXCLUDES --include="*.ts" --include="*.tsx" . 2>/dev/null | head -30 >&2 || true

# 4) createClient con anon key client-side está OK; con service_role NO
echo "" >&2
echo "--- createClient calls ---" >&2
grep -rnE "createClient\s*\(" $EXCLUDES --include="*.ts" --include="*.tsx" --include="*.js" . 2>/dev/null | head -20 >&2 || true

cat <<EOF
{"tool":"scan-supabase-rls","applicable":true,"flagged_issues":$ISSUES}
EOF
