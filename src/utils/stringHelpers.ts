export function isArabic(text: string | null) {
  // Regular expression to check for Arabic characters
  const arabicRegex = /[\u0600-\u06FF]/;
  return typeof text === 'string' && arabicRegex.test(text);
}

export function reverseArabicWords(sentence: string | null): string {
  // Check if the input is a valid string and contains Arabic characters
  if (typeof sentence === 'string' && isArabic(sentence)) {
    // Split the sentence into words and reverse the order
    return sentence
      .trim() // Trim leading and trailing whitespace
      .split(/\s+/) // Split by whitespace
      .reverse() // Reverse the array of words
      .join(' '); // Join back into a string
  }

  // Return the original input if it doesn't contain Arabic or if it's null
  return sentence ?? '';
}

// const arabicSentence = "محسن محمود";
// const englishSentence = "John Doe";

// console.log(reverseArabicWords(arabicSentence)); // Outputs: "محمود محسن"
// console.log(reverseArabicWords(englishSentence)); // Outputs: "John Doe"
// console.log(reverseArabicWords(null));            // Outputs: ""

export function extractPageNumber(input: string): number | null {
  const match = input.match(/^page_(\d+)$/);
  return match ? Number(match[1]) : null;
}

// Example Usage:
// console.log(extractPageNumber("page_1")); // Output: 1
// console.log(extractPageNumber("page_25")); // Output: 25
// console.log(extractPageNumber("page_abc")); // Output: null
// console.log(extractPageNumber("page1")); // Output: null
// console.log(extractPageNumber("1_page")); // Output: null
