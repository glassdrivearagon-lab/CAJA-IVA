// ============ DATOS INICIALES ============

// Usuarios
const usuarios = [
    { username: 'admin', password: 'admin123', role: 'admin', nombre: 'Administrador General' },
    { username: 'taller1', password: 'taller123', role: 'taller', nombre: 'Usuario Madrid', tallerId: 1 },
    { username: 'taller2', password: 'taller123', role: 'taller', nombre: 'Usuario Barcelona', tallerId: 2 },
    { username: 'taller3', password: 'taller123', role: 'taller', nombre: 'Usuario Valencia', tallerId: 3 },
    { username: 'taller4', password: 'taller123', role: 'taller', nombre: 'Usuario Sevilla', tallerId: 4 }
];

// Talleres
const talleres = [
    { id: 1, nombre: 'GlassDrive Madrid Centro', ubicacion: 'Madrid', codigo: 'GD-MAD-001', saldoCaja: 200.00 },
    { id: 2, nombre: 'GlassDrive Barcelona Norte', ubicacion: 'Barcelona', codigo: 'GD-BCN-002', saldoCaja: 150.00 },
    { id: 3, nombre: 'GlassDrive Valencia', ubicacion: 'Valencia', codigo: 'GD-VLC-003', saldoCaja: 100.00 },
    { id: 4, nombre: 'GlassDrive Sevilla', ubicacion: 'Sevilla', codigo: 'GD-SVQ-004', saldoCaja: 175.00 }
];

// Tipos de Apunte
const tiposApunte = [
    { id: 1, nombre: 'IVA', codigo: 'IVA', color: '#4ECDC4' },
    { id: 2, nombre: 'EXCESO DE COBERTURA', codigo: 'EXCESO', color: '#FFE66D' },
    { id: 3, nombre: 'FRANQUICIA', codigo: 'FRANQ', color: '#F38181' },
    { id: 4, nombre: 'MOVIMIENTO DE CAJA', codigo: 'MOV_CAJA', color: '#AA96DA' },
    { id: 5, nombre: 'COBRO TPV', codigo: 'TPV', color: '#95E1D3' }
];

// Métodos de Pago
const metodosPago = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'DOMICILIACION'];

// Clientes Iniciales
let clientes = [
    { id: 1, nombre: 'Juan Pérez García', tipo: 'particular', nif: '12345678A' },
    { id: 2, nombre: 'María López Martínez', tipo: 'particular', nif: '87654321B' },
    { id: 3, nombre: 'Transportes Rodríguez S.L.', tipo: 'empresa', nif: 'B12345678' },
    { id: 4, nombre: 'AutoFleet Solutions S.A.', tipo: 'empresa', nif: 'A87654321' },
    { id: 5, nombre: 'Carlos Sánchez (Autónomo)', tipo: 'autonomo', nif: '45678912C' },
    { id: 6, nombre: 'Ana Martínez Fernández', tipo: 'particular', nif: '23456789D' },
    { id: 7, nombre: 'Logística Express S.L.', tipo: 'empresa', nif: 'B23456789' },
    { id: 8, nombre: 'Pedro Gómez (Autónomo)', tipo: 'autonomo', nif: '34567890E' }
];

// ============ ESTADO GLOBAL ============

let usuarioActual = null;
let apuntes = [];
let movimientosCaja = [];
let contadoresID = {};

// Inicializar contadores de ID por taller
talleres.forEach(taller => {
    contadoresID[taller.id] = 0;
});

// ============ FUNCIONES DE LOGIN ============

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    const usuario = usuarios.find(u => u.username === username && u.password === password);
    
    if (usuario) {
        usuarioActual = usuario;
        errorDiv.textContent = '';
        mostrarVistaPrincipal();
    } else {
        errorDiv.textContent = 'Usuario o contraseña incorrectos';
    }
}

function handleLogout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        usuarioActual = null;
        apuntes = [];
        movimientosCaja = [];
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('mainScreen').classList.remove('active');
        mostrarSeccion('dashboardAdmin');
    }
}

// ============ FUNCIONES DE INTERFAZ ============

