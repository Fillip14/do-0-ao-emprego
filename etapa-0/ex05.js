//CHECKLIST
// - Nome funcao: validarSenha(senha)
// - Retorna:
//      - objeto {valida: boolean, erros: string[]}
// - Regras:
//  - minimo 8 caracteres
//  - 1 numero
//  - 1 letra maiúscula
//  - erros: o que faltou e vazio se estiver ok

const validarSenha = (senha) => {
  const password = senha.toString();
  let valida = true;
  let onenumber = false;
  let erros = [];

  if (password.length < 8) erros.push('minimo 8 caracteres');

  for (let i = 0; i < password.length; i++)
    if ('0123456789'.includes(password[i])) onenumber = true;

  if (!onenumber) erros.push('minimo 1 numero');

  if (password === password.toLowerCase()) erros.push('minimo 1 letra maiuscula');

  if (erros.length !== 0) valida = false;

  return { valida, erros };
};

module.exports = { validarSenha };
