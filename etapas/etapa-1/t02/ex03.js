// function: createCounter()
// return: a cada chamada retorna 1, 2, 3.
// Dois contadores criados separadamente não se misturam

//como eu faria antes de conhecer closure
// let countBefore = 0;
// const createCounterBefore = () => {
//   countBefore = countBefore + 1;
//   return countBefore;
// };
// console.log(createCounterBefore());
// console.log(createCounterBefore());
// countBefore = 0;
// console.log(createCounterBefore());

//conhecendo closure
const createCounter = () => {
  let count = 0;
  return () => ++count;
};

module.exports = { createCounter };
