export const capitalize = (value: any) => {
  const stringify = String(value);
  // console.log(stringify);
  if (typeof stringify === 'string') {
    return stringify
      .split(' ')
      .map(
        (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  }
  return '';
};

export function truncateSentence(sentence: string, length: number) {
  if (sentence.length > length) {
    return sentence.slice(0, length - 3) + '...'; // Keep 252 characters and add "..."
  }
  return sentence; // Return the original sentence if it's within the limit
}
