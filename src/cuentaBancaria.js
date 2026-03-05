class CuentaBancaria {
  constructor(saldoInicial = 0) {
    if (saldoInicial < 0) {
      throw new Error('El saldo inicial no puede ser negativo');
    }
    this.saldo = saldoInicial;
    this.historial = [];
    if (saldoInicial > 0) {
      this.historial.push({
        tipo: 'apertura',
        monto: saldoInicial,
        fecha: new Date(),
        saldoResultante: saldoInicial
      });
    }
  }

  depositar(monto) {
    if (monto <= 0) {
      throw new Error('El monto a depositar debe ser mayor a cero');
    }
    
    this.saldo += monto;
    this.historial.push({
      tipo: 'depósito',
      monto: monto,
      fecha: new Date(),
      saldoResultante: this.saldo
    });
    
    return this.saldo;
  }

  retirar(monto) {
    if (monto <= 0) {
      throw new Error('El monto a retirar debe ser mayor a cero');
    }
    
    if (monto > this.saldo) {
      throw new Error('Saldo insuficiente para realizar el retiro');
    }
    
    this.saldo -= monto;
    this.historial.push({
      tipo: 'retiro',
      monto: monto,
      fecha: new Date(),
      saldoResultante: this.saldo
    });
    
    return this.saldo;
  }

  consultarSaldo() {
    return this.saldo;
  }

  obtenerHistorial() {
    return [...this.historial];
  }
}

export default CuentaBancaria;
