export const formatDateToISOString = (date: Date): string => {
  const isoString = date.toISOString();

  const formattedString = isoString.slice(0, -5) + 'Z';

  return formattedString;
};

export const convertDate = (isoString: string): string => {
  if(!isoString ) return " ";
  const dateObject = new Date(isoString);
  const day = dateObject.getDate().toString().padStart(2, '0');
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObject.getFullYear();

  const convertedDate = `${day}/${month}/${year}`;

  return convertedDate;
};