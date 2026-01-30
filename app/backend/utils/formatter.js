export const dateFormatter = (date) => {
  return new Date(
    date.year,
    date.month,
    date.day,
    date.hour,
    date.minutes,
    date.seconds,
  );
};
