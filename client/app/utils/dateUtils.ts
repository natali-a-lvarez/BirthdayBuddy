// Format birthdays like 'Jan 5'
export const formatBirthday = (birthday: Date): string => {
  return birthday.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

// Calculate age from birthday
export const calculateAge = (birthday: Date): number => {
  const currentYear = new Date().getFullYear();
  const isBirthdayPassed =
    new Date(currentYear, birthday.getMonth(), birthday.getDate()) < new Date();
  return currentYear - birthday.getFullYear() - (isBirthdayPassed ? 1 : 0);
};
