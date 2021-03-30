function kumarHassebrook(a, b) {
  var ii = a.length;
  var p = 0;
  var p2 = 0;
  var q2 = 0;
  for (var i = 0; i < ii; i++) {
    p += a[i] * b[i];
    p2 += a[i] * a[i];
    q2 += b[i] * b[i];
  }
  return p / (p2 + q2 - p);
}

function mean(a) {
  let total = a.reduce((acc, val) => (acc += val), 0);
  return total / a.length;
}
export function pearson(a, b) {
  var avgA = mean(a);
  var avgB = mean(b);

  var newA = new Array(a.length);
  var newB = new Array(b.length);
  for (var i = 0; i < newA.length; i++) {
    newA[i] = a[i] - avgA;
    newB[i] = b[i] - avgB;
  }

  return kumarHassebrook(newA, newB);
}

export const generateCode = () => {
  const str = "qwertyuioplkjhgfdsazxcvbnm1234567890QAZXSWEDCVFRTGBNHYUJMKILOP";
  let genStr = "";
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * str.length);
    genStr += str[randomIndex];
  }
  return genStr;
};

export const convertMS = (ms) => {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  let date = "";
  if (d != 0) {
    date += d + " days, ";
    return date;
  }
  if (h != 0) {
    date += h + " hours, ";
  }
  if (m != 0) {
    date += m + " minutes, ";
  }
  if (s != 0) {
    date += s + " seconds ";
  }

  return date;
};

const partition = (arr, start, end) => {
  let p = arr[end].elapsedTime;
  let pIndex = start;
  for (let i = start; i < end; i++) {
    if (arr[i].elapsedTime <= p) {
      let temp = arr[i];
      arr[i] = arr[pIndex];
      arr[pIndex] = temp;
      pIndex++;
    }
  }
  let temp = arr[pIndex];
  arr[pIndex] = arr[end];
  arr[end] = temp;
  return pIndex;
};

export const quickSort = (arr, start, end) => {
  if (start >= end) return;

  let index = partition(arr, start, end);
  quickSort(arr, start, index - 1);
  quickSort(arr, index + 1, end);
  return arr;
};

const cosineSimilar = (A, B) => {
  var dotproduct = 0;
  var mA = 0;
  var mB = 0;
  for (let i = 0; i < A.length; i++) {
    dotproduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  var similarity = dotproduct / (mA * mB);
  return similarity;
};
