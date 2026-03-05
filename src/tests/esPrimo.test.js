import esPrimo from '../esPrimo.js';

describe('esPrimo', () => {
  test('2 es primo', () => {
    expect(esPrimo(2)).toBe(true);
  });

  test('17 es primo', () => {
    expect(esPrimo(17)).toBe(true);
  });

  test('20 no es primo', () => {
    expect(esPrimo(20)).toBe(false);
  });

  test('1 no es primo', () => {
    expect(esPrimo(1)).toBe(false);
  });

  test('números negativos no son primos', () => {
    expect(esPrimo(-5)).toBe(false);
    expect(esPrimo(-17)).toBe(false);
  });

  test('0 no es primo', () => {
    expect(esPrimo(0)).toBe(false);
  });

  test('números primos adicionales', () => {
    expect(esPrimo(3)).toBe(true);
    expect(esPrimo(5)).toBe(true);
    expect(esPrimo(7)).toBe(true);
    expect(esPrimo(11)).toBe(true);
    expect(esPrimo(13)).toBe(true);
  });

  test('números no primos adicionales', () => {
    expect(esPrimo(4)).toBe(false);
    expect(esPrimo(6)).toBe(false);
    expect(esPrimo(8)).toBe(false);
    expect(esPrimo(9)).toBe(false);
    expect(esPrimo(15)).toBe(false);
  });
});
