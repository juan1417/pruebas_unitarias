function convertirTemperatura(valor, unidadDestino) {
  if (unidadDestino !== 'C' && unidadDestino !== 'F') {
    throw new Error('Unidad no válida. Use "C" para Celsius o "F" para Fahrenheit');
  }

  let resultado;
  
  if (unidadDestino === 'F') {
    resultado = (valor * 9/5) + 32;
  } else {
    resultado = (valor - 32) * 5/9;
  }

  return Math.round(resultado * 100) / 100;
}

export default convertirTemperatura;
