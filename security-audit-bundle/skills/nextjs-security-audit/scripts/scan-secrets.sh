#!/usr/bin/env bash
# scan-secrets.sh — Detecta secrets hardcodeados en el repo
# Uso: bash scan-secrets.sh [project-root]
# Prefiere gitleaks si está instalado; fallback regex si no.

set -uo pipefail
PROJECT_ROOT="${1:-$(pwd)}"
cd "$PROJECT_ROOT" || exit 1

echo "=== [scan-secrets] $PROJECT_ROOT ===" >&2

EXCLUDES='--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=build --exclude-dir=.git --exclude-dir=coverage --exclude-dir=.turbo --exclude-dir=.cache'

if command -v gitleaks >/dev/null 2>&1; then
  echo "Using gitleaks" >&2
  GITLEAKS_OUT=$(gitleaks detect --no-banner --report-format json --report-path /dev/stdout --redact 2>/dev/null || true)
  echo "{\"tool\":\"gitleaks\",\"findings\":$GITLEAKS_OUT}"
  exit 0
fi

echo "gitleaks NOT FOUND, falling back to regex grep" >&2

# Patrones de secrets comunes (server-side keys, tokens, etc.)
declare -a PATTERNS=(
  'sk_live_[A-Za-z0-9]{20,}'                                  # Stripe live secret
  'sk_test_[A-Za-z0-9]{20,}'                                  # Stripe test secret
  'rk_live_[A-Za-z0-9]{20,}'                                  # Stripe restricted
  'whsec_[A-Za-z0-9]{20,}'                                    # Stripe webhook secret
  'AKIA[0-9A-Z]{16}'                                          # AWS access key
  'AIza[0-9A-Za-z_-]{35}'                                     # Google API key
  'ghp_[A-Za-z0-9]{36,}'                                      # GitHub PAT
  'gho_[A-Za-z0-9]{36,}'                                      # GitHub OAuth
  'glpat-[A-Za-z0-9_-]{20,}'                                  # GitLab PAT
  'xox[baprs]-[A-Za-z0-9-]{10,}'                              # Slack token
  'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'  # JWT
  'service_role.*eyJ'                                         # Supabase service role
  'SUPABASE_SERVICE_ROLE_KEY\s*=\s*["'\'']?eyJ'               # Supabase service role var
  '-----BEGIN (RSA|EC|OPENSSH|DSA|PGP) PRIVATE KEY-----'     # Private keys
  'mongodb(\+srv)?:\/\/[^"\s]+:[^"\s]+@'                      # MongoDB URI con password
  'postgres(ql)?:\/\/[^"\s]+:[^"\s]+@'                        # Postgres URI con password
  'mysql:\/\/[^"\s]+:[^"\s]+@'                                # MySQL URI con password
  'MP_ACCESS_TOKEN\s*=\s*["'\'']?APP_USR'                     # Mercado Pago
)

FINDINGS_FILE=$(mktemp)
echo "[]" > "$FINDINGS_FILE"

COUNT=0
for pat in "${PATTERNS[@]}"; do
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    FILE=$(echo "$line" | cut -d: -f1)
    LINENO=$(echo "$line" | cut -d: -f2)
    # Salta archivos de ejemplo / test fixtures conocidos
    case "$FILE" in
      *.example|*.test.*|*.spec.*|*/test/*|*/tests/*|*/__tests__/*|*/fixtures/*) continue;;
    esac
    COUNT=$((COUNT+1))
    echo "MATCH: $FILE:$LINENO  pattern=$pat" >&2
  done < <(grep -rEn $EXCLUDES "$pat" . 2>/dev/null || true)
done

# Heurística: variables NEXT_PUBLIC_* que contengan palabras clave peligrosas
echo "" >&2
echo "--- Heuristic: NEXT_PUBLIC_* with sensitive names ---" >&2
grep -rEn $EXCLUDES 'NEXT_PUBLIC_[A-Z_]*(SECRET|PRIVATE|SERVICE_ROLE|TOKEN|PASSWORD|API_KEY)' . 2>/dev/null || true

# .env files committed?
echo "" >&2
echo "--- .env files in repo ---" >&2
find . -maxdepth 4 -type f \( -name '.env' -o -name '.env.local' -o -name '.env.production' -o -name '.env.development' \) -not -path '*/node_modules/*' 2>/dev/null

if git rev-parse --git-dir >/dev/null 2>&1; then
  echo "" >&2
  echo "--- .env tracked in git? ---" >&2
  git ls-files | grep -E '^\.env(\.|$)' 2>/dev/null || echo "(none tracked, good)" >&2
fi

echo "{\"tool\":\"regex-fallback\",\"matches\":$COUNT,\"note\":\"Install gitleaks for better coverage: brew install gitleaks OR https://github.com/gitleaks/gitleaks\"}"
