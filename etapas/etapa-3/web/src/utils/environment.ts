const apiUrl = import.meta.env.VITE_API_URL ?? '';

export const isShowcase =
  import.meta.env.PROD && /^https?:\/\/(localhost|127\.0\.0\.1)/.test(apiUrl);
