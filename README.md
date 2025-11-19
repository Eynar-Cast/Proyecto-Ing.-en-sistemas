# MaterialPro - Sistema de Gestión de Materiales de Construcción

## 📋 Descripción

Sistema completo de gestión de materiales de construcción refactorizado con arquitectura modular y escalable. Incluye funcionalidades de inventario, ventas, proveedores, clientes y carrito de compras.

## 🎯 Características Principales

### Para Clientes
- ✅ Registro y autenticación de usuarios
- ✅ Catálogo de productos con búsqueda y filtros
- ✅ Carrito de compras funcional
- ✅ Proceso de checkout
- ✅ Historial de compras

### Para Administradores
- ✅ Gestión completa de inventario
- ✅ Control de proveedores
- ✅ Reportes de ventas y estadísticas
- ✅ Gestión de clientes
- ✅ Control de movimientos de inventario
- ✅ Alertas de stock bajo

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/         # Componentes React reutilizables
│   ├── Auth/          # Autenticación (Login, Register)
│   ├── Common/        # Componentes comunes (Modal, Button)
│   └── Layout/        # Layout (Header, Navigation)
├── context/           # Context API para estado global
│   └── AppContext.jsx # Estado principal de la aplicación
├── services/          # Lógica de negocio y servicios
│   ├── storageService.js    # Servicio de almacenamiento
│   ├── productService.js    # Gestión de productos
│   ├── authService.js       # Autenticación
│   ├── salesService.js      # Gestión de ventas
│   ├── categoryService.js   # Gestión de categorías
│   ├── supplierService.js   # Gestión de proveedores
│   └── movementService.js   # Movimientos de inventario
├── hooks/             # Custom React hooks
│   ├── useProducts.js # Hook para productos
│   └── useCart.js     # Hook para carrito
├── views/             # Vistas principales
│   ├── CatalogView.jsx      # Vista del catálogo
│   ├── InventoryView.jsx    # Vista de inventario
│   ├── SalesView.jsx        # Vista de ventas
│   ├── SuppliersView.jsx    # Vista de proveedores
│   ├── ClientsView.jsx      # Vista de clientes
│   └── CartModal.jsx        # Modal del carrito
├── constants/         # Constantes y configuraciones
│   └── index.js
├── utils/             # Funciones utilitarias
│   └── helpers.js
├── App.js             # Componente principal
├── index.js           # Punto de entrada
└── setupStorage.js    # Configuración de storage API
```

## 🚀 Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm start
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 👤 Credenciales de Acceso

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`

### Clientes
Los clientes deben registrarse desde la interfaz de usuario.

## 📦 Dependencias Principales

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.263.1"
}
```

## 🔧 Tecnologías Utilizadas

- **React 18** - Framework de UI
- **Context API** - Manejo de estado global
- **Lucide React** - Iconos
- **Tailwind CSS** - Estilos (via CDN en index.html)
- **LocalStorage** - Persistencia de datos

## 📂 Estructura de Datos

### Producto
```javascript
{
  id: number,
  name: string,
  category: string,
  price: number,
  stock: number,
  unit: string,
  description: string,
  minStock: number,
  supplierID: string,
  createdAt: string,
  updatedAt: string
}
```

### Cliente
```javascript
{
  id: number,
  username: string,
  password: string,
  fullName: string,
  email: string,
  phone: string,
  address: string,
  createdAt: string,
  purchases: []
}
```

### Venta
```javascript
{
  id: number,
  items: [],
  total: number,
  clientId: number,
  clientName: string,
  date: string,
  status: string
}
```

## 🎨 Componentes Principales

### AppContext (Context API)
Maneja todo el estado global de la aplicación:
- Autenticación
- Productos, categorías, proveedores
- Carrito de compras
- Ventas y movimientos

### Servicios
Cada servicio encapsula la lógica de negocio:
- `productService`: CRUD de productos
- `authService`: Autenticación y gestión de usuarios
- `salesService`: Registro y estadísticas de ventas
- `movementService`: Control de inventario

### Custom Hooks
- `useProducts()`: Filtrado, búsqueda y ordenamiento
- `useCart()`: Gestión del carrito de compras

## 🔒 Sistema de Autenticación

El sistema soporta dos tipos de usuarios:

1. **Administrador**: Acceso completo a todas las funcionalidades
2. **Cliente**: Acceso al catálogo y compras

## 📊 Características del Módulo de Inventario

- Listado completo de productos
- Búsqueda y filtros por categoría
- Alertas de stock bajo
- Exportación de datos
- Edición y eliminación de productos

## 💰 Módulo de Ventas

- Registro automático de ventas
- Estadísticas en tiempo real
- Historial completo
- Cálculo de ingresos totales
- Ventas por cliente

## 🛒 Carrito de Compras

- Agregar/eliminar productos
- Ajustar cantidades
- Cálculo automático de totales
- Validación de stock
- Proceso de checkout

## 🔐 Almacenamiento de Datos

Los datos se almacenan localmente usando `localStorage` a través de una API personalizada (`window.storage`).

### Claves de almacenamiento:
- `construction-products`
- `construction-categories`
- `construction-suppliers`
- `construction-sales`
- `construction-movements`
- `construction-clients`

## 🚀 Mejoras Implementadas

### Arquitectura
✅ Separación de responsabilidades (SoC)
✅ Componentes reutilizables
✅ Estado centralizado con Context API
✅ Servicios para lógica de negocio
✅ Custom hooks para lógica compartida

### Mantenibilidad
✅ Código modular y organizado
✅ Funciones utilitarias separadas
✅ Constantes centralizadas
✅ Comentarios y documentación

### Escalabilidad
✅ Fácil agregar nuevos módulos
✅ Servicios independientes
✅ Componentes desacoplados
✅ Gestión de estado eficiente

## 📝 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Crear build de producción
npm run build

# Ejecutar tests
npm test
```

## 🐛 Solución de Problemas

### El almacenamiento no funciona
Asegúrate de que `setupStorage.js` esté importado en `index.js` antes que cualquier otro archivo.

### Los estilos no se cargan
Verifica que el CDN de Tailwind esté incluido en `public/index.html`:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### Errores de importación
Ejecuta:
```bash
npm install
```

## 🔮 Futuras Mejoras Sugeridas

- [ ] Backend con Node.js/Express
- [ ] Base de datos real (PostgreSQL/MongoDB)
- [ ] Autenticación con JWT
- [ ] Subida de imágenes de productos
- [ ] Reportes en PDF
- [ ] Dashboard con gráficos
- [ ] Notificaciones en tiempo real
- [ ] Búsqueda avanzada con Elasticsearch
- [ ] Testing unitario y de integración
- [ ] Progressive Web App (PWA)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

## 👨‍💻 Autor

Proyecto refactorizado por Claude - Anthropic

---

**Nota:** Este proyecto es una refactorización completa del código original "espagueti" en una arquitectura modular, limpia y escalable siguiendo las mejores prácticas de React y desarrollo de software.
