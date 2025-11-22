// CONFIGURACIÓN
const CONFIG = {
    LOGIN: {
        username: 'kor',
        password: '2323'
    },
    ADMIN_CODE: '2323'
};

// ESTADO DE LA APLICACIÓN
let appState = {
    isLoggedIn: false,
    isAdminLoggedIn: false,
    productos: [],
    familias: [],
    metadata: {},
    filteredProducts: [],
    currentEditingProduct: null
};

// ============= INICIALIZACIÓN =============
console.log('App.js cargado correctamente');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, iniciando aplicación...');
    await loadData();
    console.log('Datos cargados:', appState.productos.length, 'productos');
    setupEventListeners();
    console.log('Event listeners configurados');
    checkLoginStatus();
});

// ============= CARGA DE DATOS =============
async function loadData() {
    // Intentar cargar desde localStorage primero
    const savedData = localStorage.getItem('productosData');

    if (savedData) {
        const data = JSON.parse(savedData);
        appState.productos = data.productos || [];
        appState.familias = data.familias || [];
        appState.metadata = data.metadata || {};
    } else {
        // Cargar desde productos_procesados.json
        try {
            const response = await fetch('productos_procesados.json');
            const data = await response.json();
            appState.productos = data.productos || [];
            appState.familias = data.familias || [];
            appState.metadata = data.metadata || {};
            saveData();
        } catch (error) {
            console.error('Error cargando datos:', error);
            // Datos de ejemplo si no se puede cargar
            appState.metadata = {
                empresa: "GENERADORES EN LÍNEA",
                website: "www.generadores.ar",
                email: "info@generadores.ar",
                telefono: "+54 11 3956-3099"
            };
        }
    }

    appState.filteredProducts = [...appState.productos];
}

function saveData() {
    const data = {
        productos: appState.productos,
        familias: appState.familias,
        metadata: appState.metadata
    };
    localStorage.setItem('productosData', JSON.stringify(data));
}

// ============= EVENT LISTENERS =============
function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Búsqueda
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    document.getElementById('clearBtn').addEventListener('click', clearSearch);
    document.getElementById('familyFilter').addEventListener('change', handleFamilyFilter);

    // Admin
    document.getElementById('adminBtn').addEventListener('click', showAdminPanel);
    document.getElementById('closeAdminBtn').addEventListener('click', hideAdminPanel);
    document.getElementById('adminLoginBtn').addEventListener('click', handleAdminLogin);

    // Export
    document.getElementById('exportBtn').addEventListener('click', exportDatabase);

    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });

    // Product form
    document.getElementById('addProductBtn').addEventListener('click', () => openProductModal());
    document.getElementById('productForm').addEventListener('submit', handleSaveProduct);
    document.querySelector('.modal-close').addEventListener('click', closeProductModal);
    document.querySelector('.modal-cancel').addEventListener('click', closeProductModal);
    document.getElementById('addSpecBtn').addEventListener('click', addSpecificationField);

    // Metadata form
    document.getElementById('metadataForm').addEventListener('submit', handleSaveMetadata);

    // Family management
    document.getElementById('addFamilyBtn').addEventListener('click', handleAddFamily);
}

// ============= AUTENTICACIÓN =============
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        appState.isLoggedIn = true;
        showMainScreen();
    } else {
        showLoginScreen();
    }
}

function handleLogin(e) {
    console.log('handleLogin llamado');
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Intentando login con:', username, '/', password);
    console.log('Esperado:', CONFIG.LOGIN.username, '/', CONFIG.LOGIN.password);

    if (username === CONFIG.LOGIN.username && password === CONFIG.LOGIN.password) {
        console.log('Login exitoso!');
        appState.isLoggedIn = true;
        sessionStorage.setItem('isLoggedIn', 'true');
        showMainScreen();
    } else {
        console.log('Login fallido');
        showError('loginError', 'Usuario o contraseña incorrectos');
    }
}

function handleLogout() {
    appState.isLoggedIn = false;
    appState.isAdminLoggedIn = false;
    sessionStorage.removeItem('isLoggedIn');
    showLoginScreen();
}

