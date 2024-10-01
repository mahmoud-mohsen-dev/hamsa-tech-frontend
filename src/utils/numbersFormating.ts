export function convertToArabicNumeralsWithFormatting(
  number: number,
  currency: string = 'ج.م',
  doNotShowCurrency: boolean = false,
  alignCurrecy: 'left' | 'right' = 'left'
) {
  const englishToArabicMap: { [key: string]: string } = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    ',': '٬' // Arabic comma
  };
  // Format the number with commas for thousands, millions, etc.
  const formattedNumber = number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Convert each English digit (and comma) to Arabic-Indic numeral
  const arabicFormattedNumber = formattedNumber
    .split('')
    .map(
      (digit) =>
        englishToArabicMap[
          digit as keyof typeof englishToArabicMap
        ] || digit
    )
    .join('');

  if (doNotShowCurrency) {
    return arabicFormattedNumber;
  }
  if (alignCurrecy === 'left') {
    return `${arabicFormattedNumber} ${currency}`;
  }
  // Convert each English digit (and comma) to Arabic-Indic numeral
  return `${currency} ${arabicFormattedNumber}`;
}

// Example usage:
// console.log(convertToArabicNumeralsWithFormatting(1234567.89)); // Output:  ١,٢٣٤,٥٦٧.٨٩ ج.م
// console.log(convertToArabicNumeralsWithFormatting(1000)); // Output:  ١,٠٠٠.٠٠ ج.م
// console.log(convertToArabicNumeralsWithFormatting(9876543210, '$')); // Output: E£ ٩,٨٧٦,٥٤٣,٢١٠.٠٠

export function formatEnglishNumbers(
  number: number,
  currency: string = 'EGP',
  doNotShowCurrency: boolean = true,
  alignCurrency: 'left' | 'right' = 'left'
) {
  // Format the number with commas for thousands, millions, etc.
  const formattedNumber = number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Return the formatted number, with or without currency
  if (doNotShowCurrency) {
    return formattedNumber; // Return only the formatted number
  }

  if (alignCurrency === 'right') {
    return `${formattedNumber} ${currency}`; // Currency on the right
  }

  return `${currency} ${formattedNumber}`; // Currency on the left
}

// Example usage:
console.log(convertToArabicNumeralsWithFormatting(1234567.89)); // Output: "1,234,567.89"
console.log(convertToArabicNumeralsWithFormatting(1000)); // Output: "1,000.00"
console.log(
  convertToArabicNumeralsWithFormatting(
    9876543210,
    'ج.م',
    false,
    'right'
  )
); // Output: "9,876,543,210.00 ج.م"
