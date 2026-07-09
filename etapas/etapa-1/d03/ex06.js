// refazer o validador de senha do ex 0.5 usando regex
//CHECKLIST
// - Nome funcao: validatePassword (senha)
// - Retorna:
//      - objeto {valid: boolean, errors: string[]}
// - Regras:
//  - minimo 8 caracteres
//  - 1 numero
//  - 1 letra maiúscula
//  - errors: o que faltou e vazio se estiver ok

const validatePassword = (password) => {
  let errors = [];
  let valid = true;

  if (password.length < 8) errors.push('minimo 8 caracteres');
  if (!/\d/.test(password)) errors.push('minimo 1 numero');
  if (!/[A-Z]/.test(password)) errors.push('minimo 1 letra maiuscula');

  if (errors.length !== 0) valid = false;

  return { valid, errors };
};

module.exports = { validatePassword };
