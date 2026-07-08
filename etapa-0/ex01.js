//CHECKLIST
// - Nome funcao: classificarIdade(idade)
// - Retorna:
//      - Crianca se idade < 12
//      - Adolescente se idade >= 12 e <= 17
//      - Adulto se idade >= 18
//      - null se idade < 0

const classificarIdade = (idade) => {
  if (idade < 0) return null;
  if (idade < 12) return 'criança';
  if (idade >= 12 && idade <= 17) return 'adolescente';
  if (idade >= 18) return 'adulto';
};

if (require.main === module) {
  console.log(classificarIdade(-1)); // esperado null
  console.log(classificarIdade(11)); // esperado criança
  console.log(classificarIdade(12)); // esperado adolescente
  console.log(classificarIdade(17)); // esperado adolescente
  console.log(classificarIdade(18)); // esperado adulto
  console.log(classificarIdade(19)); // esperado adulto
}

module.exports = { classificarIdade };