function mostrarVistaPrincipal() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    
    // Actualizar info de usuario
    const userInfo = document.getElementById('userInfo');
    if (usuarioActual.role === 'admin') {
        userInfo.textContent = 'Administrador General';
        document.getElementById('adminMenu').style.display = 'block';
        document.getElementById('tallerMenu').style.display = 'none';
        mostrarSeccion('dashboardAdmin');
    } else {
        const taller = talleres.find(t => t.id === usuarioActual.tallerId);
        userInfo.textContent = `${usuarioActual.nombre} - ${taller.nombre}`;
        document.getElementById('adminMenu').style.display = 'none';
        document.getElementById('tallerMenu').style.display = 'block';
        mostrarSeccion('nuevoApunte');
        cargarDatosFormulario();
    }
}

function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const seccion = document.getElementById(seccionId);
    if (seccion) {
        seccion.classList.add('active');
        
        // Ejecutar funciones de carga específicas
        switch(seccionId) {
            case 'dashboardAdmin':
                actualizarDashboardAdmin();
                break;
            case 'controlCaja':
                cargarSelectTalleresCaja();
                break;
            case 'controlTPV':
                cargarSelectTalleresTPV();
                loadCobroTPVAdmin();
                break;
            case 'talleres':
                cargarTalleres();
                break;
            case 'nuevoApunte':
                cargarDatosFormulario();
                break;
            case 'cajaDia':
                actualizarCajaDia();
                break;
            case 'controlTPVTaller':
                actualizarControlTPVTaller();
                break;
            case 'historial':
                cargarHistorial();
                break;
        }
    }
}

function showSection(seccionId) {
    mostrarSeccion(seccionId);
    return false;
}

// ============ FUNCIONES DE FORMULARIO ============

function cargarDatosFormulario() {
    // Cargar tipos de apunte
    const selectTipo = document.getElementById('apunteTipo');
    selectTipo.innerHTML = '<option value="">-- Selecciona tipo --</option>';
    tiposApunte.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id;
        option.textContent = tipo.nombre;
        selectTipo.appendChild(option);
    });
    
    // Cargar métodos de pago
    const selectPago = document.getElementById('apuntePago');
    selectPago.innerHTML = '<option value="">-- Selecciona método --</option>';
    metodosPago.forEach(metodo => {
        const option = document.createElement('option');
        option.value = metodo;
        option.textContent = metodo;
        selectPago.appendChild(option);
    });
    
    // Establecer fecha de hoy
    document.getElementById('apunteFecha').valueAsDate = new Date();
    
    // Generar número de ID
    generarNumeroID();
    
    // Cargar cliente
    cargarClientesEnFormulario();
}

function generarNumeroID() {
    if (usuarioActual.role === 'taller') {
        const tallerId = usuarioActual.tallerId;
        const taller = talleres.find(t => t.id === tallerId);
        contadoresID[tallerId]++;
        const numero = String(contadoresID[tallerId]).padStart(4, '0');
        const anio = new Date().getFullYear();
        const codigoTaller = taller.codigo.split('-')[1];
        document.getElementById('apunteID').value = `${codigoTaller}-${anio}-${numero}`;
    }
}

function cargarClientesEnFormulario() {
    const input = document.getElementById('apunteCliente');
    const dropdown = document.getElementById('clienteDropdown');
    
    input.addEventListener('input', (e) => {
        const valor = e.target.value.toLowerCase();
        
        if (valor.length === 0) {
            dropdown.classList.remove('active');
            return;
        }
        
        const filtrados = clientes.filter(c => c.nombre.toLowerCase().includes(valor));
        
        if (filtrados.length === 0) {
            dropdown.innerHTML = '<div class="dropdown-item">No hay clientes</div>';
        } else {
            dropdown.innerHTML = filtrados.map(cliente => 
                `<div class="dropdown-item" onclick="seleccionarCliente(${cliente.id}, '${cliente.nombre}')">${cliente.nombre}</div>`
            ).join('');
        }
        
        dropdown.classList.add('active');
    });
    
    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
        if (e.target.id !== 'apunteCliente') {
            dropdown.classList.remove('active');
        }
    });
}

function seleccionarCliente(clienteId, nombre) {
    document.getElementById('apunteCliente').value = nombre;
    document.getElementById('apunteClienteID').value = clienteId;
    document.getElementById('clienteDropdown').classList.remove('active');
}

