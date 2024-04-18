function truncateNumber(nombre) {
  // Convertir le nombre en chaîne de caractères
  const nombreString = nombre.toString();

  // Vérifier si le nombre commence par 0
  if (nombreString.startsWith('0')) {
    // Tronquer à 8 chiffres après la virgule
    const tronque = parseFloat(nombre).toFixed(8);
    return parseFloat(tronque); // Retourne le résultat tronqué
  }
  // Tronquer à 2 chiffres après la virgule
  const tronque = parseFloat(nombre).toFixed(2);
  return parseFloat(tronque); // Retourne le résultat tronqué
}

export default truncateNumber;
