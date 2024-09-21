const isNewProduct = (createdAt: string): boolean => {
  // Parse the ISO string to a Date object
  const creationDate = new Date(createdAt);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMillis =
    currentDate.getTime() - creationDate.getTime();

  // Convert milliseconds to days
  const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

  // Check if the difference is less than 7 days (1 week)
  return differenceInDays < 7;
};

export { isNewProduct };
