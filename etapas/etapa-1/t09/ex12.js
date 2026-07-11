// checklist
// fn: parseAge(text)
// return: number int >=0

const parseAge = (text) => {
  const age = Number(text);

  if (Number.isNaN(age) || (typeof text === 'string' && text.trim() === ''))
    throw new Error('invalid age: not a number');

  if (age < 0) throw new Error('invalid age: negative');

  if (!Number.isInteger(age)) throw new Error('invalid age: not an integer');

  return age;
};

module.exports = { parseAge };
