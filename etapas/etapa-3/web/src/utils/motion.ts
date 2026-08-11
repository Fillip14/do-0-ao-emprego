// Tokens de movimento do app (T14, decisão 5). Duração em SEGUNDOS — é o que o
// Motion espera; no CSS os mesmos valores são em ms.

export const duration = {
  tap: 0.1,
  fast: 0.15,
  base: 0.2,
} as const;

export const easing = {
  enter: 'easeOut',
  exit: 'easeIn',
} as const;

export const enterTransition = { duration: duration.base, ease: easing.enter };
export const exitTransition = { duration: duration.fast, ease: easing.exit };
export const layoutTransition = { duration: duration.base, ease: easing.enter };