function handleAdminLogin() {
    const code = document.getElementById('adminCode').value;

    if (code === CONFIG.ADMIN_CODE) {
        appState.isAdminLoggedIn = true;
        document.getElementById('adminLoginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadAdminData();
    } else {
        showError('adminError', 'Código incorrecto');
    }
}

// ============= NAVEGACIÓN DE PANTALLAS =============
function showScreen(screenId) {
    console.log('Cambiando a pantalla:', screenId);
    const screens = document.querySelectorAll('.screen');
    console.log('Pantallas encontradas:', screens.length);

    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    console.log('Pantalla objetivo encontrada:', targetScreen ? 'SI' : 'NO');

    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log('Pantalla activada:', screenId);
    } else {
        console.error('ERROR: No se encontró la pantalla con ID:', screenId);
    }
}

function showLoginScreen() {
    console.log('Mostrando pantalla de login');
    showScreen('loginScreen');
}

function showMainScreen() {
    console.log('Mostrando pantalla principal');
    showScreen('mainScreen');
    console.log('Renderizando productos...');
    renderProducts();
    console.log('Poblando filtro de familias...');
    populateFamilyFilter();
    console.log('Pantalla principal lista');
}

function showAdminPanel() {
    showScreen('adminScreen');
    document.getElementById('adminLoginForm').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    appState.isAdminLoggedIn = false;
}

function hideAdminPanel() {
    showMainScreen();
}

// ============= RENDERIZADO DE PRODUCTOS =============
function renderProducts() {
    const container = document.getElementById('familiesContainer');
    container.innerHTML = '';

    // Agrupar productos por familia
    const productsByFamily = {};
    appState.filteredProducts.forEach(producto => {
        const familia = producto.familia || 'Sin Categoría';
        if (!productsByFamily[familia]) {
            productsByFamily[familia] = [];
        }
        productsByFamily[familia].push(producto);
    });

    // Renderizar cada familia
    Object.keys(productsByFamily).sort().forEach(familia => {
        const familyGroup = createFamilyGroup(familia, productsByFamily[familia]);
        container.appendChild(familyGroup);
    });

    updateResultCount();
}

function createFamilyGroup(familyName, products) {
    const group = document.createElement('div');
    group.className = 'family-group';

    const header = document.createElement('div');
    header.className = 'family-header';
    header.innerHTML = `
        <h2>${familyName}</h2>
        <span class="toggle-icon">▼</span>
    `;
    header.addEventListener('click', () => {
        group.classList.toggle('collapsed');
    });

    const productsContainer = document.createElement('div');
    productsContainer.className = 'family-products';

    products.forEach(producto => {
        const card = createProductCard(producto);
        productsContainer.appendChild(card);
    });

    group.appendChild(header);
    group.appendChild(productsContainer);

    return group;
}

