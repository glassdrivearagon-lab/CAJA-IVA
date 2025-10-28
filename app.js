// ==================== DATA STRUCTURES ====================

const casosIVA = [
  {
    id: 1,
    nombre: 'Cliente Particular',
    codigo: 'B2C',
    descripcion: 'Cliente es persona física sin actividad empresarial',
    iva_porcentaje: 21,
    quien_paga_iva: 'Cliente',
    iva_deducible: false,
    color: '#FF6B6B',
    instrucciones: 'Facturar con IVA al 21%. El cliente paga el total incluyendo IVA.'
  },
  {
    id: 2,
    nombre: 'Cliente Empresa/Autónomo',
    codigo: 'B2B',
    descripcion: 'Cliente es empresa o autónomo con CIF/NIF',
    iva_porcentaje: 21,
    quien_paga_iva: 'Empresa (deducible)',
    iva_deducible: true,
    color: '#4ECDC4',
    instrucciones: 'Facturar con IVA al 21%. La empresa puede deducir el IVA en su declaración trimestral.'
  },
  {
    id: 3,
    nombre: 'Seguro - Vehículo Particular',
    codigo: 'SEG_PART',
    descripcion: 'Reparación cubierta por seguro, vehículo de particular',
    iva_porcentaje: 21,
    quien_paga_iva: 'Cliente particular (normalmente)',
    iva_deducible: false,
    color: '#FFE66D',
    instrucciones: 'Aseguradora paga reparación sin IVA. Cliente paga el IVA del 21%. Verificar contrato de seguro.'
  },
  {
    id: 4,
    nombre: 'Seguro - Vehículo Empresa',
    codigo: 'SEG_EMP',
    descripcion: 'Reparación cubierta por seguro, vehículo de empresa',
    iva_porcentaje: 21,
    quien_paga_iva: 'Empresa propietaria',
    iva_deducible: true,
    color: '#95E1D3',
    instrucciones: 'Aseguradora paga sin IVA. Empresa paga IVA pero lo recupera de Hacienda. Facturar a nombre de la empresa.'
  },
  {
    id: 5,
    nombre: 'Con Franquicia de Seguro',
    codigo: 'FRANQ_SEG',
    descripcion: 'Reparación con parte a cargo del cliente (franquicia)',
    iva_porcentaje: 21,
    quien_paga_iva: 'Según tipo de cliente',
    iva_deducible: 'Depende del cliente',
    color: '#F38181',
    instrucciones: 'IVA se calcula sobre importe TOTAL (seguro + franquicia). Indicar en factura ambas partes.'
  },
  {
    id: 6,
    nombre: 'Exceso Límite Facturación',
    codigo: 'EXCESO',
    descripcion: 'Taller supera límite anual de facturación',
    iva_porcentaje: 21,
    quien_paga_iva: 'Obligatorio aplicar IVA',
    iva_deducible: 'N/A',
    color: '#AA96DA',
    instrucciones: 'Si facturación anual supera 85.000€, se pierde exención. Aplicar IVA obligatoriamente.'
  }
];

const talleres = [
  { id: 1, nombre: 'GlassDrive Madrid Centro', ubicacion: 'Madrid', codigo: 'GD-MAD-001' },
  { id: 2, nombre: 'GlassDrive Barcelona Norte', ubicacion: 'Barcelona', codigo: 'GD-BCN-002' },
  { id: 3, nombre: 'GlassDrive Valencia', ubicacion: 'Valencia', codigo: 'GD-VLC-003' },
  { id: 4, nombre: 'GlassDrive Sevilla', ubicacion: 'Sevilla', codigo: 'GD-SVQ-004' }
];

const metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia', 'Seguro', 'Mixto'];

const usuarios = [
  { username: 'admin', password: 'admin123', role: 'admin', nombre: 'Administrador General' },
  { username: 'taller1', password: 'taller123', role: 'taller', nombre: 'Usuario Madrid', taller_id: 1 },
  { username: 'taller2', password: 'taller123', role: 'taller', nombre: 'Usuario Barcelona', taller_id: 2 },
  { username: 'taller3', password: 'taller123', role: 'taller', nombre: 'Usuario Valencia', taller_id: 3 },
  { username: 'taller4', password: 'taller123', role: 'taller', nombre: 'Usuario Sevilla', taller_id: 4 }
];

