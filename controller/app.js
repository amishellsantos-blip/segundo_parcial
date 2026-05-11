document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const categoriaSelect = document.getElementById('categoriaProducto');
    const dynamicFields = document.getElementById('dynamicFields');
    const inventoryBody = document.getElementById('inventoryBody');
    const totalInventarioValor = document.getElementById('totalInventarioValor');
    const clearInventoryBtn = document.getElementById('clearInventoryBtn');

    const validarLetras = (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    };

    const validarNumeros = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    };

    document.getElementById('nombreProducto').addEventListener('input', validarLetras);
    document.getElementById('proveedor').addEventListener('input', validarLetras);
    document.getElementById('stock').addEventListener('input', validarNumeros);
    document.getElementById('precioUnitario').addEventListener('input', validarNumeros);

    let inventarioDatos = JSON.parse(localStorage.getItem('inventarioMercaRed')) || [];
    let inventarioInstancias = [];

    const instanciarProducto = (data) => {
        if (data.categoriaProducto === 'A') {
            return new Alimento(data.codigoProducto, data.nombreProducto, data.proveedor, data.stock, data.precioUnitario, data.categoriaProducto, data.fechaVencimiento);
        } else if (data.categoriaProducto === 'T') {
            return new Tecnologia(data.codigoProducto, data.nombreProducto, data.proveedor, data.stock, data.precioUnitario, data.categoriaProducto, data.garantiaMeses);
        } else {
            return new Producto(data.codigoProducto, data.nombreProducto, data.proveedor, data.stock, data.precioUnitario, data.categoriaProducto);
        }
    };

    const actualizarInstancias = () => {
        inventarioInstancias = inventarioDatos.map(data => instanciarProducto(data));
    };

    categoriaSelect.addEventListener('change', (e) => {
        const categoria = e.target.value;
        dynamicFields.style.display = 'flex';
        
        if (categoria === 'A') {
            dynamicFields.innerHTML = `
                <div class="form-group" style="width: 100%;">
                    <label for="fechaVencimiento">Fecha de Vencimiento</label>
                    <input type="date" id="fechaVencimiento" required>
                </div>
            `;
        } else if (categoria === 'T') {
            dynamicFields.innerHTML = `
                <div class="form-group" style="width: 100%;">
                    <label for="garantiaMeses">Garantía (Meses)</label>
                    <input type="number" id="garantiaMeses" min="1" required placeholder="Ej: 12">
                </div>
            `;
            document.getElementById('garantiaMeses').addEventListener('input', validarNumeros);
        } else {
            dynamicFields.style.display = 'none';
            dynamicFields.innerHTML = '';
        }
    });

    const obtenerNombreCategoria = (codigo) => {
        const categorias = {
            'A': 'Alimentos',
            'L': 'Aseo/Limpieza',
            'T': 'Tecnología',
            'R': 'Ropa'
        };
        return categorias[codigo] || 'Desconocido';
    };

    const formatearMoneda = (valor) => {
        return '$ ' + parseFloat(valor).toLocaleString('es-CO');
    };

    const renderizarInventario = () => {
        inventoryBody.innerHTML = '';
        actualizarInstancias();
        
        inventarioInstancias.forEach(prod => {
            const subtotal = prod.precioUnitario * prod.stock;
            const precioFinal = prod.calcularPrecioFinal();
            const descuento = subtotal - precioFinal;
            
            const tr = document.createElement('tr');
            
            let extraInfo = '';
            if (prod.categoriaProducto === 'A') {
                extraInfo = `<br><small style="color:var(--text-secondary)">Vence: ${prod.fechaVencimiento}</small>`;
            } else if (prod.categoriaProducto === 'T') {
                extraInfo = `<br><small style="color:var(--text-secondary)">Garantía: ${prod.garantiaMeses} meses</small>`;
            }

            tr.innerHTML = `
                <td><strong>${prod.codigoProducto}</strong></td>
                <td>${prod.nombreProducto} ${extraInfo}</td>
                <td>${prod.proveedor}</td>
                <td><span class="badge badge-${prod.categoriaProducto}">${obtenerNombreCategoria(prod.categoriaProducto)}</span></td>
                <td>${prod.stock}</td>
                <td>${formatearMoneda(prod.precioUnitario)}</td>
                <td style="color: var(--secondary)">-${formatearMoneda(descuento)}</td>
                <td class="font-bold">${formatearMoneda(precioFinal)}</td>
            `;
            inventoryBody.appendChild(tr);
        });

        let total = 0;
        if (inventarioInstancias.length > 0) {
            total = inventarioInstancias[0].hallarTotalInventario(inventarioInstancias);
        }
        
        totalInventarioValor.textContent = formatearMoneda(total);
    };

    const guardarInventario = () => {
        localStorage.setItem('inventarioMercaRed', JSON.stringify(inventarioDatos));
        renderizarInventario();
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const codigoProducto = document.getElementById('codigoProducto').value;
        const nombreProducto = document.getElementById('nombreProducto').value;
        const proveedor = document.getElementById('proveedor').value;
        const stock = document.getElementById('stock').value;
        const precioUnitario = document.getElementById('precioUnitario').value;
        const categoriaProducto = document.getElementById('categoriaProducto').value;

        const nuevoProductoDatos = {
            codigoProducto,
            nombreProducto,
            proveedor,
            stock: parseInt(stock),
            precioUnitario: parseFloat(precioUnitario),
            categoriaProducto
        };

        if (categoriaProducto === 'A') {
            nuevoProductoDatos.fechaVencimiento = document.getElementById('fechaVencimiento').value;
        } else if (categoriaProducto === 'T') {
            nuevoProductoDatos.garantiaMeses = parseInt(document.getElementById('garantiaMeses').value);
        }

        inventarioDatos.push(nuevoProductoDatos);
        guardarInventario();
        form.reset();
        dynamicFields.style.display = 'none';
    });

    clearInventoryBtn.addEventListener('click', () => {
        if (confirm('¿Está seguro de que desea limpiar todo el inventario?')) {
            inventarioDatos = [];
            guardarInventario();
        }
    });

    renderizarInventario();
});
