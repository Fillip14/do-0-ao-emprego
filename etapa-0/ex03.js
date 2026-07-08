//CHECKLIST
// - Nome funcao: aprovado(nota)
// - Retorna:
//      - true se nota >= 7
//      - false nos outros casos
// - Testes:
//  - Teste 7 porque está na fronteira
//  - Testei 6.9 e 7.1 porque estão nos limites da fronteira

const aprovado = (nota) => nota >= 7;

console.log(aprovado(7)); // esperado true
console.log(aprovado(6.9)); // esperado false
console.log(aprovado(7.1)); // esperado true