// ==================== GLOBAL STATE ====================

let currentUser = null;
let trabajos = [];
let orderCounters = { 1: 1, 2: 1, 3: 1, 4: 1 };

// Initialize with sample data
function initializeSampleData() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  trabajos = [
    {
      id: Date.now() + 1,
      taller_id: 1,
      fecha: today,
      num_orden: 'GD-MAD-001-001',
      tipo_cliente_id: 1,
      nombre_cliente: 'Juan García',
      nif_cif: '',
      descripcion: 'Sustitución parabrisas delantero',
      base_imponible: 250,
      iva_porcentaje: 21,
      iva_importe: 52.5,
      total: 302.5,
      metodo_pago: 'Tarjeta',
      notas: ''
    },
    {
      id: Date.now() + 2,
      taller_id: 1,
      fecha: today,
      num_orden: 'GD-MAD-001-002',
      tipo_cliente_id: 2,
      nombre_cliente: 'Transportes López S.L.',
      nif_cif: 'B12345678',
      descripcion: 'Reparación luneta trasera',
      base_imponible: 180,
      iva_porcentaje: 21,
      iva_importe: 37.8,
      total: 217.8,
      metodo_pago: 'Transferencia',
      notas: 'Factura a nombre de la empresa'
    },
    {
      id: Date.now() + 3,
      taller_id: 2,
      fecha: today,
      num_orden: 'GD-BCN-002-001',
      tipo_cliente_id: 3,
      nombre_cliente: 'María Fernández',
      nif_cif: '',
      descripcion: 'Cambio parabrisas con cobertura de seguro',
      base_imponible: 320,
      iva_porcentaje: 21,
      iva_importe: 67.2,
      total: 387.2,
      metodo_pago: 'Mixto',
      notas: 'Seguro cubre base, cliente paga IVA'
    },
    {
      id: Date.now() + 4,
      taller_id: 1,
      fecha: yesterday,
      num_orden: 'GD-MAD-001-003',
      tipo_cliente_id: 1,
      nombre_cliente: 'Pedro Martínez',
      nif_cif: '',
      descripcion: 'Reparación de impacto',
      base_imponible: 85,
      iva_porcentaje: 21,
      iva_importe: 17.85,
      total: 102.85,
      metodo_pago: 'Efectivo',
      notas: ''
    }
  ];

  orderCounters = { 1: 4, 2: 2, 3: 1, 4: 1 };
}

// ==================== UTILITY FUNCTIONS ====================

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' €';
}

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function showConfirm(title, message, onConfirm) {
  const modal = document.getElementById('confirmModal');
  const titleEl = document.getElementById('confirmTitle');
  const messageEl = document.getElementById('confirmMessage');
  const yesBtn = document.getElementById('confirmYes');
  const noBtn = document.getElementById('confirmNo');

  titleEl.textContent = title;
  messageEl.textContent = message;
  modal.classList.remove('hidden');

  const handleYes = () => {
    modal.classList.add('hidden');
    onConfirm();
    cleanup();
  };

  const handleNo = () => {
    modal.classList.add('hidden');
    cleanup();
  };

  const cleanup = () => {
    yesBtn.removeEventListener('click', handleYes);
    noBtn.removeEventListener('click', handleNo);
  };

  yesBtn.addEventListener('click', handleYes);
  noBtn.addEventListener('click', handleNo);
}

function getCasoIVAById(id) {
  return casosIVA.find(c => c.id === parseInt(id));
}

function getTallerById(id) {
  return talleres.find(t => t.id === parseInt(id));
}

// ==================== LOGIN ====================

function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('loginError');

  const user = usuarios.find(u => u.username === username && u.password === password);

  if (user) {
    currentUser = user;
    errorEl.classList.add('hidden');
    showMainApp();
  } else {
    errorEl.textContent = 'Usuario o contraseña incorrectos';
    errorEl.classList.remove('hidden');
  }
}

function handleLogout() {
  currentUser = null;
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('loginForm').reset();
}

function showMainApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');

  // Update header
  const userInfo = document.getElementById('userInfo');
  if (currentUser.role === 'admin') {
    userInfo.textContent = currentUser.nombre;
  } else {
    const taller = getTallerById(currentUser.taller_id);
    userInfo.textContent = `${currentUser.nombre} - ${taller.nombre}`;
  }

  // Setup navigation
  setupNavigation();

  // Show default view
  if (currentUser.role === 'admin') {
    showView('adminDashboard');
    updateAdminDashboard();
  } else {
    showView('tallerNuevoTrabajo');
    setupTallerForms();
  }
}

// ==================== NAVIGATION ====================

function setupNavigation() {
  const nav = document.getElementById('mainNav');
  nav.innerHTML = '';

  let navItems = [];

  if (currentUser.role === 'admin') {
    navItems = [
      { id: 'adminDashboard', label: '📊 Dashboard' },
      { id: 'adminTalleres', label: '🏢 Talleres' },
      { id: 'adminReportes', label: '📈 Reportes' }
    ];
  } else {
    navItems = [
      { id: 'tallerNuevoTrabajo', label: '➕ Nuevo Trabajo' },
      { id: 'tallerCajaDia', label: '💰 Caja del Día' },
      { id: 'tallerHistorial', label: '📋 Historial' }
    ];
  }

  navItems.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'nav-item';
    btn.textContent = item.label;
    btn.onclick = () => {
      showView(item.id);
      if (item.id === 'adminDashboard') updateAdminDashboard();
      if (item.id === 'adminTalleres') renderTalleresView();
      if (item.id === 'adminReportes') setupReportesView();
      if (item.id === 'tallerCajaDia') renderCajaDia();
      if (item.id === 'tallerHistorial') renderHistorial();
    };
    nav.appendChild(btn);
  });

  // Set first item as active
  nav.querySelector('.nav-item').classList.add('active');
}

function showView(viewId) {
  // Hide all views
  document.querySelectorAll('.view-section').forEach(view => {
    view.classList.add('hidden');
  });

  // Show selected view
  document.getElementById(viewId).classList.remove('hidden');

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Update header title
  const titles = {
    'adminDashboard': 'Dashboard General',
    'adminTalleres': 'Gestión de Talleres',
    'adminReportes': 'Reportes e Informes',
    'tallerNuevoTrabajo': 'Registrar Nuevo Trabajo',
    'tallerCajaDia': 'Caja del Día',
    'tallerHistorial': 'Historial de Trabajos'
  };

  document.getElementById('headerTitle').textContent = titles[viewId] || '';
}

// ==================== ADMIN DASHBOARD ====================

function updateAdminDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const trabajosHoy = trabajos.filter(t => t.fecha === today);

  // Calculate metrics
  const totalFacturado = trabajosHoy.reduce((sum, t) => sum + t.total, 0);
  const totalIVA = trabajosHoy.reduce((sum, t) => sum + t.iva_importe, 0);
  const numTrabajos = trabajosHoy.length;

  document.getElementById('totalFacturadoHoy').textContent = formatCurrency(totalFacturado);
  document.getElementById('ivaRecaudadoHoy').textContent = formatCurrency(totalIVA);
  document.getElementById('trabajosRealizados').textContent = numTrabajos;

  // Update charts
  updateClienteTypeChart(trabajosHoy);
  updateTallerChart(trabajosHoy);
}

