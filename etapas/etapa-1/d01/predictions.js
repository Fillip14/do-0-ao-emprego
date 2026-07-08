console.log('1' + 1); // 2 > 11
console.log('1' - 1); // 0 > 0
console.log(null == undefined); // false > true
console.log([] + []); // [] > ""
console.log(1 == true); // true > true
console.log(0 == false); // true > true
console.log({} == null); // true > false
console.log('1' == 1); // true > true
console.log(true == 1 + 1); // true > false
console.log(null == {}); // true > false
console.log(null - {}); // null > NaN
console.log(null - undefined); // null > NaN
console.log(undefined - 1); // 1 > NaN
console.log([] - 1); // [] > -1
console.log({} + 1); // {} > [object Object]1
