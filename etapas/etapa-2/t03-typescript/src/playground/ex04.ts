const fnSelectValue = (value: string | number) => {
  //  @ts-expect-error
  // value: string | number
  let upper = value.toUpperCase(); // A propriedade 'toUpperCase' não existe no tipo 'string | number'. A propriedade 'toUpperCase' não existe no tipo 'number'.

  if (typeof value === 'string') {
    return value.toUpperCase(); // value: string
  }

  console.log(value); // value: number
};

const fnSelectArray = (value: string[] | string) => {
  //  @ts-expect-error
  // value: string | string[]
  let upper = value.toUpperCase(); // A propriedade 'toUpperCase' não existe no tipo 'string | string[]'. A propriedade 'toUpperCase' não existe no tipo 'string[]'.
  if (Array.isArray(value)) {
    return value; // value: string[]
  }

  console.log(value); // value: string
};

type A = { kind: string };
type B = { size: number };

const select = (value: A | B) => {
  if (typeof value === 'object') return value; // Continua value A | B
};
