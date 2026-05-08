#!/usr/bin/env bash
# scan-env.sh — Detecta variables de entorno mal expuestas al cliente
# Detecta NEXT_PUBLIC_* / VITE_* / PUBLIC_* con nombres sospechosos.

set -uo pipefail
PROJECT_ROOT="${1:-$(pwd)}"
cd "$PROJECT_ROOT" || exit 1

echo "=== [scan-env] $PROJECT_ROOT ===" >&2

EXCLUDES='--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=build --exclude-dir=.git'

DANGEROUS_PATTERNS=(
  'NEXT_PUBLIC_[A-Z_]*(SECRET|PRIVATE|SERVICE_ROLE|JWT_SECRET|API_SECRET|DB_PASSWORD|DATABASE_URL|SMTP_PASS|WEBHOOK_SECRET|STRIPE_SECRET|MP_ACCESS|ADMIN_)'
  'VITE_[A-Z_]*(SECRET|PRIVATE|SERVICE_ROLE|JWT_SECRET|API_SECRET|DB_PASSWORD|DATABASE_URL|SMTP_PASS|STRIPE_SECRET|ADMIN_)'
  'PUBLIC_[A-Z_]*(SECRET|PRIVATE|SERVICE_ROLE|API_SECRET)'
)

ISSUES=0
for pat in "${DANGEROUS_PATTERNS[@]}"; do
  while IFS= read -r match; do
    [ -z "$match" ] && continue
    echo "DANGEROUS: $match" >&2
    ISSUES=$((ISSUES+1))
  done < <(grep -rEn $EXCLUDES "$pat" . 2>/dev/null || true)
done

# Lista todas las vars públicas declaradas (informativo)
echo "" >&2
echo "--- All public env vars referenced ---" >&2
grep -rhEo 'NEXT_PUBLIC_[A-Z_]+|VITE_[A-Z_]+|PUBLIC_[A-Z_]+' $EXCLUDES . 2>/dev/null | sort -u | head -50 >&2 || true

# Comprueba que .env esté en .gitignore
echo "" >&2
echo "--- .gitignore .env coverage ---" >&2
if [ -f .gitignore ]; then
  if grep -qE '^\.env(\.|$)|^\*\.env|^\.env\*' .gitignore; then
    echo ".env patterns are gitignored ✓" >&2
  else
    echo "WARNING: .env not in .gitignore" >&2
    ISSUES=$((ISSUES+1))
  fi
else
  echo "WARNING: no .gitignore found" >&2
fi

cat <<EOF
{"tool":"scan-env","dangerous_public_vars":$ISSUES}
EOF
