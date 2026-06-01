#!/bin/bash
# Static code audit for common UX/UI issues in the Renna Steffen project
# Run from project root: bash .claude/skills/ux-ui-audit/scripts/code_audit.sh

echo "========================================================================"
echo "UX/UI Code Audit — Steffen Mediaciones"
echo "========================================================================"
echo ""

PROJECT_ROOT="${1:-.}"
SRC="$PROJECT_ROOT/src"

# 1. Check for missing alt attributes on images
echo "--- 1. Images without alt text ---"
grep -rn "<img" "$SRC" --include="*.tsx" --include="*.jsx" | grep -v "alt=" | head -20
IMG_COUNT=$(grep -rn "<img" "$SRC" --include="*.tsx" --include="*.jsx" | grep -vc "alt=" 2>/dev/null || echo 0)
echo "  Found: $IMG_COUNT images without alt text"
echo ""

# 2. Check for potential touch target issues (very small padding)
echo "--- 2. Potential small touch targets (p-0, p-1, px-1, py-1) ---"
grep -rn "className=.*\bp-[01]\b\|className=.*\bpx-1\b\|className=.*\bpy-1\b" "$SRC/components" --include="*.tsx" | head -15
echo ""

# 3. Check heading hierarchy
echo "--- 3. Heading tags per file (verify hierarchy) ---"
for f in $(find "$SRC/app" -name "page.tsx" -o -name "*.tsx" | head -30); do
    headings=$(grep -c "<h[1-6]" "$f" 2>/dev/null)
    if [ "$headings" -gt 0 ] 2>/dev/null; then
        echo "  $f:"
        grep -n "<h[1-6]" "$f" | sed 's/^/    /'
    fi
done
echo ""

# 4. Check for hardcoded pixel widths that may break responsive
echo "--- 4. Hardcoded pixel widths in components ---"
grep -rn "w-\[[0-9]*px\]\|h-\[[0-9]*px\]\|min-w-\[[0-9]*px\]\|max-w-\[[0-9]*px\]" "$SRC/components" --include="*.tsx" | head -20
echo ""

# 5. Check for overflow handling
echo "--- 5. Overflow handling in components ---"
grep -rn "overflow" "$SRC" --include="*.tsx" --include="*.css" | head -15
echo ""

# 6. Check for z-index values (potential layering issues)
echo "--- 6. Z-index values (check for conflicts) ---"
grep -rn "z-\[" "$SRC" --include="*.tsx" | head -15
grep -rn "z-10\|z-20\|z-30\|z-40\|z-50" "$SRC" --include="*.tsx" | head -15
echo ""

# 7. Check for responsive utilities usage
echo "--- 7. Responsive breakpoint usage (md:, lg:, sm:) ---"
SM_COUNT=$(grep -rc "sm:" "$SRC" --include="*.tsx" | awk -F: '{sum+=$2} END {print sum}')
MD_COUNT=$(grep -rc "md:" "$SRC" --include="*.tsx" | awk -F: '{sum+=$2} END {print sum}')
LG_COUNT=$(grep -rc "lg:" "$SRC" --include="*.tsx" | awk -F: '{sum+=$2} END {print sum}')
XL_COUNT=$(grep -rc "xl:" "$SRC" --include="*.tsx" | awk -F: '{sum+=$2} END {print sum}')
echo "  sm: breakpoints used: $SM_COUNT times"
echo "  md: breakpoints used: $MD_COUNT times"
echo "  lg: breakpoints used: $LG_COUNT times"
echo "  xl: breakpoints used: $XL_COUNT times"
echo ""

# 8. Check for focus states on interactive elements
echo "--- 8. Focus state handling ---"
FOCUS_COUNT=$(grep -rc "focus:" "$SRC" --include="*.tsx" | awk -F: '{sum+=$2} END {print sum}')
FOCUS_VISIBLE=$(grep -rc "focus-visible:" "$SRC" --include="*.tsx" | awk -F: '{sum+=$2} END {print sum}')
echo "  focus: utilities: $FOCUS_COUNT"
echo "  focus-visible: utilities: $FOCUS_VISIBLE"
echo ""

# 9. Check for aria attributes
echo "--- 9. ARIA attribute usage ---"
ARIA_COUNT=$(grep -rc "aria-" "$SRC" --include="*.tsx" | awk -F: '{sum+=$2} END {print sum}')
ROLE_COUNT=$(grep -rc "role=" "$SRC" --include="*.tsx" | awk -F: '{sum+=$2} END {print sum}')
echo "  aria-* attributes: $ARIA_COUNT"
echo "  role attributes: $ROLE_COUNT"
echo ""

# 10. Check for "use client" directives
echo "--- 10. Client vs Server Components ---"
CLIENT_COUNT=$(grep -rl "use client" "$SRC" --include="*.tsx" | wc -l)
TOTAL_TSX=$(find "$SRC" -name "*.tsx" | wc -l)
echo "  'use client' components: $CLIENT_COUNT"
echo "  Total .tsx files: $TOTAL_TSX"
echo "  Server components (approx): $((TOTAL_TSX - CLIENT_COUNT))"
echo ""

echo "========================================================================"
echo "Audit complete. Review findings above."
echo "========================================================================"
