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
