console.log("[debug minimal-chrome-extension]");
// const list = document.getElementsByTagName("h1");
// //   console.log(list);
// for (let i = 0; i < list.length; i++) {
//   const item = list[i];
//   item.innerText = item.innerText + "@插件";
// }
window.onload = () => {
  const list = document.getElementsByTagName("h1");
  //   console.log(list);
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    item.innerText = item.innerText + "@插件";
  }
};
