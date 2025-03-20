function generateRandomNumbers(d, n=10, vmin=null, vmax=null) {
  const numbers = [];
  // 如果未传入 vmin 和 vmax，则根据位数 d 计算默认的最小值和最大值
  if (vmin === null && vmax === null) {
      vmin = Math.pow(10, d - 1);
      vmax = Math.pow(10, d) - 1;
  }

  for (let i = 0; i < n; i++) {
      // 生成一个介于 vmin 和 vmax 之间的随机整数
      const randomNum = Math.floor(Math.random() * (vmax - vmin + 1)) + vmin;
      numbers.push(randomNum);
  }

  return numbers;
}

// 示例调用
// 不传入 vmin 和 vmax，使用默认行为
const result1 = generateRandomNumbers(5, 3);
console.log(result1);

// 传入 vmin 和 vmax，指定元素范围
const result2 = generateRandomNumbers(5, 3, 200, 500);
console.log(result2);
