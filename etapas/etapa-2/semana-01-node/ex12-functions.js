const DEFAULT_PORT = 3000;
const MAX_PORT = 65535;

export const parsePort = (value) => {
  const port = Number(value);

  if (!Number.isInteger(port)) return DEFAULT_PORT;
  if (port < 1 || port > MAX_PORT) return DEFAULT_PORT;

  return port;
};

export const slugify = (value) => {
  if (typeof value !== 'string') throw new TypeError('value must be a string');

  const slug = value
    .trim()
    .toLowerCase()
    .normalize('NFD') // separa a letra do acento
    .replace(/[̀-ͯ]/g, '') // remove os acentos soltos
    .replace(/[^a-z0-9\s-]/g, '') // remove pontuação
    .replace(/\s+/g, '-'); // espaços (1 ou mais) viram um hífen

  if (slug === '') throw new Error('slug cannot be empty');

  return slug;
};
