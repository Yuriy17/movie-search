export function shuffle(arr) {
  let j;
  let temp;
  const newArr = [...arr];
  try {
    for (let i = newArr.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = newArr[j];
      newArr[j] = newArr[i];
      newArr[i] = temp;
    }
  } catch (e) {
    console.log(`Can't shuffle array \n ${e}`);
  }

  return newArr;
}
