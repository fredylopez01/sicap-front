# 🚗 FRONTEND SICAP (Sistema Inteligente de Acceso a Parqueaderos)

Frontend del sistema de gestión inteligente de parqueaderos.
Este módulo está desarrollado en **React** y provee la interfaz gráfica para administradores, controladores y usuarios finales, ofreciendo una experiencia moderna, rápida y sin estrés.

---

## ✨ Beneficios

### Para clientes

- ⚡ **Acceso rápido y sin filas**: automatización en entradas y salidas.
- 🅿️ **Aparcamiento sin estrés**: asignación inteligente de espacios.
- 👀 **Visibilidad en tiempo real**: disponibilidad de plazas siempre actualizada.
- 🤖 **Servicio moderno y eficiente**: experiencia digital atractiva y fluida.

### Para el negocio

- 👩‍💼 **Personal más productivo**: menos tareas repetitivas, más foco en el cliente.
- ✅ **Operación sin errores**: control automatizado y confiable.
- 🔔 **Gestión proactiva**: alertas de baja disponibilidad de espacios.
- 📈 **Escalabilidad garantizada**: listo para crecer a nuevas sedes.
- 📊 **Decisiones con datos**: reportes y dashboards en tiempo real.
- 💰 **Nuevas fuentes de ingresos**: base para suscripciones, alianzas y publicidad.

---

## 🛠️ Tecnologías

- **React 18** con Hooks y Context API
- **TypeScript** para tipado seguro
- **Vite** como bundler rápido
- **Axios/Fetch** para integración con API REST
- **UI Components** (según librería seleccionada: Material UI, TailwindCSS o similar)

---

## 📂 Estructura del proyecto

```bash
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Imágenes, íconos, estilos globales
│   ├── components/      # Componentes reutilizables (botones, formularios, tablas)
│   ├── context/         # Contextos de React (ej. SimulationContext)
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Vistas principales (Login, Dashboard, Reportes, etc.)
│   ├── services/        # Conexión con APIs (axios/fetch)
│   ├── types/           # Definiciones TypeScript
│   └── App.tsx          # Punto de entrada principal
└── package.json
```

---

## 🚀 Instalación y ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/tu-org/smart-parking-frontend.git
cd smart-parking-frontend
```

2. Instala dependencias:

```bash
npm install
```

3. Inicia el entorno de desarrollo:

```bash
npm run dev
```

4. Abre en el navegador:
   👉 [http://localhost:5173](http://localhost:5173)

---

## 📌 Funcionalidades planeadas

- 🔑 **Autenticación de usuarios** (administradores y controladores).
- 🏢 **Gestión de sedes** (CRUD de parqueaderos).
- 👥 **Gestión de usuarios** (roles y credenciales).
- 🕒 **Horarios de operación** configurables.
- 🚘 **Registro de entradas y salidas** con cálculo de tarifas.
- 📊 **Visualización de ocupación en tiempo real** (mapa/grilla de espacios).
- 🔔 **Alertas automáticas** cuando quedan menos de 5 espacios.
- 💵 **Gestión de tarifas** (CRUD).
- 📑 **Reportes detallados** por fecha, tipo de vehículo o controlador.

---

## 📅 Roadmap Frontend

- 🎨 Definición de **identidad gráfica** (colores, tipografía, logotipo).
- 🧱 Configuración inicial de proyecto React + Vite.
- 🖼️ Maquetación de vistas principales: Login, Dashboard, Formularios CRUD.
- 🔌 Integración con APIs REST del backend.

---

## 🤝 Contribución

1. Haz un **fork** del proyecto.
2. Crea una nueva rama: `git checkout -b feature/nueva-funcionalidad`.
3. Realiza tus cambios y haz commit: `git commit -m "Agrego nueva funcionalidad"`.
4. Sube tu rama: `git push origin feature/nueva-funcionalidad`.
5. Abre un **Pull Request**.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
# test
