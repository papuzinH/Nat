/**
 * Geometría compartida de los motivos botánicos (NHLeafMark, NHSprig, NHFlower,
 * NHBranch, NHBud, NHTendril, NHWreath).
 *
 * Todas las hojas se dibujan con la base en (0,0) y la punta en (0,-length), para
 * poder plantarlas sobre un tallo con un `translate(x y) rotate(θ)` desde afuera.
 */

import type { CSSProperties } from 'react'

const n = (v: number) => Number(v.toFixed(2))

/** Contorno ojival: dos curvas espejadas que se cierran en la base y en la punta. */
export const leafPath = (length: number, width: number) =>
  `M0 0C${-width} ${n(-length * 0.3)} ${-width} ${n(-length * 0.68)} 0 ${-length}` +
  `C${width} ${n(-length * 0.68)} ${width} ${n(-length * 0.3)} 0 0Z`

/**
 * Nervadura central como sub-path cerrado. Concatenada al contorno en un mismo
 * `<path fill-rule="evenodd">` queda calada de verdad (transparente), así el hueco
 * funciona sobre cualquier fondo en vez de depender del color de la sección.
 */
export const midribPath = (length: number, width = 0.42) =>
  `M0 ${n(-length * 0.1)}C${width} ${n(-length * 0.35)} ${width} ${n(-length * 0.65)} 0 ${n(-length * 0.9)}` +
  `C${-width} ${n(-length * 0.65)} ${-width} ${n(-length * 0.35)} 0 ${n(-length * 0.1)}Z`

/** Contorno + nervadura, listo para `fillRule="evenodd"`. */
export const leafWithMidrib = (length: number, width: number) =>
  leafPath(length, width) + midribPath(length)

export type Point = readonly [number, number]
export type Cubic = readonly [Point, Point, Point, Point]

/**
 * Punto y ángulo tangente sobre una curva cúbica. Permite plantar hojas a lo largo
 * de cualquier tallo curvo alineadas con la rama, sin adivinar coordenadas a mano:
 * el ángulo devuelto ya es el que orienta una hoja (que apunta a 0,-1) en la
 * dirección de avance del tallo.
 */
export const cubicAt = (curve: Cubic, t: number) => {
  const u = 1 - t
  const at = (a: number, b: number, c: number, d: number) =>
    u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d
  const slope = (a: number, b: number, c: number, d: number) =>
    3 * u * u * (b - a) + 6 * u * t * (c - b) + 3 * t * t * (d - c)

  const [p0, p1, p2, p3] = curve
  return {
    x: n(at(p0[0], p1[0], p2[0], p3[0])),
    y: n(at(p0[1], p1[1], p2[1], p3[1])),
    angle: n(
      (Math.atan2(slope(p0[0], p1[0], p2[0], p3[0]), -slope(p0[1], p1[1], p2[1], p3[1])) * 180) /
        Math.PI
    ),
  }
}

/** Punto y ángulo tangente sobre un arco de círculo (φ=0 arriba, en grados). */
export const arcAt = (cx: number, cy: number, radius: number, phi: number) => {
  const r = (phi * Math.PI) / 180
  return {
    x: n(cx + radius * Math.sin(r)),
    y: n(cy - radius * Math.cos(r)),
    angle: n((Math.atan2(-Math.cos(r), Math.sin(r)) * 180) / Math.PI),
  }
}

/**
 * Escalonado de la brisa, para el `<g className="nh-sway">`. Duración y desfase
 * distintos por hoja: si compartieran timing la rama se movería en bloque.
 */
export const breeze = (i: number) =>
  ({
    '--nh-dur': `${(4.4 + (i % 4) * 0.6).toFixed(1)}s`,
    '--nh-off': `-${((i % 7) * 0.42).toFixed(2)}s`,
  }) as CSSProperties

/** Escalonado del brote, para el `<path className="nh-leaf">`. */
export const sprout = (i: number) =>
  ({ animationDelay: `${(0.35 + i * 0.05).toFixed(2)}s` }) as CSSProperties
