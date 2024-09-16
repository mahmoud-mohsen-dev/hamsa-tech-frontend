export const capitalize = (value: any) => {
  const stringify = String(value);
  console.log(stringify);
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
