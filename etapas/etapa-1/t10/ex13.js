// A > C > B nesta sequencia
// console.log('A');
// setTimeout(() => console.log('B'), 0);
// console.log('C');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (require.main === module) {
  wait(0)
    .then(() => {
      console.log(1);
      return wait(1000);
    })
    .then(() => {
      console.log(2);
      return wait(1000);
    })
    .then(() => {
      console.log(3);
      return wait(1000);
    })
    .then(() => {
      console.log('done');
    });
}
module.exports = { wait };