function createProductCard(producto) {
    const card = document.createElement('div');
    card.className = 'product-card';

    let disponibilidadBadge = '';
    if (producto.disponibilidad === 'Disponible') {
        disponibilidadBadge = '<span class="badge badge-success">Disponible</span>';
    } else if (producto.disponibilidad === 'Proximamente') {
        disponibilidadBadge = '<span class="badge badge-warning">Próximamente</span>';
    } else {
        disponibilidadBadge = '<span class="badge badge-danger">' + producto.disponibilidad + '</span>';
    }

    let specsHTML = '';
    if (producto.especificaciones) {
        for (const [key, value] of Object.entries(producto.especificaciones)) {
            if (value && key !== 'descripcion') {
                specsHTML += `
                    <div class="spec-item">
                        <span class="spec-label">${formatLabel(key)}:</span>
                        <span class="spec-value">${value}</span>
                    </div>
                `;
            }
        }
    }

    if (producto.especificaciones?.descripcion) {
        specsHTML += `
            <div class="spec-item">
                <span class="spec-label">Descripción:</span>
                <span class="spec-value">${producto.especificaciones.descripcion}</span>
            </div>
        `;
    }

    let pricingHTML = '';
    if (typeof producto.precios.costo_compra_con_iva === 'number') {
        pricingHTML = `
            <div class="product-pricing">
                <div class="price-row">
                    <span class="price-label">Precio Lista (sin IVA):</span>
                    <span class="price-value">$${formatPrice(producto.precios.precio_lista)}</span>
                </div>
                <div class="price-row">
                    <span class="price-label">Con Bonificación (${producto.descuentos.bonificacion_general}%):</span>
                    <span class="price-value">$${formatPrice(producto.precios.precio_con_bonificacion)}</span>
                </div>
                <div class="price-row">
                    <span class="price-label">Costo Compra (con desc. contado ${producto.descuentos.descuento_contado}%):</span>
                    <span class="price-value">$${formatPrice(producto.precios.costo_compra_sin_iva)}</span>
                </div>
                <div class="price-row price-final">
                    <span class="price-label">PRECIO FINAL (IVA ${producto.descuentos.iva}%):</span>
                    <span class="price-value">$${formatPrice(producto.precios.costo_compra_con_iva)}</span>
                </div>
            </div>
        `;
    } else {
        pricingHTML = `
            <div class="product-pricing">
                <div class="price-row price-final">
                    <span class="price-label">PRECIO:</span>
                    <span class="price-value">${producto.precios.costo_compra_con_iva}</span>
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="product-header">
            <div class="product-model">${producto.modelo}</div>
            <div class="product-family">${producto.familia}</div>
        </div>
        <div class="product-specs">
            ${specsHTML}
        </div>
        ${pricingHTML}
        <div class="product-info">
            <div><strong>Financiación:</strong> ${producto.financiacion}</div>
            ${disponibilidadBadge}
        </div>
    `;

    return card;
}

// ============= BÚSQUEDA Y FILTROS =============
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    if (!searchTerm) {
        appState.filteredProducts = [...appState.productos];
    } else {
        appState.filteredProducts = appState.productos.filter(producto => {
            const modelMatch = producto.modelo?.toLowerCase().includes(searchTerm);
            const familyMatch = producto.familia?.toLowerCase().includes(searchTerm);

            let specMatch = false;
            if (producto.especificaciones) {
                specMatch = Object.values(producto.especificaciones).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm)
                );
            }

            return modelMatch || familyMatch || specMatch;
        });
    }

    const selectedFamily = document.getElementById('familyFilter').value;
    if (selectedFamily) {
        appState.filteredProducts = appState.filteredProducts.filter(
            p => p.familia === selectedFamily
        );
    }

    renderProducts();
}

function handleFamilyFilter() {
    handleSearch();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('familyFilter').value = '';
    appState.filteredProducts = [...appState.productos];
    renderProducts();
}

function populateFamilyFilter() {
    const select = document.getElementById('familyFilter');
    select.innerHTML = '<option value="">Todas las familias</option>';

    const familias = [...new Set(appState.productos.map(p => p.familia))].sort();
    familias.forEach(familia => {
        const option = document.createElement('option');
        option.value = familia;
        option.textContent = familia;
        select.appendChild(option);
    });
}

function updateResultCount() {
    const count = appState.filteredProducts.length;
    const total = appState.productos.length;
    document.getElementById('resultCount').textContent =
        `Mostrando ${count} de ${total} productos`;
}

