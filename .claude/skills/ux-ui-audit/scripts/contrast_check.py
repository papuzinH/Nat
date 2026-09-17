#!/usr/bin/env python3
"""
Contraste WCAG de la paleta de NatArt.
Revisa las combinaciones que el sitio usa de verdad. Correr desde la raíz:
    python .claude/skills/ux-ui-audit/scripts/contrast_check.py
"""

import sys


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))


def relative_luminance(r: int, g: int, b: int) -> float:
    def linearize(c: int) -> float:
        s = c / 255.0
        return s / 12.92 if s <= 0.03928 else ((s + 0.055) / 1.055) ** 2.4

    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)


def contrast_ratio(color1: str, color2: str) -> float:
    l1 = relative_luminance(*hex_to_rgb(color1))
    l2 = relative_luminance(*hex_to_rgb(color2))
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)


# Tokens de app/globals.css y tailwind.config.js
COLORS = {
    "cream-50": "#fdfcfb",
    "cream-100": "#faf6f0",
    "cream-200": "#f5efe6",
    "cream-300": "#ede4d5",
    "taupe-300": "#d4c5b0",
    "taupe-500": "#b8a898",
    "taupe-700": "#8a7a6a",
    "sage-200": "#c8d5b9",
    "sage-400": "#9bb89f",
    "sage-500": "#7a9e7e",
    "sage-700": "#4a7c59",
    "sage-900": "#2f4a37",
    "amber-400": "#dda15e",
    "amber-700": "#a35e20",
    "ink": "#2c2c2c",
    "ink-soft": "#5a5350",
}

# (texto, fondo, dónde se usa, mínimo). 4.5 para texto normal, 3.0 para texto grande.
CHECKS = [
    ("ink", "cream-50", "Texto principal sobre el fondo del sitio", 4.5),
    ("ink", "cream-100", "Texto sobre secciones crema", 4.5),
    ("ink", "cream-200", "Texto sobre tarjetas y chips", 4.5),
    ("ink-soft", "cream-50", "Texto secundario (descripciones, ayudas)", 4.5),
    ("ink-soft", "cream-100", "Texto secundario sobre crema (avisos, toolbar admin)", 4.5),
    ("ink-soft", "cream-200", "Etiquetas mono sobre chips (ARS, categorías)", 4.5),
    ("sage-700", "cream-50", "Precio y links verdes", 4.5),
    ("sage-700", "cream-100", "Links verdes sobre crema (eyebrow, aviso cerámica)", 4.5),
    ("sage-900", "cream-50", "Precio del detalle de producto", 4.5),
    ("amber-700", "cream-100", "Eyebrow del hero (corregido el 2026-09-07)", 4.5),
    ("cream-50", "sage-700", "Texto del botón principal (Agregar al carrito)", 4.5),
    ("cream-50", "sage-900", "Badge Vendido y pills activos del filtro", 4.5),
    # taupe-700 NO sirve para texto: da 4,04:1 sobre cream-50 y no llega a AA.
    # Se sacó de BlogCard el 2026-09-17; para texto atenuado va ink-soft.
    # Texto grande (títulos, ≥ 24px o ≥ 18.66px en negrita)
    ("sage-700", "cream-50", "Título en cursiva verde (grande)", 3.0),
    ("ink-soft", "cream-100", "Subtítulos de hero (grande)", 3.0),
    # Elementos no textuales que SÍ comunican estado: mínimo 3:1 (WCAG 1.4.11).
    # El punto activo del carrusel es el que marca la posición; el inactivo
    # (taupe-500) y los motivos botánicos (sage-500) son decorativos y quedan fuera.
    ("sage-700", "cream-50", "Punto activo del carrusel y borde de foco", 3.0),
]


def main() -> int:
    print("=" * 72)
    print("Contraste WCAG AA — NatArt")
    print("=" * 72)
    print()

    fallan = []
    pasan = 0

    for fg_name, bg_name, descripcion, minimo in CHECKS:
        fg, bg = COLORS[fg_name], COLORS[bg_name]
        ratio = contrast_ratio(fg, bg)
        ok = ratio >= minimo
        if ok:
            pasan += 1
        else:
            fallan.append((descripcion, ratio, minimo, fg_name, fg, bg_name, bg))
        print(f"  [{'OK  ' if ok else 'FALLA'}] {ratio:5.2f}:1 (mín {minimo}:1) — {descripcion}")

    print()
    print("-" * 72)
    print(f"Resultado: {pasan} pasan, {len(fallan)} fallan de {pasan + len(fallan)}")

    if fallan:
        print("\nPARA CORREGIR:")
        for desc, ratio, minimo, fgn, fg, bgn, bg in fallan:
            print(f"  - {desc}: {ratio:.2f}:1, necesita {minimo}:1")
            print(f"    texto {fgn} {fg} sobre {bgn} {bg}")

    return 1 if fallan else 0


if __name__ == "__main__":
    sys.exit(main())
