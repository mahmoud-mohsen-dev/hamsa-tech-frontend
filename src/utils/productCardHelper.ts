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

  // Check if the difference is less than 45 days
  return differenceInDays < 45;
};

export { isNewProduct };
