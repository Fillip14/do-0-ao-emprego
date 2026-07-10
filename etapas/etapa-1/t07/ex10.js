// fn: countWords(phrase)
// return: array de pares `[word, count]`
// ordenado da mais frequente para a menos.

const countWords = (phrase) => {
  if (typeof phrase !== 'string') return null;

  const phraseToLower = phrase.toLowerCase();
  const phraseTrim = phraseToLower.trim();
  const phraseSplit = phraseTrim.split(' ');
  const counts = {};

  for (const word of phraseSplit) {
    if (word === '') continue;
    if (counts[word] >= 1) ++counts[word];
    else counts[word] = 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
};

module.exports = { countWords };
