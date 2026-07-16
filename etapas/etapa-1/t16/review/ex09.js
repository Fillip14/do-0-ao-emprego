const gradeStats = (grades) => {
  if (!Array.isArray(grades) || grades.length === 0) return null;

  const sorted = [...grades].sort((a, b) => b - a);
  const sum = sorted.reduce((acc, grade) => {
    acc = acc + grade;
    return acc;
  }, 0);

  const highest = sorted[0];
  const lowest = sorted.at(-1);

  // const highest = sorted.reduce((high, grade) => {
  //   if (high === 0) return grade;
  //   if (grade > high) return grade;
  //   return high;
  // }, 0);

  // const lowest = sorted.reduce((low, grade) => {
  //   if (low === 0) return grade;
  //   if (grade > low) return low;
  //   return grade;
  // }, 0);

  const approved = sorted.filter((grade) => grade >= 7).length;

  const average = sum / sorted.length;

  return { average, highest, lowest, approved };
};

module.exports = { gradeStats };
