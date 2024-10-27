import dayjs from 'dayjs';

export function generateISODateForGraphQL() {
  // Create a new date
  const currentDate = new Date();

  // Return the date in ISO format (YYYY-MM-DD)
  return currentDate.toISOString().split('T')[0];
}
// console.log(generateISODateForGraphQL()); // e.g., "2024-10-03"

export const convertIsoStringToDateFormat = (isoString: string) => {
  return dayjs(isoString).format('DD/MM/YYYY');
};

// Example usage
// const isoDateString = '2024-10-14T10:00:00Z'; // ISO string format
// console.log(convertIsoStringToDateFormat(isoDateString)); // Output: "14/10/2024"

export const formatDateByLocale = (
  isoString: string | undefined | null,
  locale: string = 'en'
): string => {
  if (typeof isoString !== 'string') {
    return '-';
  }

  // Check if the input is a valid ISO string
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return '-';
  }

  const day = date.getDate();
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

// const formattedDateEn = formatDate("2024-05-05T00:00:00.000Z", "en");
// console.log(formattedDateEn); // Output: "5 May 2024"

// const formattedDateAr = formatDate("2024-05-05T00:00:00.000Z", "ar");
// console.log(formattedDateAr); // Output: "٥ مايو ٢٠٢٤" (in Arabic)

export function addDaysToIsoDate(
  isoString: string | null | undefined,
  days: number | null | undefined
): string {
  if (typeof isoString !== 'string' || typeof days !== 'number') {
    return '-';
  }
  const date = new Date(isoString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid ISO date string');
  }

  // Add the specified number of days
  date.setDate(date.getDate() + days);

  // Return the updated date as an ISO string
  return date.toISOString();
}
