export const capitalize = (value: any) => {
  // const stringify = String(value);
  // console.log(stringify);
  if (typeof value === 'string' && value.length > 0) {
    return value
      .split(/[\s_]+/) // Split by any whitespace (\s) or underscore (_)
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
