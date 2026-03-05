class Carrito {
  constructor() {
    this.productos = [];
    this.cuponAplicado = null;
    this.porcentajeImpuesto = 0.19;
  }

  agregarProducto(producto) {
    if (!producto.nombre || producto.precio === undefined || producto.cantidad === undefined) {
      throw new Error('El producto debe tener nombre, precio y cantidad');
    }

    if (producto.cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a cero');
    }

    if (producto.precio < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    this.productos.push({
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad
    });
  }

  calcularSubtotal() {
    return this.productos.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
  }

  aplicarCupon(codigoCupon) {
    if (this.cuponAplicado !== null) {
      throw new Error('Ya se ha aplicado un cupón a esta compra');
    }

    const cuponesValidos = {
      'DESC10': 0.10,
      'DESC20': 0.20
    };

    if (!cuponesValidos.hasOwnProperty(codigoCupon)) {
      throw new Error('Cupón inválido');
    }

    this.cuponAplicado = {
      codigo: codigoCupon,
      porcentaje: cuponesValidos[codigoCupon]
    };
  }

  calcularDescuento() {
    if (this.cuponAplicado === null) {
      return 0;
    }

    const subtotal = this.calcularSubtotal();
    return subtotal * this.cuponAplicado.porcentaje;
  }

  calcularSubtotalConDescuento() {
    const subtotal = this.calcularSubtotal();
    const descuento = this.calcularDescuento();
    return subtotal - descuento;
  }

  calcularImpuesto() {
    const subtotalConDescuento = this.calcularSubtotalConDescuento();
    return subtotalConDescuento * this.porcentajeImpuesto;
  }

  calcularTotal() {
    const subtotalConDescuento = this.calcularSubtotalConDescuento();
    const impuesto = this.calcularImpuesto();
    const total = subtotalConDescuento + impuesto;
    
    return Math.max(0, total);
  }

  obtenerResumen() {
    return {
      subtotal: this.calcularSubtotal(),
      descuento: this.calcularDescuento(),
      subtotalConDescuento: this.calcularSubtotalConDescuento(),
      impuesto: this.calcularImpuesto(),
      total: this.calcularTotal(),
      cuponAplicado: this.cuponAplicado ? this.cuponAplicado.codigo : null,
      cantidadProductos: this.productos.length
    };
  }

  obtenerProductos() {
    return [...this.productos];
  }

  limpiar() {
    this.productos = [];
    this.cuponAplicado = null;
  }
}

export default Carrito;
