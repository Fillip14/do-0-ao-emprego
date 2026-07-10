const assert = require('node:assert');
const { gradeStats } = require('./ex09');

const original = [8, 4, 10, 6.5];
const gradesOne = [4, 4, 7, 7.1];
const emptyGrades = [];
const notArray = {};

gradeStats(original);
assert.deepStrictEqual(original, [8, 4, 10, 6.5]);

assert.deepStrictEqual(gradeStats(original), {
  average: 7.125,
  highest: 10,
  lowest: 4,
  approved: 2,
});
assert.deepStrictEqual(gradeStats(gradesOne), {
  average: 5.525,
  highest: 7.1,
  lowest: 4,
  approved: 2,
});
assert.deepStrictEqual(gradeStats(emptyGrades), null);
assert.deepStrictEqual(gradeStats(notArray), null);

console.log('Todos os testes passaram!');
