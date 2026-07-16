const createCounter = () => {
  let count = 0;

  return () => {
    return ++count;
  };
};

module.exports = { createCounter };
