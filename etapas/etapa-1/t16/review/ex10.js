const countWords = (phrase) => {
  if (phrase.trim() === '') return null;
  const phraseSplit = phrase.split(' ');

  const listWords = phraseSplit.reduce((count, word) => {
    count[word] = (count[word] || 0) + 1;
    return count;
  }, {});

  const listSort = Object.entries(listWords).sort((a, b) => b[1] - a[1]);
  return listSort;
};

module.exports = { countWords };
