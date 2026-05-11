class Alimento extends Producto {
    constructor(codigoProducto, nombreProducto, proveedor, stock, precioUnitario, categoriaProducto, fechaVencimiento) {
        super(codigoProducto, nombreProducto, proveedor, stock, precioUnitario, categoriaProducto);
        this.fechaVencimiento = fechaVencimiento;
    }
}
