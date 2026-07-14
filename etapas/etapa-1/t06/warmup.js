// chekclist
// 6 one-liners
// escrever a previsao de retorno

const users = [
  { name: 'Ana', age: 28, active: true },
  { name: 'Bruno', age: 17, active: false },
  { name: 'Carla', age: 35, active: true },
  { name: 'Diego', age: 17, active: true },
];

const names = (list) => list.map((n) => n.name);

const active = (list) => list.filter((n) => n.active);

const age = (list) => list.find((n) => n.age === 17);

const underAge = (list) => list.some((n) => n.age < 18);

const allActive = (list) => list.every((n) => n.active);

const printName = (list) => list.forEach((n) => console.log(`Nome: ${n.name}`));

console.log(names(users)); //[ 'Ana', 'Bruno', 'Carla', 'Diego' ]
console.log(active(users)); //[ { name: 'Ana', age: 28, active: true },
// { name: 'Carla', age: 35, active: true }, { name: 'Diego', age: 17, active: true } ]
console.log(age(users)); //{ name: 'Bruno', age: 17, active: false }
console.log(underAge(users)); //true
console.log(allActive(users)); //false
console.log(printName(users)); // undefined - console.log interno imprimido os valores
