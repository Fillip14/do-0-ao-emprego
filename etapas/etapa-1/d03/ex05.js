// function: formatName(name)
// name = "  joão da SILVA "
// return: "João Da Silva".

const formatName = (name) => {
  const nameToLower = name.toLowerCase();
  const nameTrim = nameToLower.trim();
  const nameSplit = nameTrim.split(' ');
  let nameCamelCase = '';

  for (let i = 0; i < nameSplit.length; i++) {
    if (nameSplit[i] === '') continue;

    let firstUpperCase = nameCamelCase + nameSplit[i][0].toUpperCase();
    nameCamelCase = firstUpperCase + nameSplit[i].slice(1);

    if (i !== nameSplit.length - 1) nameCamelCase = nameCamelCase + ' ';
  }

  return nameCamelCase;
};

module.exports = { formatName };
