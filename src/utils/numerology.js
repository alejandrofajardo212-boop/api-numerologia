// Reducción básica a 1 solo dígito o número maestro (11, 22, 33)
const reduceNumber = (num, allowMaster = true) => {
  if (allowMaster && [11, 22, 33].includes(num)) return num;
  while (num > 9) {
    if (allowMaster && [11, 22, 33].includes(num)) return num;
    num = num.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return num;
};

// Tabla Pitagórica
const letterValues = {
  a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
  j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
  s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
};

// 1. Camino de Vida (Fecha de nacimiento)
export const calculateLifePath = (birthDateString) => {
  const date = new Date(birthDateString);
  const day = reduceNumber(date.getUTCDate());
  const month = reduceNumber(date.getUTCMonth() + 1);
  const year = reduceNumber(date.getUTCFullYear());
  
  return reduceNumber(day + month + year);
};

// 2. Número de Expresión (Todas las letras del nombre completo)
export const calculateExpression = (fullName) => {
  const cleanName = fullName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  let sum = 0;
  for (let char of cleanName) {
    sum += letterValues[char] || 0;
  }
  return reduceNumber(sum);
};

// 3. Número de Alma (Solo las vocales del nombre completo)
export const calculateSoulUrge = (fullName) => {
  const cleanName = fullName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let sum = 0;
  for (let char of cleanName) {
    if (vowels.includes(char)) {
      sum += letterValues[char] || 0;
    }
  }
  return reduceNumber(sum);
};