// ============= PANEL DE ADMINISTRACIÓN =============
function loadAdminData() {
    switchTab('productos');
    loadProductsList();
    loadFamiliesList();
    loadMetadataForm();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function loadProductsList() {
    const container = document.getElementById('productsList');
    container.innerHTML = '';

    appState.productos.forEach((producto, index) => {
        const item = document.createElement('div');
        item.className = 'item-card';
        item.innerHTML = `
            <div>
                <strong>${producto.modelo}</strong><br>
                <small>${producto.familia}</small>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-secondary" onclick="editProduct(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">Eliminar</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function loadFamiliesList() {
    const container = document.getElementById('familiesList');
    container.innerHTML = '';

    const familias = [...new Set(appState.productos.map(p => p.familia))].sort();
    familias.forEach(familia => {
        const item = document.createElement('div');
        item.className = 'item-card';
        const count = appState.productos.filter(p => p.familia === familia).length;
        item.innerHTML = `
            <div>
                <strong>${familia}</strong><br>
                <small>${count} productos</small>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-danger" onclick="deleteFamily('${familia}')">Eliminar</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function loadMetadataForm() {
    document.getElementById('metaEmpresa').value = appState.metadata.empresa || '';
    document.getElementById('metaWebsite').value = appState.metadata.website || '';
    document.getElementById('metaEmail').value = appState.metadata.email || '';
    document.getElementById('metaTelefono').value = appState.metadata.telefono || '';
}

// ============= CRUD PRODUCTOS =============
function openProductModal(productIndex = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    form.reset();

    // Poblar familias
    const familySelect = document.getElementById('prodFamilia');
    familySelect.innerHTML = '';
    const familias = [...new Set(appState.productos.map(p => p.familia))].sort();
    familias.forEach(familia => {
        const option = document.createElement('option');
        option.value = familia;
        option.textContent = familia;
        familySelect.appendChild(option);
    });

    // Agregar opción para nueva familia
    const newOption = document.createElement('option');
    newOption.value = '__new__';
    newOption.textContent = '+ Nueva Familia';
    familySelect.appendChild(newOption);

    if (productIndex !== null) {
        const producto = appState.productos[productIndex];
        appState.currentEditingProduct = productIndex;
        document.getElementById('modalTitle').textContent = 'Editar Producto';

        document.getElementById('prodModelo').value = producto.modelo;
        document.getElementById('prodFamilia').value = producto.familia;
        document.getElementById('prodPrecio').value = producto.precios.precio_lista;
        document.getElementById('prodIva').value = producto.descuentos.iva;
        document.getElementById('prodBonificacion').value = producto.descuentos.bonificacion_general;
        document.getElementById('prodDescContado').value = producto.descuentos.descuento_contado;
        document.getElementById('prodFinanciacion').value = producto.financiacion;
        document.getElementById('prodDisponibilidad').value = producto.disponibilidad;

        // Cargar especificaciones
        const specsContainer = document.getElementById('specsContainer');
        specsContainer.innerHTML = '';
        if (producto.especificaciones) {
            for (const [key, value] of Object.entries(producto.especificaciones)) {
                addSpecificationField(key, value);
            }
        }
    } else {
        appState.currentEditingProduct = null;
        document.getElementById('modalTitle').textContent = 'Agregar Producto';
        document.getElementById('specsContainer').innerHTML = '';
    }

    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function addSpecificationField(key = '', value = '') {
    const container = document.getElementById('specsContainer');
    const specDiv = document.createElement('div');
    specDiv.className = 'input-group';
    specDiv.innerHTML = `
        <div style="display: flex; gap: 0.5rem;">
            <input type="text" placeholder="Nombre" value="${key}" class="spec-key" style="flex: 1;">
            <input type="text" placeholder="Valor" value="${value}" class="spec-value" style="flex: 2;">
            <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    container.appendChild(specDiv);
}

function handleSaveProduct(e) {
    e.preventDefault();

    const familyValue = document.getElementById('prodFamilia').value;
    let familia = familyValue;

    if (familyValue === '__new__') {
        familia = prompt('Ingrese el nombre de la nueva familia:');
        if (!familia) return;
    }

    const precio = parseFloat(document.getElementById('prodPrecio').value);
    const iva = parseFloat(document.getElementById('prodIva').value);
    const bonificacion = parseFloat(document.getElementById('prodBonificacion').value);
    const descContado = parseFloat(document.getElementById('prodDescContado').value);

    const precios = calcularPrecios(precio, bonificacion, descContado, iva);

    const especificaciones = {};
    document.querySelectorAll('#specsContainer .input-group').forEach(group => {
        const key = group.querySelector('.spec-key').value;
        const value = group.querySelector('.spec-value').value;
        if (key && value) {
            especificaciones[key] = value;
        }
    });

    const producto = {
        id: `${familia.replace(' ', '_')}_${document.getElementById('prodModelo').value.replace(' ', '_')}`,
        modelo: document.getElementById('prodModelo').value,
        familia: familia,
        precios: precios,
        descuentos: {
            bonificacion_general: bonificacion,
            descuento_contado: descContado,
            iva: iva
        },
        financiacion: document.getElementById('prodFinanciacion').value,
        disponibilidad: document.getElementById('prodDisponibilidad').value,
        especificaciones: especificaciones
    };

    if (appState.currentEditingProduct !== null) {
        appState.productos[appState.currentEditingProduct] = producto;
    } else {
        appState.productos.push(producto);
    }

    saveData();
    closeProductModal();
    loadProductsList();
    renderProducts();
    populateFamilyFilter();
}

function editProduct(index) {
    openProductModal(index);
}

function deleteProduct(index) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        appState.productos.splice(index, 1);
        saveData();
        loadProductsList();
        renderProducts();
    }
}

function deleteFamily(familia) {
    const count = appState.productos.filter(p => p.familia === familia).length;
    if (confirm(`¿Eliminar la familia "${familia}" y sus ${count} productos?`)) {
        appState.productos = appState.productos.filter(p => p.familia !== familia);
        saveData();
        loadProductsList();
        loadFamiliesList();
        renderProducts();
        populateFamilyFilter();
    }
}

function handleAddFamily() {
    const nombre = prompt('Ingrese el nombre de la nueva familia:');
    if (nombre && nombre.trim()) {
        openProductModal();
        document.getElementById('prodFamilia').value = '__new__';
    }
}

function handleSaveMetadata(e) {
    e.preventDefault();
    appState.metadata = {
        empresa: document.getElementById('metaEmpresa').value,
        website: document.getElementById('metaWebsite').value,
        email: document.getElementById('metaEmail').value,
        telefono: document.getElementById('metaTelefono').value
    };
    saveData();
    alert('Metadata actualizada correctamente');
}

// ============= UTILIDADES =============
function calcularPrecios(precio, bonificacion, descContado, iva) {
    const precioConBonif = precio * (1 - bonificacion / 100);
    const costoSinIva = precioConBonif * (1 - descContado / 100);
    const costoConIva = costoSinIva * (1 + iva / 100);

    return {
        precio_lista: round(precio),
        precio_con_bonificacion: round(precioConBonif),
        costo_compra_sin_iva: round(costoSinIva),
        costo_compra_con_iva: round(costoConIva)
    };
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

function formatLabel(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function round(num) {
    return Math.round(num * 100) / 100;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add('active');
    setTimeout(() => {
        element.classList.remove('active');
    }, 3000);
}

// ============= EXPORTACIÓN =============
function exportDatabase() {
    const data = {
        metadata: appState.metadata,
        familias: [...new Set(appState.productos.map(p => p.familia))].sort(),
        productos: appState.productos
    };

    // Exportar como JSON
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = 'productos_database.json';
    jsonLink.click();

    // Exportar como SQL
    const sql = generateSQL(data);
    const sqlBlob = new Blob([sql], { type: 'text/plain' });
    const sqlUrl = URL.createObjectURL(sqlBlob);
    const sqlLink = document.createElement('a');
    sqlLink.href = sqlUrl;
    sqlLink.download = 'productos_database.sql';
    sqlLink.click();
}

function generateSQL(data) {
    let sql = `-- Base de datos de productos
-- Generado el ${new Date().toLocaleString()}

CREATE TABLE IF NOT EXISTS familias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS productos (
    id TEXT PRIMARY KEY,
    modelo TEXT NOT NULL,
    familia TEXT NOT NULL,
    precio_lista REAL,
    precio_con_bonificacion REAL,
    costo_compra_sin_iva REAL,
    costo_compra_con_iva REAL,
    bonificacion_general REAL,
    descuento_contado REAL,
    iva REAL,
    financiacion TEXT,
    disponibilidad TEXT,
    especificaciones TEXT,
    FOREIGN KEY (familia) REFERENCES familias(nombre)
);

-- Insertar familias
`;

    data.familias.forEach(familia => {
        sql += `INSERT INTO familias (nombre) VALUES ('${escapeSql(familia)}');\n`;
    });

    sql += '\n-- Insertar productos\n';

    data.productos.forEach(producto => {
        const specs = JSON.stringify(producto.especificaciones || {}).replace(/'/g, "''");
        sql += `INSERT INTO productos VALUES (
    '${escapeSql(producto.id)}',
    '${escapeSql(producto.modelo)}',
    '${escapeSql(producto.familia)}',
    ${producto.precios.precio_lista},
    ${producto.precios.precio_con_bonificacion},
    ${producto.precios.costo_compra_sin_iva},
    ${producto.precios.costo_compra_con_iva},
    ${producto.descuentos.bonificacion_general},
    ${producto.descuentos.descuento_contado},
    ${producto.descuentos.iva},
    '${escapeSql(producto.financiacion)}',
    '${escapeSql(producto.disponibilidad)}',
    '${specs}'
);\n`;
    });

    return sql;
}

function escapeSql(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/'/g, "''");
}

// Exponer funciones globales necesarias
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.deleteFamily = deleteFamily;
