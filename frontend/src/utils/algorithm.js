//Noel Gregory
//2021-03-30
//This file has function for similarity of images and sorting

//This function will check the similarity between two images
//a:Array:image array of first image
//b:Array:image array of second image
//return:Float:contains similarity rate
function kumarHassebrook(a, b) {
  var ii = a.length;
  var p = 0;
  var p2 = 0;
  var q2 = 0;
  for (let i = 0; i < ii; i++) {
    p += a[i] * b[i];
    p2 += a[i] * a[i];
    q2 += b[i] * b[i];
  } //end for i
  return p / (p2 + q2 - p);
} //end kumarHassebrook

//This function will calculate the mean of an array
//a:Array:this contains the image array
//return:Flaot:contains the mean value of array
function mean(a) {
  let total = a.reduce((acc, val) => (acc += val), 0);
  return total / a.length;
} //end mean

//This function will normalize the images and get similarity
//a:Array:image array of first image
//b:Array:image array of second image
//return:Float:contains similarity rate
export function pearson(a, b) {
  var avgA = mean(a); //mean of array a
  var avgB = mean(b); //mean of array b

  var newA = new Array(a.length);
  var newB = new Array(b.length);
  for (var i = 0; i < newA.length; i++) {
    newA[i] = a[i] - avgA;
    newB[i] = b[i] - avgB;
  } //end for i

  return kumarHassebrook(newA, newB);
}

//This function generates a random code
//returnLString:random code
export const generateCode = () => {
  const str = "qwertyuioplkjhgfdsazxcvbnm1234567890QAZXSWEDCVFRTGBNHYUJMKILOP";
  let genStr = "";
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * str.length);
    genStr += str[randomIndex];
  } //end for i
  return genStr;
}; //end generateCode

//This function will convert ms to date
//ms:Integer:contains ms of date
//return:String:date in formated string
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
  } //end if d
  if (h != 0) {
    date += h + " hours, ";
  } //end if h
  if (m != 0) {
    date += m + " minutes, ";
  } //end if m
  if (s != 0) {
    date += s + " seconds ";
  } //end if s

  return date;
}; //end convertMS

//This function will partition the array
//arr:Array:contains the array
//start:Intger:start index
//end:Integer:contains end index
//return:Integer:contains the pivot index
const partition = (arr, start, end) => {
  let p = arr[end].elapsedTime;
  let pIndex = start;
  for (let i = start; i < end; i++) {
    if (arr[i].elapsedTime <= p) {
      let temp = arr[i];
      arr[i] = arr[pIndex];
      arr[pIndex] = temp;
      pIndex++;
    } //end if arr[i].elapsedTime
  } //end for i
  let temp = arr[pIndex];
  arr[pIndex] = arr[end];
  arr[end] = temp;
  return pIndex;
}; //end partition

//This function will run quicksort on array
//arr:Array:contains the array
//start:Intger:start index
//end:Integer:contains end index
//return:Array:sorted array
export const quickSort = (arr, start, end) => {
  if (start >= end) return; //end start

  let index = partition(arr, start, end);
  quickSort(arr, start, index - 1);
  quickSort(arr, index + 1, end);
  return arr;
}; //end quickSort
