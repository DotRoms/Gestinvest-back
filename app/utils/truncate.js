export default {
  // Permet de tronquer un nombre à huit chiffres après la virgule
  truncateToEightDecimals(nombre) {
    return Math.trunc(nombre * 100000000) / 100000000;
  },

  // Permet de tronquer un nombre à deux chiffres après la virgule
  truncateToTwoDecimals(nombre) {
    return Math.trunc(nombre * 100) / 100;
  }
};
