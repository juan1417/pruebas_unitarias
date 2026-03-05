import convertirTemperatura from '../conversorTemperatura.js';

describe('convertirTemperatura', () => {
  describe('Conversión de Celsius a Fahrenheit', () => {
    test('conversión correcta C a F - 0°C', () => {
      expect(convertirTemperatura(0, 'F')).toBe(32);
    });

    test('conversión correcta C a F - 100°C', () => {
      expect(convertirTemperatura(100, 'F')).toBe(212);
    });

    test('conversión correcta C a F - 25°C', () => {
      expect(convertirTemperatura(25, 'F')).toBe(77);
    });

    test('conversión correcta C a F - número negativo', () => {
      expect(convertirTemperatura(-40, 'F')).toBe(-40);
    });

    test('conversión correcta C a F - resultado con decimales', () => {
      expect(convertirTemperatura(37, 'F')).toBe(98.6);
    });
  });

  describe('Conversión de Fahrenheit a Celsius', () => {
    test('conversión correcta F a C - 32°F', () => {
      expect(convertirTemperatura(32, 'C')).toBe(0);
    });

    test('conversión correcta F a C - 212°F', () => {
      expect(convertirTemperatura(212, 'C')).toBe(100);
    });

    test('conversión correcta F a C - 77°F', () => {
      expect(convertirTemperatura(77, 'C')).toBe(25);
    });

    test('conversión correcta F a C - número negativo', () => {
      expect(convertirTemperatura(-40, 'C')).toBe(-40);
    });

    test('conversión correcta F a C - resultado con decimales', () => {
      expect(convertirTemperatura(98.6, 'C')).toBe(37);
    });
  });

  describe('Redondeo a dos decimales', () => {
    test('redondear resultado con más de dos decimales', () => {
      expect(convertirTemperatura(30, 'F')).toBe(86);
    });

    test('redondear correctamente hacia arriba', () => {
      const resultado = convertirTemperatura(22.5, 'F');
      expect(resultado).toBe(72.5);
    });

    test('redondear correctamente hacia abajo', () => {
      const resultado = convertirTemperatura(15, 'F');
      expect(resultado).toBe(59);
    });
  });

  describe('Validación de unidades', () => {
    test('error por unidad inválida - minúscula', () => {
      expect(() => convertirTemperatura(25, 'c')).toThrow('Unidad no válida');
    });

    test('error por unidad inválida - letra incorrecta', () => {
      expect(() => convertirTemperatura(25, 'K')).toThrow('Unidad no válida');
    });

    test('error por unidad inválida - texto', () => {
      expect(() => convertirTemperatura(25, 'Celsius')).toThrow('Unidad no válida');
    });

    test('error por unidad inválida - número', () => {
      expect(() => convertirTemperatura(25, 1)).toThrow('Unidad no válida');
    });

    test('error por unidad inválida - undefined', () => {
      expect(() => convertirTemperatura(25, undefined)).toThrow('Unidad no válida');
    });

    test('error por unidad inválida - null', () => {
      expect(() => convertirTemperatura(25, null)).toThrow('Unidad no válida');
    });
  });

  describe('Manejo de números negativos', () => {
    test('temperatura negativa C a F', () => {
      expect(convertirTemperatura(-10, 'F')).toBe(14);
    });

    test('temperatura negativa F a C', () => {
      expect(convertirTemperatura(-4, 'C')).toBe(-20);
    });

    test('temperatura muy negativa C a F', () => {
      expect(convertirTemperatura(-273.15, 'F')).toBe(-459.67);
    });
  });

  describe('Casos especiales', () => {
    test('punto de congelación del agua', () => {
      expect(convertirTemperatura(0, 'F')).toBe(32);
      expect(convertirTemperatura(32, 'C')).toBe(0);
    });

    test('punto de ebullición del agua', () => {
      expect(convertirTemperatura(100, 'F')).toBe(212);
      expect(convertirTemperatura(212, 'C')).toBe(100);
    });

    test('temperatura corporal normal', () => {
      expect(convertirTemperatura(37, 'F')).toBe(98.6);
    });

    test('cero absoluto aproximado', () => {
      expect(convertirTemperatura(-273.15, 'F')).toBe(-459.67);
    });
  });
});