function actualizarInfoApunte() {
    const tipoId = document.getElementById('apunteTipo').value;
    const tipo = tiposApunte.find(t => t.id == tipoId);
    const infoBox = document.getElementById('infoApunte');
    
    if (tipo) {
        infoBox.innerHTML = `
            <strong>${tipo.nombre}</strong><br>
            ${tipo.codigo === 'IVA' ? 'Cobro de IVA al cliente' : 
              tipo.codigo === 'EXCESO' ? 'Importe que excede la cobertura del seguro' :
              tipo.codigo === 'FRANQ' ? 'Franquicia a cargo del asegurado' :
              tipo.codigo === 'MOV_CAJA' ? 'Movimiento de efectivo en caja' :
              tipo.codigo === 'TPV' ? 'Cobro mediante terminal punto de venta' : ''}
        `;
        infoBox.style.display = 'block';
    } else {
        infoBox.style.display = 'none';
    }
}

function handleGuardarApunte(event) {
    event.preventDefault();
    
    const fecha = document.getElementById('apunteFecha').value;
    const numeroID = document.getElementById('apunteID').value;
    const tipoId = parseInt(document.getElementById('apunteTipo').value);
    const clienteId = parseInt(document.getElementById('apunteClienteID').value);
    const importe = parseFloat(document.getElementById('apunteImporte').value);
    const metodoPago = document.getElementById('apuntePago').value;
    const facturaALTAI = document.getElementById('apunteALTAI').value;
    const cobrado = document.getElementById('apunteCobrado').checked;
    const notas = document.getElementById('apunteNotas').value;
    
    // Validaciones
    if (!fecha || !tipoId || !clienteId || !importe || !metodoPago) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (importe <= 0) {
        mostrarNotificacion('El importe debe ser mayor a 0', 'error');
        return;
    }
    
    const apunte = {
        id: numeroID,
        fecha,
        tipoId,
        clienteId,
        importe,
        metodoPago,
        facturaALTAI,
        cobrado,
        notas,
        tallerId: usuarioActual.tallerId,
        timestamp: new Date().toLocaleTimeString()
    };
    
    apuntes.push(apunte);
    
    // Si es efectivo, crear movimiento de caja
    if (metodoPago === 'EFECTIVO') {
        const movimiento = {
            fecha,
            concepto: `Cobro IVA - ${apunte.id}`,
            tipo: 'entrada',
            importe,
            tallerId: usuarioActual.tallerId
        };
        movimientosCaja.push(movimiento);
        
        // Actualizar saldo de caja
        const taller = talleres.find(t => t.id === usuarioActual.tallerId);
        if (taller) {
            taller.saldoCaja += importe;
        }
    }
    
    mostrarNotificacion('Apunte guardado correctamente', 'success');
    document.getElementById('formNuevoApunte').reset();
    cargarDatosFormulario();
    actualizarCajaDia();
}

// ============ FUNCIONES DE CLIENTE ============

function abrirModalCliente() {
    document.getElementById('modalCliente').classList.add('active');
}

function cerrarModalCliente() {
    document.getElementById('modalCliente').classList.remove('active');
    document.getElementById('formNuevoCliente').reset();
}

function handleGuardarCliente(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('clienteNombre').value;
    const tipo = document.getElementById('clienteTipo').value;
    const nif = document.getElementById('clienteNIF').value;
    
    const nuevoCliente = {
        id: Math.max(...clientes.map(c => c.id), 0) + 1,
        nombre,
        tipo,
        nif
    };
    
    clientes.push(nuevoCliente);
    
    mostrarNotificacion('Cliente añadido correctamente', 'success');
    cerrarModalCliente();
    
    // Seleccionar el cliente en el formulario
    seleccionarCliente(nuevoCliente.id, nuevoCliente.nombre);
}

// ============ FUNCIONES DE CAJA ============

