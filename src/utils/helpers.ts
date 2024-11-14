// export const capitalize = (value: any) => {
//   // const stringify = String(value);
//   // console.log(stringify);
//   if (typeof value === 'string' && value.length > 0) {
//     return value
//       .split(/[\s_]+/) // Split by any whitespace (\s) or underscore (_)
//       .map(
//         (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
//       )
//       .join(' ');
//   }
//   return '';
// };
export const capitalize = (value: any) => {
  // Return empty string for non-string inputs or empty strings
  if (typeof value !== 'string' || value.trim().length === 0) {
    return '';
  }

  // Regular expression to check if a string contains any Arabic characters
  const containsArabic = /[\u0600-\u06FF]/;

  return value
    .split(/[\s_]+/) // Split by any whitespace or underscore
    .map((word) => {
      // Check if the word contains any Arabic characters
      if (containsArabic.test(word)) {
        return word; // Return the word as-is if it contains Arabic characters
      }

      // Handle special characters by checking if the word contains letters
      const hasAlphabeticChar = /[a-zA-Z]/.test(word);
      if (hasAlphabeticChar) {
        // Capitalize the first alphabetic character and keep the rest as is
        const firstChar = word[0].toUpperCase();
        const rest = word.slice(1);
        return firstChar + rest;
      }

      return word; // Return the word as-is if it contains no letters
    })
    .join(' '); // Join the words back into a string
};

export function truncateSentence(sentence: string, length: number) {
  if (sentence.length > length) {
    return sentence.slice(0, length - 3) + '...'; // Keep 252 characters and add "..."
  }
  return sentence; // Return the original sentence if it's within the limit
}

export function formatForGraphQL(input: any) {
  if (typeof input !== 'string') {
    console.error('Input must be a string');
    console.error(input);
    return '';
  }

  // Use JSON.stringify to automatically escape special characters
  // return JSON.stringify(input).slice(1, -1); // Remove surrounding quotes

  return input
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/"/g, '\\"') // Escape double quotes
    .replace(/'/g, "\\'") // Escape single quotes
    .replace(/\n/g, '\\n') // Escape newlines
    .replace(/\r/g, '\\r') // Escape carriage returns
    .replace(/\t/g, '\\t') // Escape tabs
    .replace(/\f/g, '\\f') // Escape form feeds
    .replace(/\b/g, '\\b'); // Escape backspaces
}
