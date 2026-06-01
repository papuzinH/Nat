#!/usr/bin/env python3
"""
WCAG Contrast Ratio Calculator for Steffen Mediaciones design system.
Checks all critical color combinations against WCAG AA standards.
"""

import sys


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def relative_luminance(r: int, g: int, b: int) -> float:
    """Calculate relative luminance per WCAG 2.1."""
    def linearize(c: int) -> float:
        s = c / 255.0
        return s / 12.92 if s <= 0.03928 else ((s + 0.055) / 1.055) ** 2.4

    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)


def contrast_ratio(color1: str, color2: str) -> float:
    """Calculate contrast ratio between two hex colors."""
    l1 = relative_luminance(*hex_to_rgb(color1))
    l2 = relative_luminance(*hex_to_rgb(color2))
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


# Design system colors
COLORS = {
    "primary": "#1B2A4A",
    "secondary": "#8B7355",
    "accent": "#C9A96E",
    "background": "#FAFAF8",
    "foreground": "#1A1A1A",
    "muted": "#F5F3EF",
    "border": "#E5E0D8",
    "white": "#FFFFFF",
    "black": "#000000",
    # Badge colors (approximate)
    "badge-yellow-bg": "#FEF3C7",
    "badge-yellow-text": "#92400E",
    "badge-orange-bg": "#FFEDD5",
    "badge-orange-text": "#9A3412",
    "badge-green-bg": "#DCFCE7",
    "badge-green-text": "#166534",
    "badge-red-bg": "#FEE2E2",
    "badge-red-text": "#991B1B",
    "badge-gray-bg": "#F3F4F6",
    "badge-gray-text": "#374151",
}

# Critical combinations to check
CHECKS = [
    # Normal text combinations
    ("foreground", "background", "Normal text on background", 4.5),
    ("foreground", "muted", "Normal text on muted background", 4.5),
    ("white", "primary", "White text on primary (header/footer)", 4.5),
    ("accent", "background", "Accent text on background", 4.5),
    ("accent", "primary", "Accent on primary (CTAs in header)", 3.0),
    ("secondary", "background", "Secondary text on background", 4.5),
    ("secondary", "muted", "Secondary text on muted background", 4.5),
    ("primary", "background", "Primary text on background", 4.5),
    ("primary", "muted", "Primary text on muted", 4.5),
    # Large text (headings) - 3:1 ratio required
    ("primary", "background", "Primary heading on background (large)", 3.0),
    ("accent", "background", "Accent heading on background (large)", 3.0),
    # Badge combinations
    ("badge-yellow-text", "badge-yellow-bg", "PENDING_PAYMENT badge", 4.5),
    ("badge-orange-text", "badge-orange-bg", "PAYMENT_UPLOADED badge", 4.5),
    ("badge-green-text", "badge-green-bg", "CONFIRMED badge", 4.5),
    ("badge-red-text", "badge-red-bg", "CANCELLED badge", 4.5),
    ("badge-gray-text", "badge-gray-bg", "COMPLETED badge", 4.5),
    # Interactive elements
    ("white", "accent", "White text on accent button", 4.5),
    ("primary", "accent", "Primary text on accent button", 4.5),
    ("foreground", "border", "Text on border-colored element", 4.5),
]


def main():
    print("=" * 70)
    print("WCAG AA Contrast Audit — Steffen Mediaciones")
    print("=" * 70)
    print()

    passed = 0
    failed = 0
    warnings = []

    for fg_name, bg_name, description, min_ratio in CHECKS:
        fg = COLORS[fg_name]
        bg = COLORS[bg_name]
        ratio = contrast_ratio(fg, bg)
        status = "PASS" if ratio >= min_ratio else "FAIL"

        if status == "FAIL":
            failed += 1
            indicator = "FAIL"
        else:
            passed += 1
            indicator = "PASS"

        line = f"  [{indicator}] {ratio:5.2f}:1 (min {min_ratio}:1) — {description}"
        if status == "FAIL":
            line += f"  ({fg_name} {fg} on {bg_name} {bg})"
            warnings.append((description, ratio, min_ratio, fg, bg))

        print(line)

    print()
    print("-" * 70)
    print(f"Results: {passed} passed, {failed} failed out of {passed + failed} checks")
    print()

    if warnings:
        print("ISSUES TO FIX:")
        for desc, ratio, min_ratio, fg, bg in warnings:
            print(f"  - {desc}: {ratio:.2f}:1 (needs {min_ratio}:1)")
            print(f"    Foreground: {fg} | Background: {bg}")
            print()

    return 1 if failed > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
