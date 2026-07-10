// fn: gradeStats(grades)
// return:
//  -   { average, highest, lowest, approved }
//  -   (aprovado ≥ 7) usando reduce/filter.
//  -   Lista vazia retorna `null`. Ordene as notas da maior para a menor.
// const grades = [8, 4, 10, 6.5];

const gradeStats = (grades) => {
  if (!Array.isArray(grades) || grades.length === 0) return null;

  const sorted = [...grades].sort((a, b) => b - a);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];
  const average = grades.reduce((acc, n) => acc + n, 0) / grades.length;
  const approved = grades.filter((n) => n >= 7).length;

  return { average, highest, lowest, approved };
};

module.exports = { gradeStats };