function updateClienteTypeChart(trabajosData) {
  const ctx = document.getElementById('clienteTypeChart');
  if (!ctx) return;

  // Count by client type
  const counts = {};
  casosIVA.forEach(caso => {
    counts[caso.nombre] = trabajosData.filter(t => t.tipo_cliente_id === caso.id).length;
  });

  // Destroy existing chart if any
  if (window.clienteTypeChartInstance) {
    window.clienteTypeChartInstance.destroy();
  }

  window.clienteTypeChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function updateTallerChart(trabajosData) {
  const ctx = document.getElementById('tallerChart');
  if (!ctx) return;

  // Calculate by taller
  const tallerData = {};
  talleres.forEach(taller => {
    const trabajosTaller = trabajosData.filter(t => t.taller_id === taller.id);
    tallerData[taller.nombre] = trabajosTaller.reduce((sum, t) => sum + t.total, 0);
  });

  // Destroy existing chart if any
  if (window.tallerChartInstance) {
    window.tallerChartInstance.destroy();
  }

  window.tallerChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(tallerData),
      datasets: [{
        label: 'Facturación (€)',
        data: Object.values(tallerData),
        backgroundColor: '#003D7A'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// ==================== ADMIN TALLERES VIEW ====================

function renderTalleresView() {
  const container = document.getElementById('talleresGrid');
  container.innerHTML = '';

  talleres.forEach(taller => {
    const trabajosTaller = trabajos.filter(t => t.taller_id === taller.id);
    const totalFacturado = trabajosTaller.reduce((sum, t) => sum + t.total, 0);
    const totalIVA = trabajosTaller.reduce((sum, t) => sum + t.iva_importe, 0);

    const card = document.createElement('div');
    card.className = 'taller-card';
    card.innerHTML = `
      <div class="taller-header">
        <h3 class="taller-nombre">${taller.nombre}</h3>
        <p class="taller-codigo">${taller.codigo}</p>
      </div>
      <div class="taller-stats">
        <div class="taller-stat">
          <span class="taller-stat-label">Total Facturado</span>
          <span class="taller-stat-value">${formatCurrency(totalFacturado)}</span>
        </div>
        <div class="taller-stat">
          <span class="taller-stat-label">IVA Recaudado</span>
          <span class="taller-stat-value">${formatCurrency(totalIVA)}</span>
        </div>
        <div class="taller-stat">
          <span class="taller-stat-label">Trabajos Realizados</span>
          <span class="taller-stat-value">${trabajosTaller.length}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ==================== ADMIN REPORTES ====================

function setupReportesView() {
  // Populate taller selector
  const tallerSelect = document.getElementById('reportTaller');
  tallerSelect.innerHTML = '<option value="">Todos los talleres</option>';
  talleres.forEach(taller => {
    const option = document.createElement('option');
    option.value = taller.id;
    option.textContent = taller.nombre;
    tallerSelect.appendChild(option);
  });

  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('reportFechaInicio').value = today;
  document.getElementById('reportFechaFin').value = today;

  // Setup event listeners
  document.getElementById('generarReporteBtn').onclick = generarReporte;
  document.getElementById('exportarCSVBtn').onclick = exportarCSV;
}

function generarReporte() {
  const fechaInicio = document.getElementById('reportFechaInicio').value;
  const fechaFin = document.getElementById('reportFechaFin').value;
  const tallerId = document.getElementById('reportTaller').value;

  let filteredTrabajos = trabajos.filter(t => {
    const inDateRange = t.fecha >= fechaInicio && t.fecha <= fechaFin;
    const inTaller = !tallerId || t.taller_id === parseInt(tallerId);
    return inDateRange && inTaller;
  });

  const resultado = document.getElementById('reporteResultado');
  resultado.innerHTML = `
    <h3>Resumen del Reporte</h3>
    <div class="caja-resumen" style="margin: 20px 0;">
      <div class="resumen-card">
        <h3>Trabajos</h3>
        <p class="resumen-value">${filteredTrabajos.length}</p>
      </div>
      <div class="resumen-card">
        <h3>Base Imponible</h3>
        <p class="resumen-value">${formatCurrency(filteredTrabajos.reduce((s, t) => s + t.base_imponible, 0))}</p>
      </div>
      <div class="resumen-card">
        <h3>IVA Total</h3>
        <p class="resumen-value">${formatCurrency(filteredTrabajos.reduce((s, t) => s + t.iva_importe, 0))}</p>
      </div>
      <div class="resumen-card highlight">
        <h3>Total</h3>
        <p class="resumen-value">${formatCurrency(filteredTrabajos.reduce((s, t) => s + t.total, 0))}</p>
      </div>
    </div>
    ${renderTrabajosTable(filteredTrabajos)}
  `;
}

function exportarCSV() {
  const fechaInicio = document.getElementById('reportFechaInicio').value;
  const fechaFin = document.getElementById('reportFechaFin').value;
  const tallerId = document.getElementById('reportTaller').value;

  let filteredTrabajos = trabajos.filter(t => {
    const inDateRange = t.fecha >= fechaInicio && t.fecha <= fechaFin;
    const inTaller = !tallerId || t.taller_id === parseInt(tallerId);
    return inDateRange && inTaller;
  });

  // Create CSV content
  let csv = 'Fecha,Taller,Nº Orden,Cliente,Tipo Cliente,Base,IVA %,IVA €,Total,Método Pago\n';

  filteredTrabajos.forEach(t => {
    const taller = getTallerById(t.taller_id);
    const caso = getCasoIVAById(t.tipo_cliente_id);
    csv += `${t.fecha},${taller.nombre},${t.num_orden},${t.nombre_cliente},${caso.nombre},${t.base_imponible},${t.iva_porcentaje},${t.iva_importe},${t.total},${t.metodo_pago}\n`;
  });

  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reporte_glassdrive_${fechaInicio}_${fechaFin}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  showToast('CSV exportado correctamente', 'success');
}

// ==================== TALLER FORMS ====================

function setupTallerForms() {
  // Populate tipo cliente selector
  const tipoClienteSelect = document.getElementById('trabajoTipoCliente');
  tipoClienteSelect.innerHTML = '<option value="">Seleccione tipo de cliente...</option>';
  casosIVA.forEach(caso => {
    const option = document.createElement('option');
    option.value = caso.id;
    option.textContent = caso.nombre;
    tipoClienteSelect.appendChild(option);
  });

  // Populate metodo pago selector
  const metodoPagoSelect = document.getElementById('trabajoMetodoPago');
  metodoPagoSelect.innerHTML = '<option value="">Seleccione método de pago...</option>';
  metodosPago.forEach(metodo => {
    const option = document.createElement('option');
    option.value = metodo;
    option.textContent = metodo;
    metodoPagoSelect.appendChild(option);
  });

  // Set default fecha to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('trabajoFecha').value = today;

  // Generate order number
  updateOrderNumber();

  // Event listeners
  document.getElementById('trabajoTipoCliente').addEventListener('change', handleTipoClienteChange);
  document.getElementById('trabajoBase').addEventListener('input', calculateIVA);
  document.getElementById('nuevoTrabajoForm').addEventListener('submit', handleSubmitTrabajo);
}

function updateOrderNumber() {
  const taller = getTallerById(currentUser.taller_id);
  const counter = orderCounters[currentUser.taller_id];
  const orderNum = `${taller.codigo}-${String(counter).padStart(3, '0')}`;
  document.getElementById('trabajoNumOrden').value = orderNum;
}

function handleTipoClienteChange(e) {
  const casoId = parseInt(e.target.value);
  if (!casoId) {
    document.getElementById('casoIvaInfo').classList.add('hidden');
    return;
  }

  const caso = getCasoIVAById(casoId);
  const infoDiv = document.getElementById('casoIvaInfo');

  infoDiv.innerHTML = `
    <h4>${caso.nombre} (${caso.codigo})</h4>
    <p><strong>Descripción:</strong> ${caso.descripcion}</p>
    <p><strong>IVA:</strong> ${caso.iva_porcentaje}%</p>
    <p><strong>Quién paga IVA:</strong> ${caso.quien_paga_iva}</p>
    <p><strong>Deducible:</strong> ${caso.iva_deducible === true ? 'Sí' : caso.iva_deducible === false ? 'No' : caso.iva_deducible}</p>
    <p><strong>Instrucciones:</strong> ${caso.instrucciones}</p>
  `;
  infoDiv.style.borderColor = caso.color;
  infoDiv.classList.remove('hidden');

  // Update IVA percentage
  document.getElementById('trabajoIvaPorcentaje').value = `${caso.iva_porcentaje}%`;
  calculateIVA();
}

function calculateIVA() {
  const base = parseFloat(document.getElementById('trabajoBase').value) || 0;
  const casoId = parseInt(document.getElementById('trabajoTipoCliente').value);

  if (!casoId) return;

  const caso = getCasoIVAById(casoId);
  const ivaImporte = (base * caso.iva_porcentaje) / 100;
  const total = base + ivaImporte;

  document.getElementById('trabajoIvaImporte').value = formatCurrency(ivaImporte);
  document.getElementById('trabajoTotal').value = formatCurrency(total);
}

function handleSubmitTrabajo(e) {
  e.preventDefault();

  const base = parseFloat(document.getElementById('trabajoBase').value);
  const casoId = parseInt(document.getElementById('trabajoTipoCliente').value);
  const caso = getCasoIVAById(casoId);
  const ivaImporte = (base * caso.iva_porcentaje) / 100;
  const total = base + ivaImporte;

  const trabajo = {
    id: Date.now(),
    taller_id: currentUser.taller_id,
    fecha: document.getElementById('trabajoFecha').value,
    num_orden: document.getElementById('trabajoNumOrden').value,
    tipo_cliente_id: casoId,
    nombre_cliente: document.getElementById('trabajoNombreCliente').value,
    nif_cif: document.getElementById('trabajoNifCif').value,
    descripcion: document.getElementById('trabajoDescripcion').value,
    base_imponible: base,
    iva_porcentaje: caso.iva_porcentaje,
    iva_importe: ivaImporte,
    total: total,
    metodo_pago: document.getElementById('trabajoMetodoPago').value,
    notas: document.getElementById('trabajoNotas').value
  };

  trabajos.push(trabajo);
  orderCounters[currentUser.taller_id]++;

  showToast('Trabajo guardado correctamente', 'success');
  document.getElementById('nuevoTrabajoForm').reset();
  document.getElementById('casoIvaInfo').classList.add('hidden');
  updateOrderNumber();

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('trabajoFecha').value = today;
}

// ==================== CAJA DEL DÍA ====================

function renderCajaDia() {
  const today = new Date().toISOString().split('T')[0];
  const trabajosHoy = trabajos.filter(t => t.taller_id === currentUser.taller_id && t.fecha === today);

  document.getElementById('cajaDiaFecha').textContent = formatDate(today);

  // Calculate totals
  const baseTotal = trabajosHoy.reduce((sum, t) => sum + t.base_imponible, 0);
  const ivaTotal = trabajosHoy.reduce((sum, t) => sum + t.iva_importe, 0);
  const totalFacturado = trabajosHoy.reduce((sum, t) => sum + t.total, 0);

  document.getElementById('cajaBaseTotal').textContent = formatCurrency(baseTotal);
  document.getElementById('cajaIvaTotal').textContent = formatCurrency(ivaTotal);
  document.getElementById('cajaTotalFacturado').textContent = formatCurrency(totalFacturado);

  // Desglose por método de pago
  const desgloseMetodo = document.getElementById('desgloseMetodoPago');
  desgloseMetodo.innerHTML = '';
  metodosPago.forEach(metodo => {
    const trabajosMetodo = trabajosHoy.filter(t => t.metodo_pago === metodo);
    const totalMetodo = trabajosMetodo.reduce((sum, t) => sum + t.total, 0);
    if (totalMetodo > 0) {
      desgloseMetodo.innerHTML += `
        <div class="desglose-item">
          <span class="desglose-label">${metodo}</span>
          <span class="desglose-value">${formatCurrency(totalMetodo)}</span>
        </div>
      `;
    }
  });

  // Desglose por tipo de cliente
  const desgloseTipo = document.getElementById('desgloseTipoCliente');
  desgloseTipo.innerHTML = '';
  casosIVA.forEach(caso => {
    const trabajosTipo = trabajosHoy.filter(t => t.tipo_cliente_id === caso.id);
    const totalTipo = trabajosTipo.reduce((sum, t) => sum + t.total, 0);
    if (totalTipo > 0) {
      desgloseTipo.innerHTML += `
        <div class="desglose-item">
          <span class="desglose-label">${caso.nombre}</span>
          <span class="desglose-value">${formatCurrency(totalTipo)}</span>
        </div>
      `;
    }
  });

  // Tabla de trabajos
  const tablaContainer = document.getElementById('trabajosDiaTabla');
  tablaContainer.innerHTML = renderTrabajosTable(trabajosHoy, true);
}

function renderTrabajosTable(trabajosData, allowEdit = false) {
  if (trabajosData.length === 0) {
    return '<p style="text-align: center; padding: 20px; color: var(--color-text-secondary);">No hay trabajos para mostrar</p>';
  }

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Nº Orden</th>
          <th>Cliente</th>
          <th>Tipo</th>
          <th>Base</th>
          <th>IVA</th>
          <th>Total</th>
          <th>Pago</th>
          ${allowEdit ? '<th>Acciones</th>' : ''}
        </tr>
      </thead>
      <tbody>
  `;

  trabajosData.forEach(trabajo => {
    const caso = getCasoIVAById(trabajo.tipo_cliente_id);
    html += `
      <tr>
        <td>${formatDate(trabajo.fecha)}</td>
        <td>${trabajo.num_orden}</td>
        <td>${trabajo.nombre_cliente}</td>
        <td>${caso.nombre}</td>
        <td>${formatCurrency(trabajo.base_imponible)}</td>
        <td>${formatCurrency(trabajo.iva_importe)}</td>
        <td><strong>${formatCurrency(trabajo.total)}</strong></td>
        <td>${trabajo.metodo_pago}</td>
        ${allowEdit ? `<td><div class="table-actions"><button class="btn btn-icon btn-delete" onclick="deleteTrabajo(${trabajo.id})">🗑️</button></div></td>` : ''}
      </tr>
    `;
  });

  html += '</tbody></table>';
  return html;
}

function deleteTrabajo(id) {
  showConfirm(
    'Eliminar Trabajo',
    '¿Está seguro de que desea eliminar este trabajo?',
    () => {
      trabajos = trabajos.filter(t => t.id !== id);
      showToast('Trabajo eliminado correctamente', 'success');
      renderCajaDia();
    }
  );
}

// Make deleteTrabajo available globally
window.deleteTrabajo = deleteTrabajo;

// ==================== HISTORIAL ====================

function renderHistorial() {
  // Populate filters
  const tipoClienteFilter = document.getElementById('historialTipoCliente');
  tipoClienteFilter.innerHTML = '<option value="">Todos</option>';
  casosIVA.forEach(caso => {
    const option = document.createElement('option');
    option.value = caso.id;
    option.textContent = caso.nombre;
    tipoClienteFilter.appendChild(option);
  });

  const metodoPagoFilter = document.getElementById('historialMetodoPago');
  metodoPagoFilter.innerHTML = '<option value="">Todos</option>';
  metodosPago.forEach(metodo => {
    const option = document.createElement('option');
    option.value = metodo;
    option.textContent = metodo;
    metodoPagoFilter.appendChild(option);
  });

  // Set default dates (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  document.getElementById('historialFechaInicio').value = thirtyDaysAgo.toISOString().split('T')[0];
  document.getElementById('historialFechaFin').value = today.toISOString().split('T')[0];

  // Setup filter button
  document.getElementById('filtrarHistorialBtn').onclick = filtrarHistorial;

  // Show initial data
  filtrarHistorial();
}

function filtrarHistorial() {
  const fechaInicio = document.getElementById('historialFechaInicio').value;
  const fechaFin = document.getElementById('historialFechaFin').value;
  const tipoClienteId = document.getElementById('historialTipoCliente').value;
  const metodoPago = document.getElementById('historialMetodoPago').value;

  let filteredTrabajos = trabajos.filter(t => {
    const inTaller = t.taller_id === currentUser.taller_id;
    const inDateRange = (!fechaInicio || t.fecha >= fechaInicio) && (!fechaFin || t.fecha <= fechaFin);
    const matchesTipo = !tipoClienteId || t.tipo_cliente_id === parseInt(tipoClienteId);
    const matchesMetodo = !metodoPago || t.metodo_pago === metodoPago;
    return inTaller && inDateRange && matchesTipo && matchesMetodo;
  });

  // Sort by date descending
  filteredTrabajos.sort((a, b) => b.fecha.localeCompare(a.fecha));

  const container = document.getElementById('historialTabla');
  container.innerHTML = renderTrabajosTable(filteredTrabajos);
}

// ==================== INITIALIZATION ====================

initializeSampleData();

// Setup event listeners
document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('logoutBtn').addEventListener('click', handleLogout);