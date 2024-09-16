export const capitalize = (value: any) => {
  if (typeof value === 'string') {
    return value
      .split(' ')
      .map(
        (word) => word[0].toUpperCase + word.slice(1).toLowerCase()
      )
      .join(' ');
  }
  return '';
};
