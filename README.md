# Lista de Precios - GENERADORES EN LÍNEA

Sistema inteligente de gestión de lista de precios para **GENERADORES EN LÍNEA** (www.generadores.ar)

## 🚀 Características

- ✅ **Sistema de Login**: Acceso protegido con usuario y contraseña
- ✅ **Buscador Inteligente**: Búsqueda por modelo, potencia, características
- ✅ **Navegación por Familias**: Organización clara de productos por categoría
- ✅ **Panel de Administración**: Gestión completa de productos y familias
- ✅ **Cálculos Automáticos**: Precio final con descuentos e IVA
- ✅ **Exportación DB**: Descarga en formato JSON y SQL
- ✅ **100% Editable**: Agrega, edita y elimina productos fácilmente
- ✅ **Responsive**: Funciona en desktop, tablet y mobile

## 🔐 Credenciales

### Login Principal
- **Usuario**: `kor`
- **Contraseña**: `2323`

### Panel de Administración
- **Código de acceso**: `2323`

## 📦 Instalación

### Opción 1: Usar directamente
1. Abre `index.html` en tu navegador
2. Los datos se guardan automáticamente en localStorage

### Opción 2: Servidor local
```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx http-server

# Luego abre: http://localhost:8000
```

### Opción 3: GitHub Pages
1. Sube los archivos a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama main
4. Tu sitio estará en: `https://tu-usuario.github.io/nombre-repo`

## 🌐 Configurar Subdominio

Para usar el subdominio `listadeprecios.generadores.ar`:

1. **En tu proveedor de DNS (ej: Cloudflare, GoDaddy)**:
   - Tipo: `CNAME`
   - Nombre: `listadeprecios`
   - Valor: `ivankorzy25.github.io`
   - TTL: Automático

2. **En GitHub**:
   - Ve a Settings > Pages
   - En "Custom domain" escribe: `listadeprecios.generadores.ar`
   - Marca "Enforce HTTPS"

3. **Espera 5-10 minutos** para propagación DNS

## 📂 Estructura del Proyecto

```
lista-precios-kor/
├── index.html              # Página principal
├── styles.css              # Estilos
├── app.js                  # Lógica de la aplicación
├── productos_procesados.json  # Base de datos inicial
├── assets/
│   ├── logo.png           # Logo principal
│   └── favicon.png        # Favicon (opcional)
└── README.md              # Este archivo
```

## 🛠️ Uso del Panel de Administración

### Agregar Producto
1. Login con usuario/contraseña
2. Click en "Panel Admin"
3. Ingresa código `2323`
4. Click en "+ Agregar Producto"
5. Completa los datos y especificaciones técnicas
6. Guardar

### Editar Producto
1. En el panel admin, pestaña "Productos"
2. Click en "Editar" en el producto deseado
3. Modifica los campos necesarios
4. Guardar

### Eliminar Producto
1. En el panel admin, pestaña "Productos"
2. Click en "Eliminar" en el producto deseado
3. Confirmar

### Gestionar Familias
1. Pestaña "Familias" en el panel admin
2. Ver todas las familias y cantidad de productos
3. Eliminar familias (elimina también sus productos)

### Actualizar Información de la Empresa
1. Pestaña "Metadata" en el panel admin
2. Edita: empresa, website, email, teléfono
3. Guardar cambios

## 💾 Exportar Base de Datos

1. Click en "Exportar DB"
2. Se descargan 2 archivos:
   - `productos_database.json`: Formato JSON
   - `productos_database.sql`: Formato SQL para bases de datos

## 🔄 Actualizar Productos desde JSON

1. Panel Admin > Pestaña "Productos"
2. Click en "Importar JSON"
3. Selecciona tu archivo JSON
4. Los productos se actualizarán automáticamente

## 📊 Cálculo de Precios

El sistema calcula automáticamente:

```
Precio Lista (sin IVA)
↓ Aplicar Bonificación General (ej: -25%)
= Precio con Bonificación
↓ Aplicar Descuento Pago Contado (ej: -8%)
= Costo de Compra (sin IVA)
↓ Aplicar IVA (ej: +10.5%)
= PRECIO FINAL
```

## 📱 Contacto

**GENERADORES EN LÍNEA**
- 📞 Teléfono: +54 11 3956-3099
- ✉️ Email: info@generadores.ar
- 🌐 Web: www.generadores.ar
- 📍 Servicios: Venta, alquiler y servicio técnico de grupos electrógenos

## 📝 Licencia

© 2025 GENERADORES EN LÍNEA - Todos los derechos reservados

## 🆘 Soporte

Para cualquier consulta o problema:
- Email: info@generadores.ar
- WhatsApp: +54 11 3956-3099

---

**Versión**: 1.0.0
**Última actualización**: Noviembre 2025
