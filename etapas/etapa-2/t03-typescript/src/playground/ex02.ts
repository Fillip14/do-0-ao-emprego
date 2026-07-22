let a = 10;
const b = 'Oi';
let c = [];
let d = null;
const e = 20;
let x: number;

// @ts-expect-error
a = 'Oi'; // O tipo 'string' não pode ser atribuído ao tipo 'number'. ts 2322
// @ts-expect-error
c = 42; // O tipo 'number' não pode ser atribuído ao tipo 'any[]'. ts 2322
d = 0; // Quando declarado como null, depois que passa o 0 pra ele ele vira number
// @ts-expect-error
e = e + 20; // Não é possível atribuir a 'e' porque é uma constante. ts 2588

let f = 'todo'; // let f: string
const g = 'todo'; // const g: "todo"

const raw = '{"title":"comprar pão"}';
const viaAny: any = JSON.parse(raw);
const viaUnknown: unknown = JSON.parse(raw);

viaAny.nada.nada; // Passa limpo
viaUnknown.nada.nada; // 'viaUnknown' é do tipo 'desconhecido'. ts 18046
