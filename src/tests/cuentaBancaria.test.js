import CuentaBancaria from '../cuentaBancaria.js';

describe('CuentaBancaria', () => {
  describe('Constructor', () => {
    test('crear cuenta con saldo inicial válido', () => {
      const cuenta = new CuentaBancaria(1000);
      expect(cuenta.consultarSaldo()).toBe(1000);
    });

    test('crear cuenta con saldo inicial cero', () => {
      const cuenta = new CuentaBancaria(0);
      expect(cuenta.consultarSaldo()).toBe(0);
    });

    test('crear cuenta sin parámetro (saldo por defecto 0)', () => {
      const cuenta = new CuentaBancaria();
      expect(cuenta.consultarSaldo()).toBe(0);
    });

    test('error al crear cuenta con saldo negativo', () => {
      expect(() => new CuentaBancaria(-100)).toThrow('El saldo inicial no puede ser negativo');
    });
  });

  describe('Depositar dinero', () => {
    test('depósito válido', () => {
      const cuenta = new CuentaBancaria(1000);
      const nuevoSaldo = cuenta.depositar(500);
      expect(nuevoSaldo).toBe(1500);
      expect(cuenta.consultarSaldo()).toBe(1500);
    });

    test('múltiples depósitos', () => {
      const cuenta = new CuentaBancaria(100);
      cuenta.depositar(50);
      cuenta.depositar(25);
      cuenta.depositar(100);
      expect(cuenta.consultarSaldo()).toBe(275);
    });

    test('error por monto cero', () => {
      const cuenta = new CuentaBancaria(1000);
      expect(() => cuenta.depositar(0)).toThrow('El monto a depositar debe ser mayor a cero');
    });

    test('error por monto negativo', () => {
      const cuenta = new CuentaBancaria(1000);
      expect(() => cuenta.depositar(-100)).toThrow('El monto a depositar debe ser mayor a cero');
    });
  });

  describe('Retirar dinero', () => {
    test('retiro válido', () => {
      const cuenta = new CuentaBancaria(1000);
      const nuevoSaldo = cuenta.retirar(300);
      expect(nuevoSaldo).toBe(700);
      expect(cuenta.consultarSaldo()).toBe(700);
    });

    test('retiro del saldo completo', () => {
      const cuenta = new CuentaBancaria(500);
      cuenta.retirar(500);
      expect(cuenta.consultarSaldo()).toBe(0);
    });

    test('error por retiro excesivo', () => {
      const cuenta = new CuentaBancaria(1000);
      expect(() => cuenta.retirar(1500)).toThrow('Saldo insuficiente para realizar el retiro');
    });

    test('error por monto inválido - cero', () => {
      const cuenta = new CuentaBancaria(1000);
      expect(() => cuenta.retirar(0)).toThrow('El monto a retirar debe ser mayor a cero');
    });

    test('error por monto inválido - negativo', () => {
      const cuenta = new CuentaBancaria(1000);
      expect(() => cuenta.retirar(-100)).toThrow('El monto a retirar debe ser mayor a cero');
    });
  });

  describe('Consultar saldo', () => {
    test('consultar saldo inicial', () => {
      const cuenta = new CuentaBancaria(2500);
      expect(cuenta.consultarSaldo()).toBe(2500);
    });

    test('consultar saldo después de transacciones', () => {
      const cuenta = new CuentaBancaria(1000);
      cuenta.depositar(500);
      cuenta.retirar(300);
      expect(cuenta.consultarSaldo()).toBe(1200);
    });
  });

  describe('Historial de transacciones', () => {
    test('historial con apertura de cuenta', () => {
      const cuenta = new CuentaBancaria(1000);
      const historial = cuenta.obtenerHistorial();
      expect(historial).toHaveLength(1);
      expect(historial[0].tipo).toBe('apertura');
      expect(historial[0].monto).toBe(1000);
      expect(historial[0].saldoResultante).toBe(1000);
    });

    test('historial correcto con múltiples transacciones', () => {
      const cuenta = new CuentaBancaria(1000);
      cuenta.depositar(500);
      cuenta.retirar(200);
      cuenta.depositar(300);
      
      const historial = cuenta.obtenerHistorial();
      expect(historial).toHaveLength(4); // apertura + 3 transacciones
      
      expect(historial[0].tipo).toBe('apertura');
      expect(historial[0].saldoResultante).toBe(1000);
      
      expect(historial[1].tipo).toBe('depósito');
      expect(historial[1].monto).toBe(500);
      expect(historial[1].saldoResultante).toBe(1500);
      
      expect(historial[2].tipo).toBe('retiro');
      expect(historial[2].monto).toBe(200);
      expect(historial[2].saldoResultante).toBe(1300);
      
      expect(historial[3].tipo).toBe('depósito');
      expect(historial[3].monto).toBe(300);
      expect(historial[3].saldoResultante).toBe(1600);
    });

    test('historial vacío para cuenta con saldo cero', () => {
      const cuenta = new CuentaBancaria(0);
      const historial = cuenta.obtenerHistorial();
      expect(historial).toHaveLength(0);
    });

    test('historial registra fecha de transacciones', () => {
      const cuenta = new CuentaBancaria(1000);
      cuenta.depositar(100);
      
      const historial = cuenta.obtenerHistorial();
      expect(historial[1].fecha).toBeInstanceOf(Date);
    });

    test('historial no se modifica externamente', () => {
      const cuenta = new CuentaBancaria(1000);
      const historial1 = cuenta.obtenerHistorial();
      historial1.push({ tipo: 'falso' });
      
      const historial2 = cuenta.obtenerHistorial();
      expect(historial2).toHaveLength(1);
    });
  });

  describe('Casos integrados', () => {
    test('flujo completo de operaciones', () => {
      const cuenta = new CuentaBancaria(5000);
      
      cuenta.depositar(1000);
      expect(cuenta.consultarSaldo()).toBe(6000);
      
      cuenta.retirar(2000);
      expect(cuenta.consultarSaldo()).toBe(4000);
      
      cuenta.depositar(500);
      expect(cuenta.consultarSaldo()).toBe(4500);
      
      const historial = cuenta.obtenerHistorial();
      expect(historial).toHaveLength(4);
      expect(historial[historial.length - 1].saldoResultante).toBe(4500);
    });
  });
});
