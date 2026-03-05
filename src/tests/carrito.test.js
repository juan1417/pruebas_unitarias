import Carrito from '../carrito.js';

describe('Carrito', () => {
  let carrito;

  beforeEach(() => {
    carrito = new Carrito();
  });

  describe('Agregar productos', () => {
    test('agregar producto válido', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      const productos = carrito.obtenerProductos();
      expect(productos).toHaveLength(1);
      expect(productos[0]).toEqual({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
    });

    test('agregar múltiples productos', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      carrito.agregarProducto({ nombre: 'Mouse', precio: 50000, cantidad: 2 });
      carrito.agregarProducto({ nombre: 'Teclado', precio: 80000, cantidad: 1 });
      expect(carrito.obtenerProductos()).toHaveLength(3);
    });

    test('error al agregar producto sin nombre', () => {
      expect(() => {
        carrito.agregarProducto({ precio: 1000000, cantidad: 1 });
      }).toThrow('El producto debe tener nombre, precio y cantidad');
    });

    test('error al agregar producto sin precio', () => {
      expect(() => {
        carrito.agregarProducto({ nombre: 'Laptop', cantidad: 1 });
      }).toThrow('El producto debe tener nombre, precio y cantidad');
    });

    test('error al agregar producto sin cantidad', () => {
      expect(() => {
        carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000 });
      }).toThrow('El producto debe tener nombre, precio y cantidad');
    });

    test('error por cantidad cero', () => {
      expect(() => {
        carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 0 });
      }).toThrow('La cantidad debe ser mayor a cero');
    });

    test('error por cantidad negativa', () => {
      expect(() => {
        carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: -1 });
      }).toThrow('La cantidad debe ser mayor a cero');
    });

    test('error por precio negativo', () => {
      expect(() => {
        carrito.agregarProducto({ nombre: 'Laptop', precio: -1000, cantidad: 1 });
      }).toThrow('El precio no puede ser negativo');
    });

    test('permite precio cero', () => {
      carrito.agregarProducto({ nombre: 'Regalo', precio: 0, cantidad: 1 });
      expect(carrito.obtenerProductos()).toHaveLength(1);
    });
  });

  describe('Calcular subtotal', () => {
    test('subtotal correcto con un producto', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      expect(carrito.calcularSubtotal()).toBe(1000000);
    });

    test('subtotal correcto con múltiples productos', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      carrito.agregarProducto({ nombre: 'Mouse', precio: 50000, cantidad: 2 });
      carrito.agregarProducto({ nombre: 'Teclado', precio: 80000, cantidad: 1 });
      // 1000000 + (50000 * 2) + 80000 = 1180000
      expect(carrito.calcularSubtotal()).toBe(1180000);
    });

    test('subtotal correcto con cantidades múltiples', () => {
      carrito.agregarProducto({ nombre: 'Mouse', precio: 50000, cantidad: 3 });
      expect(carrito.calcularSubtotal()).toBe(150000);
    });

    test('subtotal es cero cuando no hay productos', () => {
      expect(carrito.calcularSubtotal()).toBe(0);
    });
  });

  describe('Aplicar cupones', () => {
    beforeEach(() => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
    });

    test('aplicación correcta de cupón DESC10', () => {
      carrito.aplicarCupon('DESC10');
      const descuento = carrito.calcularDescuento();
      expect(descuento).toBe(100000); // 10% de 1000000
    });

    test('aplicación correcta de cupón DESC20', () => {
      carrito.aplicarCupon('DESC20');
      const descuento = carrito.calcularDescuento();
      expect(descuento).toBe(200000); // 20% de 1000000
    });

    test('error por múltiples cupones', () => {
      carrito.aplicarCupon('DESC10');
      expect(() => {
        carrito.aplicarCupon('DESC20');
      }).toThrow('Ya se ha aplicado un cupón a esta compra');
    });

    test('error por cupón inválido', () => {
      expect(() => {
        carrito.aplicarCupon('INVALIDO');
      }).toThrow('Cupón inválido');
    });

    test('descuento es cero sin cupón', () => {
      expect(carrito.calcularDescuento()).toBe(0);
    });
  });

  describe('Calcular impuesto', () => {
    test('cálculo correcto de impuesto sin descuento', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      const impuesto = carrito.calcularImpuesto();
      expect(impuesto).toBe(190000); // 19% de 1000000
    });

    test('cálculo correcto de impuesto con descuento', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      carrito.aplicarCupon('DESC10');
      const impuesto = carrito.calcularImpuesto();
      // Subtotal: 1000000
      // Descuento 10%: 100000
      // Subtotal con descuento: 900000
      // Impuesto 19%: 171000
      expect(impuesto).toBe(171000);
    });

    test('impuesto es cero cuando no hay productos', () => {
      expect(carrito.calcularImpuesto()).toBe(0);
    });
  });

  describe('Calcular total final', () => {
    test('total correcto sin descuento', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      const total = carrito.calcularTotal();
      // Subtotal: 1000000
      // Impuesto 19%: 190000
      // Total: 1190000
      expect(total).toBe(1190000);
    });

    test('total correcto con cupón DESC10', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      carrito.aplicarCupon('DESC10');
      const total = carrito.calcularTotal();
      // Subtotal: 1000000
      // Descuento 10%: 100000
      // Subtotal con descuento: 900000
      // Impuesto 19%: 171000
      // Total: 1071000
      expect(total).toBe(1071000);
    });

    test('total correcto con cupón DESC20', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      carrito.aplicarCupon('DESC20');
      const total = carrito.calcularTotal();
      // Subtotal: 1000000
      // Descuento 20%: 200000
      // Subtotal con descuento: 800000
      // Impuesto 19%: 152000
      // Total: 952000
      expect(total).toBe(952000);
    });

    test('total correcto con múltiples productos y descuento', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      carrito.agregarProducto({ nombre: 'Mouse', precio: 50000, cantidad: 2 });
      carrito.aplicarCupon('DESC10');
      const total = carrito.calcularTotal();
      // Subtotal: 1100000
      // Descuento 10%: 110000
      // Subtotal con descuento: 990000
      // Impuesto 19%: 188100
      // Total: 1178100
      expect(total).toBe(1178100);
    });

    test('total nunca es negativo', () => {
      // Aunque este escenario es poco probable con las reglas actuales,
      // verificamos que el total nunca sea negativo
      const total = carrito.calcularTotal();
      expect(total).toBeGreaterThanOrEqual(0);
    });

    test('total es cero cuando no hay productos', () => {
      expect(carrito.calcularTotal()).toBe(0);
    });
  });

  describe('Resumen de compra', () => {
    test('resumen completo sin descuento', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      const resumen = carrito.obtenerResumen();
      
      expect(resumen.subtotal).toBe(1000000);
      expect(resumen.descuento).toBe(0);
      expect(resumen.subtotalConDescuento).toBe(1000000);
      expect(resumen.impuesto).toBe(190000);
      expect(resumen.total).toBe(1190000);
      expect(resumen.cuponAplicado).toBeNull();
      expect(resumen.cantidadProductos).toBe(1);
    });

    test('resumen completo con descuento', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      carrito.aplicarCupon('DESC10');
      const resumen = carrito.obtenerResumen();
      
      expect(resumen.subtotal).toBe(1000000);
      expect(resumen.descuento).toBe(100000);
      expect(resumen.subtotalConDescuento).toBe(900000);
      expect(resumen.impuesto).toBe(171000);
      expect(resumen.total).toBe(1071000);
      expect(resumen.cuponAplicado).toBe('DESC10');
      expect(resumen.cantidadProductos).toBe(1);
    });
  });

  describe('Limpiar carrito', () => {
    test('limpiar elimina productos y cupón', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      carrito.aplicarCupon('DESC10');
      
      carrito.limpiar();
      
      expect(carrito.obtenerProductos()).toHaveLength(0);
      expect(carrito.calcularTotal()).toBe(0);
      expect(carrito.obtenerResumen().cuponAplicado).toBeNull();
    });

    test('puede agregar productos después de limpiar', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      carrito.limpiar();
      carrito.agregarProducto({ nombre: 'Mouse', precio: 50000, cantidad: 1 });
      
      expect(carrito.obtenerProductos()).toHaveLength(1);
      expect(carrito.calcularSubtotal()).toBe(50000);
    });

    test('puede aplicar cupón después de limpiar', () => {
      carrito.agregarProducto({ nombre: 'Laptop', precio: 1000000, cantidad: 1 });
      carrito.aplicarCupon('DESC10');
      carrito.limpiar();
      
      carrito.agregarProducto({ nombre: 'Mouse', precio: 50000, cantidad: 1 });
      carrito.aplicarCupon('DESC20');
      
      expect(carrito.calcularDescuento()).toBe(10000); // 20% de 50000
    });
  });

  describe('Casos integrados complejos', () => {
    test('flujo completo de compra', () => {
      // Agregar productos
      carrito.agregarProducto({ nombre: 'Laptop', precio: 2000000, cantidad: 1 });
      carrito.agregarProducto({ nombre: 'Mouse', precio: 80000, cantidad: 2 });
      carrito.agregarProducto({ nombre: 'Teclado', precio: 150000, cantidad: 1 });
      
      // Subtotal: 2000000 + 160000 + 150000 = 2310000
      expect(carrito.calcularSubtotal()).toBe(2310000);
      
      // Aplicar cupón
      carrito.aplicarCupon('DESC20');
      
      // Descuento 20%: 462000
      expect(carrito.calcularDescuento()).toBe(462000);
      
      // Subtotal con descuento: 1848000
      expect(carrito.calcularSubtotalConDescuento()).toBe(1848000);
      
      // Impuesto 19%: 351120
      expect(carrito.calcularImpuesto()).toBe(351120);
      
      // Total: 2199120
      expect(carrito.calcularTotal()).toBe(2199120);
    });

    test('compra con productos de precio 0', () => {
      carrito.agregarProducto({ nombre: 'Producto normal', precio: 100000, cantidad: 1 });
      carrito.agregarProducto({ nombre: 'Regalo', precio: 0, cantidad: 1 });
      
      expect(carrito.calcularSubtotal()).toBe(100000);
      expect(carrito.calcularTotal()).toBe(119000); // 100000 + 19% impuesto
    });
  });
});
