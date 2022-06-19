export const niceColors = [
  '#50FA7B', 
  '#C778DD', 
  '#62AEEF', 
  '#FF6E6E', 
  '#A7B7D6', 
  '#F1FA8C', 
];

export function getRandomNiceColor() {
  return niceColors[Math.floor(Math.random() * niceColors.length)];
}
