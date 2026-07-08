//CHECKLIST
// - Nome funcao: dentroDoIntervalo(n, min, max)
// - Retorna:
//      - true se n estiver entre min e max INCLUSIVE
//      - false nos outros casos
// - Testes:
//  - Todos testes que fiz testam fronteiras

const dentroDoIntervalo = (n, min, max) => n >= min && n <= max;

console.log(dentroDoIntervalo(7, 6, 10)); // esperado true
console.log(dentroDoIntervalo(6, 6, 10)); // esperado true
console.log(dentroDoIntervalo(10, 6, 10)); // esperado true
console.log(dentroDoIntervalo(6.1, 6, 10)); // esperado true
console.log(dentroDoIntervalo(9.9, 6, 10)); // esperado true
console.log(dentroDoIntervalo(5.9, 6, 10)); // esperado false
console.log(dentroDoIntervalo(10.1, 6, 10)); // esperado false
