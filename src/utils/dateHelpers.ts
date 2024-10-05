export function generateISODateForGraphQL() {
  // Create a new date
  const currentDate = new Date();

  // Return the date in ISO format (YYYY-MM-DD)
  return currentDate.toISOString().split('T')[0];
}
// console.log(generateISODateForGraphQL()); // e.g., "2024-10-03"
