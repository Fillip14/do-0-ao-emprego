const players = [
  { name: 'Ana', team: 'red', score: 12, age: 22 },
  { name: 'Bruno', team: 'blue', score: 7, age: 31 },
  { name: 'Carla', team: 'red', score: 15, age: 27 },
  { name: 'Davi', team: 'blue', score: 15, age: 19 },
  { name: 'Elisa', team: 'green', score: 3, age: 45 },
];

const topScorers = (players, min) => {
  if (!Array.isArray(players) || players.length === 0) return null;

  return [...players]
    .filter((player) => player.score >= min)
    .sort((a, b) => b.score - a.score)
    .map((player) => player.name);
};

const totalByTeam = (players) => {
  if (!Array.isArray(players) || players.length === 0) return null;

  return players.reduce((acc, player) => {
    acc[player.team] = (acc[player.team] || 0) + player.score;
    return acc;
  }, {});
};

const teamRanking = (players) => {
  if (!Array.isArray(players) || players.length === 0) return null;
  const teams = Object.entries(totalByTeam(players)).sort((a, b) => b[1] - a[1]);
  return teams;
};

const oldestPlayer = (players) => {
  if (!Array.isArray(players) || players.length === 0) return null;
  const playersSorted = [...players].sort((a, b) => b.age - a.age);

  return { name: playersSorted[0].name, age: playersSorted[0].age };
};

// console.log(topScorers(players, 8));
// console.log(totalByTeam(players));
// console.log(teamRanking(players));
// console.log(oldestPlayer(players));

module.exports = { topScorers, totalByTeam, teamRanking, oldestPlayer };
