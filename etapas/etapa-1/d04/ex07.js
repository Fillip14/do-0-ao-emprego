// fn: copyWithoutLast(list)
// return: cópia sem o último item, SEM alterar a original (teste que a original não mudou).

//MUTAM (push, pop, unshift, shift, splice)
const usePush = (item) => {
  const newArray = ['texto1', 'texto2'];

  return newArray.push(item);
};

const usePop = () => {
  const newArray = ['texto1', 'texto2'];
  return newArray.pop();
};

const useUnshift = (item) => {
  const newArray = ['texto1', 'texto2'];

  return newArray.unshift(item);
};

const useShift = () => {
  const newArray = ['texto1', 'texto2'];

  return newArray.shift();
};

const useSplice = (s, e) => {
  const newArray = ['texto1', 'texto2'];

  return newArray.splice(s, e);
};

const useReference = (item) => {
  const newArray = item;
  newArray.push('a');

  return item;
};

//copiam (slice, rest, spread)
const useSlice = (s, e) => {
  const newArray = ['texto1', 'texto2', 'texto3'];

  return newArray.slice(s, e);
};

const useRest = (...item) => {
  return item;
};

const useSpread = (item) => {
  const newArray = [...item];

  return newArray;
};

const useCopy = (item) => {
  const newArray = [...item];
  item = ['a', 'b'];

  return newArray;
};

const copyWithoutLast = (list) => {
  if (!Array.isArray(list)) return null;
  const newArray = [...list];
  newArray.pop();
  return newArray;
};

// console.log(usePush('texto3')); // ["texto1", "texto2", "texto3"]
// console.log(usePop()); // ["texto2"]
// console.log(useUnshift('texto3')); // ["texto3", "texto1", "texto2"]
// console.log(useShift()); // ["texto1"]
// console.log(useSplice(0, 2)); // []
// console.log(useReference(['texto1'])); // ["texto1", "a"]

// console.log(useSlice(1, 2)); // ['texto1', 'texto2']
// console.log(useRest('texto1', 'texto2', 'texto3')); // ['texto1', 'texto2', 'texto3']
// console.log(useSpread(['texto1', 'texto2', 'texto3'])); // ['texto1', 'texto2', 'texto3']
// console.log(useCopy(['texto1', 'texto2', 'texto3'])); // ['texto1', 'texto2', 'texto3']

// console.log(copyWithoutLast(['texto1', 'texto2', 'texto3']));

module.exports = {
  usePush,
  usePop,
  useUnshift,
  useShift,
  useSplice,
  useReference,
  useSlice,
  useRest,
  useSpread,
  useCopy,
  copyWithoutLast,
};
