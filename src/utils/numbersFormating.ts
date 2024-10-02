export function formatCurrencyNumbers(
  number: number,
  currency: string = 'ج.م',
  locale: string,
  // alignCurrecy?: 'left' | 'right',
  doNotShowCurrency: boolean = false
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
    ',': '٫' // Arabic comma
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
  if (locale === 'ar') {
    return `${arabicFormattedNumber} ${currency}`;
  }
  // Convert each English digit (and comma) to Arabic-Indic numeral
  // return `${currency} ${arabicFormattedNumber}`;
  return formatEnglishNumbers(number, currency);
}

// Example usage:
// console.log(convertToArabicNumeralsWithFormatting(1234567.89)); // Output:  ١,٢٣٤,٥٦٧.٨٩ ج.م
// console.log(convertToArabicNumeralsWithFormatting(1000)); // Output:  ١,٠٠٠.٠٠ ج.م
// console.log(convertToArabicNumeralsWithFormatting(9876543210, '$')); // Output: E£ ٩,٨٧٦,٥٤٣,٢١٠.٠٠

export function formatEnglishNumbers(
  number: number,
  currency: string = 'EGP',
  doNotShowCurrency: boolean = false
  // alignCurrency: 'left' | 'right' = 'left'
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

  // if (alignCurrency === 'right') {
  //   return `${formattedNumber} ${currency}`; // Currency on the right
  // }

  return `${currency} ${formattedNumber}`; // Currency on the left
}

// // Example usage:
// console.log(convertToArabicNumeralsWithFormatting(1234567.89)); // Output: "1,234,567.89"
// console.log(convertToArabicNumeralsWithFormatting(1000)); // Output: "1,000.00"
// console.log(
//   convertToArabicNumeralsWithFormatting(
//     9876543210,
//     'ج.م',
//     'right',
//     false
//   )
// ); // Output: "9,876,543,210.00 ج.م"
