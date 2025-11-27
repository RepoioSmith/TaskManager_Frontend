# 💻 Task Manager Frontend

Este es el frontend para la aplicación de gestión de tareas. Está construido con **React** (usando **Vite** para mayor velocidad), **Redux Toolkit** para el manejo del estado global y **Axios** para la comunicación con la API.

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

* **Node.js** (Versión LTS recomendada)
* **npm** (Viene instalado con Node.js)
* El **Backend** corriendo (ya sea localmente en el puerto 5000 o desplegado en Render).

## 🛠️ Instalación y Configuración

Sigue estos pasos para configurar el proyecto en tu máquina local:

### 1. Clonar el repositorio
```
bash
git clone <URL_DEL_TU_REPOSITORIO_FRONTEND>
cd taskmanager-frontend
```
## 2. Instalar dependencias
```
npm intall
```

## 3. Configuración de la API (Conexión con Backend)
Para que el frontend se comunique con tu servidor, debes verificar la URL base.

Abre el archivo: src/api/axios.js.

Verifica la línea baseURL:
Para desarrollo local:
```
baseURL: '[http://127.0.0.1:5000/api](http://127.0.0.1:5000/api)',
```
Para producción (Render/Vercel):
```
baseURL: '[https://taskmanager-backend-93jf.onrender.com/api](https://taskmanager-backend-93jf.onrender.com/api)',
```

Nota: Si estás probando localmente, asegúrate de que tu backend esté ejecutándose en otra terminal.

## ▶️ Ejecución
Una vez instaladas las dependencias, inicia el servidor de desarrollo:
```
npm run dev
```

Deberías ver algo como: ➜ Local: http://localhost:5173/

Abre ese link en tu navegador para ver la aplicación.

## 📦 Características y Tecnologías
Este proyecto implementa las siguientes funcionalidades clave:

⚛️ React + Vite: Para una interfaz rápida y reactiva.

🔐 Autenticación JWT: Manejo de Login y Registro con almacenamiento seguro del token.

🧠 Redux Toolkit:

authSlice: Gestiona el estado de la sesión del usuario.

taskSlice: Gestiona el estado global de las tareas (CRUD).

🎨 Estilos CSS: Diseño limpio y responsivo (style.css).

📡 Axios Interceptors: Inyección automática del token Bearer en cada petición.

## 📂 Estructura del Proyecto
```
taskmanager-frontend/
├── src/
│   ├── api/
│   │   └── axios.js         # Configuración del cliente HTTP y Base URL
│   ├── components/
│   │   ├── SignIn.jsx       # Formulario de Login y Registro
│   │   ├── TaskManager.jsx  # Gestión de tareas (CRUD visual)
│   │   └── UserList.jsx     # Lista de usuarios (Ejercicio práctico)
│   ├── redux/
│   │   ├── store.js         # Configuración del Store global
│   │   ├── authSlice.js     # Reducer y acciones de Autenticación
│   │   └── taskSlice.js     # Reducer y acciones de Tareas
│   ├── App.jsx              # Componente principal y rutas
│   ├── main.jsx             # Punto de entrada de React
│   └── style.css            # Estilos globales de la aplicación
├── index.html               # Archivo HTML base
├── package.json             # Lista de dependencias y scripts
└── vite.config.js           # Configuración de Vite
```
