export default (date) => {
  const dateInput = new Date(date);
  const todayDate = new Date();
  return dateInput > todayDate;
};
