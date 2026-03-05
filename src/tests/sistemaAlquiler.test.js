import SistemaAlquiler from '../sistemaAlquiler.js';

describe('SistemaAlquiler', () => {
  let sistema;

  beforeEach(() => {
    sistema = new SistemaAlquiler();
  });

  describe('Agregar vehículos', () => {
    test('agregar vehículo válido', () => {
      sistema.agregarVehiculo({ id: 1, tipo: 'Auto', precioPorDia: 50000 });
      const vehiculos = sistema.obtenerTodosVehiculos();
      expect(vehiculos).toHaveLength(1);
      expect(vehiculos[0]).toEqual({ id: 1, tipo: 'Auto', precioPorDia: 50000 });
    });

    test('agregar múltiples vehículos', () => {
      sistema.agregarVehiculo({ id: 1, tipo: 'Auto', precioPorDia: 50000 });
      sistema.agregarVehiculo({ id: 2, tipo: 'Moto', precioPorDia: 30000 });
      sistema.agregarVehiculo({ id: 3, tipo: 'Camioneta', precioPorDia: 80000 });
      expect(sistema.obtenerTodosVehiculos()).toHaveLength(3);
    });

    test('error al agregar vehículo sin id', () => {
      expect(() => {
        sistema.agregarVehiculo({ tipo: 'Auto', precioPorDia: 50000 });
      }).toThrow('El vehículo debe tener id, tipo y precioPorDia');
    });

    test('error al agregar vehículo sin tipo', () => {
      expect(() => {
        sistema.agregarVehiculo({ id: 1, precioPorDia: 50000 });
      }).toThrow('El vehículo debe tener id, tipo y precioPorDia');
    });

    test('error al agregar vehículo sin precio', () => {
      expect(() => {
        sistema.agregarVehiculo({ id: 1, tipo: 'Auto' });
      }).toThrow('El vehículo debe tener id, tipo y precioPorDia');
    });

    test('error al agregar vehículo con precio inválido', () => {
      expect(() => {
        sistema.agregarVehiculo({ id: 1, tipo: 'Auto', precioPorDia: 0 });
      }).toThrow('El precio por día debe ser mayor a cero');
    });

    test('error al agregar vehículo con id duplicado', () => {
      sistema.agregarVehiculo({ id: 1, tipo: 'Auto', precioPorDia: 50000 });
      expect(() => {
        sistema.agregarVehiculo({ id: 1, tipo: 'Moto', precioPorDia: 30000 });
      }).toThrow('Ya existe un vehículo con ese id');
    });
  });

  describe('Alquilar vehículos', () => {
    beforeEach(() => {
      sistema.agregarVehiculo({ id: 1, tipo: 'Auto', precioPorDia: 50000 });
      sistema.agregarVehiculo({ id: 2, tipo: 'Moto', precioPorDia: 30000 });
    });

    test('alquiler exitoso', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-15');
      
      const alquiler = sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      
      expect(alquiler).toBeDefined();
      expect(alquiler.idVehiculo).toBe(1);
      expect(alquiler.fechaInicio).toEqual(fechaInicio);
      expect(alquiler.fechaFin).toEqual(fechaFin);
      expect(sistema.estaAlquilado(1)).toBe(true);
    });

    test('error por alquiler duplicado', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-15');
      
      sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      
      expect(() => {
        sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      }).toThrow('El vehículo ya está alquilado');
    });

    test('error por vehículo inexistente', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-15');
      
      expect(() => {
        sistema.alquilarVehiculo(999, fechaInicio, fechaFin);
      }).toThrow('El vehículo no existe');
    });

    test('error por fechas inválidas - fecha inicio posterior a fecha fin', () => {
      const fechaInicio = new Date('2026-03-15');
      const fechaFin = new Date('2026-03-10');
      
      expect(() => {
        sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      }).toThrow('La fecha de inicio debe ser anterior a la fecha de fin');
    });

    test('error por fechas iguales', () => {
      const fecha = new Date('2026-03-10');
      
      expect(() => {
        sistema.alquilarVehiculo(1, fecha, fecha);
      }).toThrow('La fecha de inicio debe ser anterior a la fecha de fin');
    });

    test('error por fechas no válidas', () => {
      expect(() => {
        sistema.alquilarVehiculo(1, 'no es fecha', 'tampoco');
      }).toThrow('Las fechas deben ser objetos Date válidos');
    });

    test('múltiples vehículos pueden ser alquilados al mismo tiempo', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-15');
      
      sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      sistema.alquilarVehiculo(2, fechaInicio, fechaFin);
      
      expect(sistema.estaAlquilado(1)).toBe(true);
      expect(sistema.estaAlquilado(2)).toBe(true);
    });
  });

  describe('Devolver vehículos', () => {
    beforeEach(() => {
      sistema.agregarVehiculo({ id: 1, tipo: 'Auto', precioPorDia: 50000 });
    });

    test('devolución libera vehículo', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-15');
      
      sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      expect(sistema.estaAlquilado(1)).toBe(true);
      
      sistema.devolverVehiculo(1);
      expect(sistema.estaAlquilado(1)).toBe(false);
    });

    test('vehículo puede ser alquilado nuevamente después de devolución', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-15');
      
      sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      sistema.devolverVehiculo(1);
      
      const alquiler = sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      expect(alquiler).toBeDefined();
      expect(sistema.estaAlquilado(1)).toBe(true);
    });

    test('error al devolver vehículo no alquilado', () => {
      expect(() => {
        sistema.devolverVehiculo(1);
      }).toThrow('El vehículo no está alquilado');
    });
  });

  describe('Calcular costo', () => {
    beforeEach(() => {
      sistema.agregarVehiculo({ id: 1, tipo: 'Auto', precioPorDia: 50000 });
      sistema.agregarVehiculo({ id: 2, tipo: 'Moto', precioPorDia: 30000 });
    });

    test('cálculo correcto del costo - días completos', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-15'); // 5 días
      
      const costo = sistema.calcularCosto(1, fechaInicio, fechaFin);
      expect(costo).toBe(250000); // 5 días * 50000
    });

    test('cálculo correcto del costo - un día', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-11'); // 1 día
      
      const costo = sistema.calcularCosto(1, fechaInicio, fechaFin);
      expect(costo).toBe(50000); // 1 día * 50000
    });

    test('cálculo correcto del costo - diferentes vehículos', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-13'); // 3 días
      
      const costoAuto = sistema.calcularCosto(1, fechaInicio, fechaFin);
      const costoMoto = sistema.calcularCosto(2, fechaInicio, fechaFin);
      
      expect(costoAuto).toBe(150000); // 3 * 50000
      expect(costoMoto).toBe(90000);  // 3 * 30000
    });

    test('cálculo con días parciales redondea hacia arriba', () => {
      const fechaInicio = new Date('2026-03-10T10:00:00');
      const fechaFin = new Date('2026-03-11T14:00:00'); // 1.16 días -> 2 días
      
      const costo = sistema.calcularCosto(1, fechaInicio, fechaFin);
      expect(costo).toBe(100000); // 2 días * 50000
    });

    test('error al calcular costo de vehículo inexistente', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-15');
      
      expect(() => {
        sistema.calcularCosto(999, fechaInicio, fechaFin);
      }).toThrow('El vehículo no existe');
    });

    test('error por fechas inválidas en cálculo de costo', () => {
      const fechaInicio = new Date('2026-03-15');
      const fechaFin = new Date('2026-03-10');
      
      expect(() => {
        sistema.calcularCosto(1, fechaInicio, fechaFin);
      }).toThrow('La fecha de inicio debe ser anterior a la fecha de fin');
    });
  });

  describe('Vehículos disponibles', () => {
    beforeEach(() => {
      sistema.agregarVehiculo({ id: 1, tipo: 'Auto', precioPorDia: 50000 });
      sistema.agregarVehiculo({ id: 2, tipo: 'Moto', precioPorDia: 30000 });
      sistema.agregarVehiculo({ id: 3, tipo: 'Camioneta', precioPorDia: 80000 });
    });

    test('todos los vehículos disponibles inicialmente', () => {
      const disponibles = sistema.obtenerVehiculosDisponibles();
      expect(disponibles).toHaveLength(3);
    });

    test('vehículos disponibles excluye alquilados', () => {
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-15');
      
      sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      
      const disponibles = sistema.obtenerVehiculosDisponibles();
      expect(disponibles).toHaveLength(2);
      expect(disponibles.some(v => v.id === 1)).toBe(false);
      expect(disponibles.some(v => v.id === 2)).toBe(true);
      expect(disponibles.some(v => v.id === 3)).toBe(true);
    });
  });

  describe('Casos integrados', () => {
    test('flujo completo de alquiler', () => {
      sistema.agregarVehiculo({ id: 1, tipo: 'Auto', precioPorDia: 50000 });
      
      const fechaInicio = new Date('2026-03-10');
      const fechaFin = new Date('2026-03-15');
      
      // Alquilar
      const alquiler = sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      expect(alquiler.idVehiculo).toBe(1);
      expect(sistema.estaAlquilado(1)).toBe(true);
      
      // Calcular costo
      const costo = sistema.calcularCosto(1, fechaInicio, fechaFin);
      expect(costo).toBe(250000);
      
      // Devolver
      sistema.devolverVehiculo(1);
      expect(sistema.estaAlquilado(1)).toBe(false);
      
      // Volver a alquilar
      const nuevoAlquiler = sistema.alquilarVehiculo(1, fechaInicio, fechaFin);
      expect(nuevoAlquiler).toBeDefined();
    });
  });
});
