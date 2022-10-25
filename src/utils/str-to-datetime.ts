/**
 * Convert string datetime to Javascript Date object and return ISO string
 * @param str - string datetime (format: 21/03/2020 10:20:11)
 * Eg. strDMYToDatetime("21/03/2020 10:20:11") -> 2020-03-21T03:20:11.000Z
 */
export const strDMYToDatetime = (str: string): string => {
  const [dateValues, timeValues] = str.split(' ');
  const [day, month, year] = dateValues.split('/');
  const [hours, minutes, seconds] = timeValues.split(':');
  const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
  return date.toISOString();
};
