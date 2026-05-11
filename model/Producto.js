class Producto {
    constructor(codigoProducto, nombreProducto, proveedor, stock, precioUnitario, categoriaProducto) {
        this.codigoProducto = codigoProducto;
        this.nombreProducto = nombreProducto;
        this.proveedor = proveedor;
        this.stock = parseInt(stock);
        this.precioUnitario = parseFloat(precioUnitario);
        this.categoriaProducto = categoriaProducto;
    }

    calcularPrecioFinal() {
        const subtotal = this.precioUnitario * this.stock;
        let descuentoPorcentaje = 0;

        switch(this.categoriaProducto) {
            case 'A':
                descuentoPorcentaje = 0.05;
                break;
            case 'L':
                descuentoPorcentaje = 0.08;
                break;
            case 'T':
                descuentoPorcentaje = 0.10;
                break;
            case 'R':
                descuentoPorcentaje = 0.15;
                break;
        }

        const descuento = subtotal * descuentoPorcentaje;
        return subtotal - descuento;
    }

    hallarTotalInventario(listaProductos) {
        if (!listaProductos) {
            return this.calcularPrecioFinal();
        }
        
        let total = 0;
        for (let i = 0; i < listaProductos.length; i++) {
            total += listaProductos[i].calcularPrecioFinal();
        }
        return total;
    }
}
