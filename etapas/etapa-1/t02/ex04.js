// function: applyToEach(fn, list)
// return: lista com fn aplicada a cada item, sem usar .map (loop manual
// Teste: duas funções diferentes.

const triple = (n) => n * 3;
const toUpper = (text) => text.toUpperCase();

const applyToEach = (fn, list) => {
  if (!Array.isArray(list)) return null;

  const newList = [];
  for (const item of list) {
    newList.push(fn(item));
  }
  return newList;
};

module.exports = { applyToEach, triple, toUpper };
