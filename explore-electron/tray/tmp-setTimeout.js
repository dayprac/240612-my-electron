let a = {
  i: 0,
};

setTimeout(() => {
  a.i = 1;
}, 1000);

console.log(a);
setTimeout(() => {
  console.log(a);
}, 3000);
