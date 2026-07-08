// function: getType(value)
// return: number, string, boolean, null, undefined, array ou object

const getType = (value) => {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';

  return typeof value;
};

module.exports = { getType };
