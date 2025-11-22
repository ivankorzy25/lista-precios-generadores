# Configuración del Subdominio listadeprecios.generadores.ar

## 📋 Resumen

Tu lista de precios ya está publicada en:
- **Temporal**: https://ivankorzy25.github.io/lista-precios-generadores/
- **Subdominio**: listadeprecios.generadores.ar (después de configurar DNS)

## 🔧 Pasos para Configurar el Subdominio

### Paso 1: Configurar DNS

Debes agregar un registro CNAME en tu proveedor de DNS (el que gestiona generadores.ar).

#### Opciones comunes de proveedores:

**Si usas Cloudflare:**
1. Inicia sesión en Cloudflare
2. Selecciona el dominio `generadores.ar`
3. Ve a la sección **DNS**
4. Click en **Add record**
5. Configura:
   - Type: `CNAME`
   - Name: `listadeprecios`
   - Target: `ivankorzy25.github.io`
   - TTL: Auto
   - Proxy status: DNS only (nube gris, NO naranja)
6. Click en **Save**

**Si usas GoDaddy:**
1. Inicia sesión en GoDaddy
2. Ve a "Mis productos" > "Dominios"
3. Click en el dominio `generadores.ar`
4. Click en **DNS** o **Administrar DNS**
5. Click en **Agregar**
6. Configura:
   - Type: `CNAME`
   - Host: `listadeprecios`
   - Points to: `ivankorzy25.github.io`
   - TTL: 1 Hour
7. Click en **Guardar**

**Si usas otro proveedor:**
Los valores son siempre los mismos:
- Tipo: `CNAME`
- Nombre/Host: `listadeprecios`
- Valor/Target/Apunta a: `ivankorzy25.github.io`
- TTL: Automático o 3600

### Paso 2: Verificar el archivo CNAME en GitHub

El archivo `CNAME` ya está incluido en el repositorio con el contenido:
```
listadeprecios.generadores.ar
```

Si necesitas verificarlo:
1. Ve a https://github.com/ivankorzy25/lista-precios-generadores
2. Busca el archivo `CNAME`
3. Debe contener exactamente: `listadeprecios.generadores.ar`

### Paso 3: Configurar GitHub Pages (Opcional - ya está configurado)

Si necesitas cambiar algo:
1. Ve a https://github.com/ivankorzy25/lista-precios-generadores
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En "Custom domain", debería aparecer: `listadeprecios.generadores.ar`
5. Marca la casilla **Enforce HTTPS** (cuando esté disponible)

### Paso 4: Esperar Propagación DNS

⏱️ La propagación DNS puede tardar:
- **Mínimo**: 5-10 minutos
- **Típico**: 1-2 horas
- **Máximo**: 24-48 horas (raro)

Puedes verificar la propagación en:
- https://dnschecker.org
- Introduce: `listadeprecios.generadores.ar`
- Selecciona tipo: `CNAME`
- Debería mostrar: `ivankorzy25.github.io`

### Paso 5: Verificar Funcionamiento

Una vez propagado el DNS, prueba:

1. Abre tu navegador en modo incógnito
2. Ve a: https://listadeprecios.generadores.ar
3. Deberías ver la pantalla de login

Si ves "404 Not Found":
- Espera un poco más (propagación DNS)
- Verifica que el registro CNAME esté correcto
- Asegúrate de que GitHub Pages esté habilitado

## 🔐 Credenciales de Acceso

### Login Principal
- **URL**: https://listadeprecios.generadores.ar
- **Usuario**: `kor`
- **Contraseña**: `2323`

### Panel de Administración
- Después del login, click en "Panel Admin"
- **Código**: `2323`

## 🚨 Solución de Problemas

### El sitio muestra "404 Not Found"
1. Verifica que el DNS esté propagado (dnschecker.org)
2. Verifica que GitHub Pages esté habilitado
3. Verifica que el archivo CNAME exista en el repositorio
4. Espera más tiempo (hasta 24 horas)

### El DNS no se propaga
1. Verifica que el registro CNAME esté guardado
2. Si usas Cloudflare, asegúrate de que el proxy esté DESACTIVADO (nube gris)
3. Prueba limpiar cache de DNS local:
   ```
   Windows: ipconfig /flushdns
   Mac: sudo dscacheutil -flushcache
   Linux: sudo systemd-resolve --flush-caches
   ```

### GitHub Pages no acepta el dominio personalizado
1. Verifica que el dominio esté correctamente escrito
2. Espera a que el DNS se propague primero
3. Intenta quitar y volver a agregar el dominio en Settings > Pages

### Certificado SSL/HTTPS no funciona
1. El certificado puede tardar hasta 24 horas en emitirse
2. GitHub lo emite automáticamente una vez que el DNS esté propagado
3. Mientras tanto, puedes acceder por HTTP (no recomendado)

## 📞 Contacto

Si tienes problemas adicionales:
- Email: info@generadores.ar
- WhatsApp: +54 11 3956-3099

## ✅ Checklist de Configuración

- [ ] Registro CNAME agregado en el proveedor DNS
- [ ] Archivo CNAME existe en el repositorio
- [ ] GitHub Pages habilitado
- [ ] DNS propagado (verificado en dnschecker.org)
- [ ] Sitio accesible en https://listadeprecios.generadores.ar
- [ ] HTTPS habilitado (candado verde en el navegador)
- [ ] Login funcionando correctamente
- [ ] Panel de administración accesible

---

**Fecha**: Noviembre 2025
**Versión**: 1.0