function actualizarCajaDia() {
    const hoy = new Date().toISOString().split('T')[0];
    const apuntesHoy = apuntes.filter(a => a.fecha === hoy && a.tallerId === usuarioActual.tallerId);
    const taller = talleres.find(t => t.id === usuarioActual.tallerId);
    
    // Calcular totales
    const totalIVA = apuntesHoy.reduce((sum, a) => sum + a.importe, 0);
    const totalEfectivo = apuntesHoy
        .filter(a => a.metodoPago === 'EFECTIVO')
        .reduce((sum, a) => sum + a.importe, 0);
    
    // Actualizar cards
    document.getElementById('saldoInicialCard').textContent = `€${taller.saldoCaja.toFixed(2)}`;
    document.getElementById('totalIVACard').textContent = `€${totalIVA.toFixed(2)}`;
    document.getElementById('totalEfectivoCard').textContent = `€${totalEfectivo.toFixed(2)}`;
    document.getElementById('saldoActualCard').textContent = `€${taller.saldoCaja.toFixed(2)}`;
    
    // Cargar tabla de apuntes
    const tabla = document.getElementById('tablaApuntesDia').querySelector('tbody');
    tabla.innerHTML = apuntesHoy.map(apunte => {
        const cliente = clientes.find(c => c.id === apunte.clienteId);
        const tipo = tiposApunte.find(t => t.id === apunte.tipoId);
        return `
            <tr>
                <td>${apunte.timestamp}</td>
                <td>${apunte.id}</td>
                <td>${tipo.nombre}</td>
                <td>${cliente.nombre}</td>
                <td>€${apunte.importe.toFixed(2)}</td>
                <td>${apunte.metodoPago}</td>
                <td><span class="estado-${apunte.cobrado ? 'cobrado' : 'pendiente'}">${apunte.cobrado ? 'SÍ' : 'NO'}</span></td>
                <td>
                    <button class="btn btn-small" onclick="editarApunte('${apunte.id}')">Editar</button>
                    <button class="btn btn-small btn-danger" onclick="eliminarApunte('${apunte.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    }).join('');
}

function cargarSelectTalleresCaja() {
    const select = document.getElementById('filterTallerCaja');
    select.innerHTML = '<option value="">-- Todos los talleres --</option>';
    talleres.forEach(taller => {
        const option = document.createElement('option');
        option.value = taller.id;
        option.textContent = taller.nombre;
        select.appendChild(option);
    });
}

function loadCajaTaller() {
    const tallerId = document.getElementById('filterTallerCaja').value;
    const taller = talleres.find(t => t.id == tallerId) || talleres[0];
    
    const hoy = new Date().toISOString().split('T')[0];
    const movimientos = movimientosCaja.filter(m => 
        (!tallerId || m.tallerId == tallerId) && m.fecha === hoy
    );
    
    document.getElementById('saldoInicial').textContent = `€${(taller.saldoCaja).toFixed(2)}`;
    document.getElementById('movimientosHoy').textContent = `€${movimientos.reduce((s, m) => s + (m.tipo === 'entrada' ? m.importe : -m.importe), 0).toFixed(2)}`;
    document.getElementById('saldoActual').textContent = `€${taller.saldoCaja.toFixed(2)}`;
    
    // Cargar tabla
    const tabla = document.getElementById('tablaCajaDia').querySelector('tbody');
    tabla.innerHTML = movimientos.map(mov => `
        <tr>
            <td>${mov.fecha}</td>
            <td>${mov.concepto}</td>
            <td>${mov.tipo === 'entrada' ? 'Entrada' : 'Salida'}</td>
            <td style="color: ${mov.tipo === 'entrada' ? 'green' : 'red'}">€${mov.importe.toFixed(2)}</td>
        </tr>
    `).join('');
}

function arquearCaja() {
    if (confirm('¿Deseas cerrar la caja del día?')) {
        mostrarNotificacion('Caja arqueada correctamente', 'success');
    }
}

// ============ FUNCIONES DE TPV ============

function actualizarControlTPVTaller() {
    const hoy = new Date().toISOString().split('T')[0];
    const apuntesTPV = apuntes.filter(a => 
        a.fecha === hoy && 
        a.metodoPago === 'TARJETA' && 
        a.tallerId === usuarioActual.tallerId
    );
    
    const totalTPV = apuntesTPV.reduce((sum, a) => sum + a.importe, 0);
    
    document.getElementById('totalTPVDia').textContent = `€${totalTPV.toFixed(2)}`;
    document.getElementById('numTransTPV').textContent = apuntesTPV.length;
    
    const tabla = document.getElementById('tablaTPVTaller').querySelector('tbody');
    tabla.innerHTML = apuntesTPV.map(apunte => {
        const cliente = clientes.find(c => c.id === apunte.clienteId);
        return `
            <tr>
                <td>${apunte.timestamp}</td>
                <td>${apunte.id}</td>
                <td>${cliente.nombre}</td>
                <td>€${apunte.importe.toFixed(2)}</td>
                <td><span class="estado-${apunte.cobrado ? 'cobrado' : 'pendiente'}">${apunte.cobrado ? 'SÍ' : 'NO'}</span></td>
                <td>
                    <button class="btn btn-small" onclick="marcarCobroTPV('${apunte.id}')">
                        ${apunte.cobrado ? 'Desmarcar' : 'Cobrado'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function cargarSelectTalleresTPV() {
    const select = document.getElementById('filterTallerTPV');
    select.innerHTML = '<option value="">-- Todos --</option>';
    talleres.forEach(taller => {
        const option = document.createElement('option');
        option.value = taller.id;
        option.textContent = taller.nombre;
        select.appendChild(option);
    });
}

function loadCobroTPVAdmin() {
    const tallerId = document.getElementById('filterTallerTPV').value;
    const estado = document.getElementById('filterEstadoTPV').value;
    
    let apuntesTPV = apuntes.filter(a => a.metodoPago === 'TARJETA');
    
    if (tallerId) {
        apuntesTPV = apuntesTPV.filter(a => a.tallerId == tallerId);
    }
    
    if (estado) {
        const cobrado = estado === 'si';
        apuntesTPV = apuntesTPV.filter(a => a.cobrado === cobrado);
    }
    
    const tabla = document.getElementById('tablaTPVAdmin').querySelector('tbody');
    tabla.innerHTML = apuntesTPV.map(apunte => {
        const cliente = clientes.find(c => c.id === apunte.clienteId);
        const taller = talleres.find(t => t.id === apunte.tallerId);
        return `
            <tr>
                <td>${apunte.fecha}</td>
                <td>${apunte.id}</td>
                <td>${taller.nombre}</td>
                <td>${cliente.nombre}</td>
                <td>€${apunte.importe.toFixed(2)}</td>
                <td><span class="estado-${apunte.cobrado ? 'cobrado' : 'pendiente'}">${apunte.cobrado ? 'SÍ' : 'NO'}</span></td>
                <td>
                    <button class="btn btn-small" onclick="marcarCobroTPV('${apunte.id}')">
                        ${apunte.cobrado ? 'Desmarcar' : 'Cobrado'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function marcarCobroTPV(apunteId) {
    const apunte = apuntes.find(a => a.id === apunteId);
    if (apunte) {
        apunte.cobrado = !apunte.cobrado;
        mostrarNotificacion('Estado actualizado', 'success');
        loadCobroTPVAdmin();
        actualizarControlTPVTaller();
    }
}

// ============ FUNCIONES DE HISTORIAL ============

function cargarHistorial() {
    const tallerHistorial = apuntes.filter(a => a.tallerId === usuarioActual.tallerId);
    cargarTablaHistorial(tallerHistorial);
    
    // Cargar selectores de filtros
    const selectTipo = document.getElementById('filterHistorialTipo');
    selectTipo.innerHTML = '<option value="">-- Todos --</option>';
    tiposApunte.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id;
        option.textContent = tipo.nombre;
        selectTipo.appendChild(option);
    });
    
    const selectPago = document.getElementById('filterHistorialPago');
    selectPago.innerHTML = '<option value="">-- Todos --</option>';
    metodosPago.forEach(metodo => {
        const option = document.createElement('option');
        option.value = metodo;
        option.textContent = metodo;
        selectPago.appendChild(option);
    });
}

function cargarTablaHistorial(apuntesFilter) {
    const tabla = document.getElementById('tablaHistorial').querySelector('tbody');
    tabla.innerHTML = apuntesFilter.map(apunte => {
        const cliente = clientes.find(c => c.id === apunte.clienteId);
        const tipo = tiposApunte.find(t => t.id === apunte.tipoId);
        return `
            <tr>
                <td>${apunte.fecha}</td>
                <td>${apunte.id}</td>
                <td>${tipo.nombre}</td>
                <td>${cliente.nombre}</td>
                <td>€${apunte.importe.toFixed(2)}</td>
                <td>${apunte.metodoPago}</td>
                <td><span class="estado-${apunte.cobrado ? 'cobrado' : 'pendiente'}">${apunte.cobrado ? 'SÍ' : 'NO'}</span></td>
                <td>
                    <button class="btn btn-small" onclick="editarApunte('${apunte.id}')">Editar</button>
                    <button class="btn btn-small btn-danger" onclick="eliminarApunte('${apunte.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    }).join('');
}

function aplicarFiltrosHistorial() {
    const fecha = document.getElementById('filterHistorialFecha').value;
    const tipo = document.getElementById('filterHistorialTipo').value;
    const pago = document.getElementById('filterHistorialPago').value;
    
    let filtrados = apuntes.filter(a => a.tallerId === usuarioActual.tallerId);
    
    if (fecha) filtrados = filtrados.filter(a => a.fecha === fecha);
    if (tipo) filtrados = filtrados.filter(a => a.tipoId == tipo);
    if (pago) filtrados = filtrados.filter(a => a.metodoPago === pago);
    
    cargarTablaHistorial(filtrados);
}

function limpiarFiltrosHistorial() {
    document.getElementById('filterHistorialFecha').value = '';
    document.getElementById('filterHistorialTipo').value = '';
    document.getElementById('filterHistorialPago').value = '';
    cargarHistorial();
}

// ============ FUNCIONES DE ADMINISTRADOR ============

function actualizarDashboardAdmin() {
    const hoy = new Date().toISOString().split('T')[0];
    
    const apuntesHoy = apuntes.filter(a => a.fecha === hoy);
    const totalIVA = apuntesHoy.reduce((sum, a) => sum + a.importe, 0);
    const totalMovCaja = movimientosCaja
        .filter(m => m.fecha === hoy)
        .reduce((sum, m) => sum + m.importe, 0);
    const totalTPV = apuntesHoy
        .filter(a => a.metodoPago === 'TARJETA')
        .reduce((sum, a) => sum + a.importe, 0);
    
    document.getElementById('totalIVAHoy').textContent = `€${totalIVA.toFixed(2)}`;
    document.getElementById('totalMovCaja').textContent = `€${totalMovCaja.toFixed(2)}`;
    document.getElementById('totalCobroTPV').textContent = `€${totalTPV.toFixed(2)}`;
    document.getElementById('totalApuntes').textContent = apuntesHoy.length;
}

function cargarTalleres() {
    const tabla = document.getElementById('tablaTalleres').querySelector('tbody');
    tabla.innerHTML = talleres.map(taller => {
        const apuntesTaller = apuntes.filter(a => a.tallerId === taller.id);
        const hoy = new Date().toISOString().split('T')[0];
        const apuntesHoy = apuntesTaller.filter(a => a.fecha === hoy);
        
        return `
            <tr>
                <td>${taller.codigo}</td>
                <td>${taller.nombre}</td>
                <td>${taller.ubicacion}</td>
                <td>€${taller.saldoCaja.toFixed(2)}</td>
                <td>${apuntesHoy.length}</td>
                <td>
                    <button class="btn btn-small" onclick="verDetalleTaller(${taller.id})">Ver Detalle</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ============ FUNCIONES AUXILIARES ============

function editarApunte(apunteId) {
    mostrarNotificacion('Funcionalidad en desarrollo', 'warning');
}

function eliminarApunte(apunteId) {
    if (confirm('¿Deseas eliminar este apunte?')) {
        const index = apuntes.findIndex(a => a.id === apunteId);
        if (index > -1) {
            apuntes.splice(index, 1);
            mostrarNotificacion('Apunte eliminado', 'success');
            actualizarCajaDia();
        }
    }
}

function verDetalleTaller(tallerId) {
    mostrarNotificacion('Funcionalidad en desarrollo', 'warning');
}

function generarReporte() {
    mostrarNotificacion('Generando reporte...', 'success');
}

function exportarCSV() {
    const hoy = new Date().toISOString().split('T')[0];
    const apuntesExportar = apuntes.filter(a => a.fecha === hoy);
    
    let csv = 'Fecha,ID,Tipo,Cliente,Importe,Método Pago,Cobrado,Notas\n';
    apuntesExportar.forEach(apunte => {
        const cliente = clientes.find(c => c.id === apunte.clienteId);
        const tipo = tiposApunte.find(t => t.id === apunte.tipoId);
        csv += `${apunte.fecha},${apunte.id},${tipo.nombre},"${cliente.nombre}",${apunte.importe},${apunte.metodoPago},${apunte.cobrado ? 'SÍ' : 'NO'},"${apunte.notas}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${hoy}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.className = `notification active ${tipo}`;
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// ============ INICIALIZACIÓN ============

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar con secciones ocultas
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
});
