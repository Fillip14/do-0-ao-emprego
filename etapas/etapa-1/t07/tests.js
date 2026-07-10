const assert = require('node:assert');
const { countWords } = require('./ex10');
const { topScorers, totalByTeam, teamRanking, oldestPlayer } = require('./drill');

const phrase = 'o rato roeu a roupa do rei de roma e o rei nao gostou';
const name = 'ana de  ana';
const nameTwo = 'Ana de  ana';
const empty = '';
const notObject = [];
const number = 48;

const players = [
  { name: 'Ana', team: 'red', score: 12, age: 22 },
  { name: 'Bruno', team: 'blue', score: 7, age: 31 },
  { name: 'Carla', team: 'red', score: 15, age: 27 },
  { name: 'Davi', team: 'blue', score: 15, age: 19 },
  { name: 'Elisa', team: 'green', score: 3, age: 45 },
];
const notArray = {};
const emptyArray = [];

assert.deepStrictEqual(topScorers(players, 8), ['Carla', 'Davi', 'Ana']);
assert.deepStrictEqual(players, [
  { name: 'Ana', team: 'red', score: 12, age: 22 },
  { name: 'Bruno', team: 'blue', score: 7, age: 31 },
  { name: 'Carla', team: 'red', score: 15, age: 27 },
  { name: 'Davi', team: 'blue', score: 15, age: 19 },
  { name: 'Elisa', team: 'green', score: 3, age: 45 },
]);
assert.deepStrictEqual(topScorers(players, 15), ['Carla', 'Davi']);
assert.deepStrictEqual(topScorers(notArray, 8), null);
assert.deepStrictEqual(topScorers(emptyArray, 8), null);

assert.deepStrictEqual(totalByTeam(players), { red: 27, blue: 22, green: 3 });
assert.deepStrictEqual(teamRanking(players), [
  ['red', 27],
  ['blue', 22],
  ['green', 3],
]);
assert.deepStrictEqual(oldestPlayer(players), { name: 'Elisa', age: 45 });

assert.deepStrictEqual(countWords(phrase), [
  ['o', 2],
  ['rei', 2],
  ['rato', 1],
  ['roeu', 1],
  ['a', 1],
  ['roupa', 1],
  ['do', 1],
  ['de', 1],
  ['roma', 1],
  ['e', 1],
  ['nao', 1],
  ['gostou', 1],
]);

assert.deepStrictEqual(countWords(name), [
  ['ana', 2],
  ['de', 1],
]);

assert.deepStrictEqual(countWords(nameTwo), [
  ['ana', 2],
  ['de', 1],
]);

assert.deepStrictEqual(countWords(empty), []);
assert.deepStrictEqual(countWords(notObject), null);
assert.deepStrictEqual(countWords(number), null);

console.log('Todos os testes passaram!');
