const assert = require('node:assert');
const {
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
} = require('./ex07');

assert.deepStrictEqual(usePush('texto3'), 3); // ["texto1", "texto2", "texto3"]
assert.deepStrictEqual(usePop(), 'texto2'); // ["texto2"]
assert.deepStrictEqual(useUnshift('texto3'), 3); // ["texto3", "texto1", "texto2"]
assert.deepStrictEqual(useShift(), 'texto1'); // ["texto1"]
assert.deepStrictEqual(useSplice(0, 2), ['texto1', 'texto2']); // []
assert.deepStrictEqual(useReference(['texto1']), ['texto1', 'a']); // ["texto1", "a"]

assert.deepStrictEqual(useSlice(1, 2), ['texto2']); // ['texto1', 'texto2']
assert.deepStrictEqual(useRest('texto1', 'texto2', 'texto3'), ['texto1', 'texto2', 'texto3']); // ['texto1', 'texto2', 'texto3']
assert.deepStrictEqual(useSpread(['texto1', 'texto2', 'texto3']), ['texto1', 'texto2', 'texto3']); // ['texto1', 'texto2', 'texto3']
assert.deepStrictEqual(useCopy(['texto1', 'texto2', 'texto3']), ['texto1', 'texto2', 'texto3']); // ['texto1', 'texto2', 'texto3']

const item = ['texto1', 'texto2', 'texto3'];
assert.deepStrictEqual(copyWithoutLast(item), ['texto1', 'texto2']);
assert.deepStrictEqual(item, ['texto1', 'texto2', 'texto3']);
assert.deepStrictEqual(copyWithoutLast('a'), null);

console.log('Todos os testes passaram!');
