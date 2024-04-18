export default (date) => {
  // On compare la date de l'utilisateur avec la date du jour
  const dateInput = new Date(date);
  const todayDate = new Date();
  return dateInput > todayDate;
};
