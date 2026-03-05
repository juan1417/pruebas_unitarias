class SistemaAlquiler {
  constructor() {
    this.vehiculos = [];
    this.alquileres = new Map();
  }

  agregarVehiculo(vehiculo) {
    if (!vehiculo.id || !vehiculo.tipo || vehiculo.precioPorDia === undefined) {
      throw new Error('El vehículo debe tener id, tipo y precioPorDia');
    }
    
    if (vehiculo.precioPorDia <= 0) {
      throw new Error('El precio por día debe ser mayor a cero');
    }
    
    if (this.vehiculos.some(v => v.id === vehiculo.id)) {
      throw new Error('Ya existe un vehículo con ese id');
    }
    
    this.vehiculos.push({
      id: vehiculo.id,
      tipo: vehiculo.tipo,
      precioPorDia: vehiculo.precioPorDia
    });
  }

  alquilarVehiculo(idVehiculo, fechaInicio, fechaFin) {
    const vehiculo = this.vehiculos.find(v => v.id === idVehiculo);
    if (!vehiculo) {
      throw new Error('El vehículo no existe');
    }
    
    if (this.alquileres.has(idVehiculo)) {
      throw new Error('El vehículo ya está alquilado');
    }
    
    if (!(fechaInicio instanceof Date) || !(fechaFin instanceof Date)) {
      throw new Error('Las fechas deben ser objetos Date válidos');
    }
    
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      throw new Error('Las fechas no son válidas');
    }
    
    if (fechaInicio >= fechaFin) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }
    
    const alquiler = {
      idVehiculo: idVehiculo,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      vehiculo: vehiculo
    };
    
    this.alquileres.set(idVehiculo, alquiler);
    
    return alquiler;
  }

  devolverVehiculo(idVehiculo) {
    if (!this.alquileres.has(idVehiculo)) {
      throw new Error('El vehículo no está alquilado');
    }
    
    this.alquileres.delete(idVehiculo);
    return true;
  }

  calcularCosto(idVehiculo, fechaInicio, fechaFin) {
    const vehiculo = this.vehiculos.find(v => v.id === idVehiculo);
    if (!vehiculo) {
      throw new Error('El vehículo no existe');
    }
    
    if (!(fechaInicio instanceof Date) || !(fechaFin instanceof Date)) {
      throw new Error('Las fechas deben ser objetos Date válidos');
    }
    
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      throw new Error('Las fechas no son válidas');
    }
    
    if (fechaInicio >= fechaFin) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }
    
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    const diferenciaMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
    const dias = Math.ceil(diferenciaMilisegundos / milisegundosPorDia);
    
    return dias * vehiculo.precioPorDia;
  }

  estaAlquilado(idVehiculo) {
    return this.alquileres.has(idVehiculo);
  }

  obtenerVehiculosDisponibles() {
    return this.vehiculos.filter(v => !this.alquileres.has(v.id));
  }

  obtenerTodosVehiculos() {
    return [...this.vehiculos];
  }
}

export default SistemaAlquiler;
