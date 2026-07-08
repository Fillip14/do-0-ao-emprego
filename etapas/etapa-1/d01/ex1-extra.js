// function: safeNumber(text: string)
// return: numero correspondente ou null se a conversao nao for possivel

const safeNumber = (text) => {
  const converted = Number(text);

  if (
    (typeof text === 'string' && converted === 0 && !text.includes(converted)) ||
    Number.isNaN(converted)
  )
    return null;
  return converted;
};

module.exports = { safeNumber };
