class Tecnologia extends Producto {
    constructor(codigoProducto, nombreProducto, proveedor, stock, precioUnitario, categoriaProducto, garantiaMeses) {
        super(codigoProducto, nombreProducto, proveedor, stock, precioUnitario, categoriaProducto);
        this.garantiaMeses = parseInt(garantiaMeses);
    }
}
