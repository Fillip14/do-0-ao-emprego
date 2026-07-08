//CHECKLIST
// - Nome funcao: contarVogais(texto)
// - Retorna:
//  - quantidade de vogais(numero) (maisculas contam)
//  - String vazia retorna 0

const contarVogais = (texto) => {
  let counter = 0;
  for (let i = 0; i < texto.length; i++) if ('aeiou'.includes(texto[i].toLowerCase())) counter++;
  return counter;
};

console.log(contarVogais('banana')); // esperado: 3
console.log(contarVogais('banana')); // esperado: 3
console.log(contarVogais('BANANA')); // esperado: 3
console.log(contarVogais('')); // esperado: 0
