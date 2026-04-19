# 🛡️ Real-time Cyber Attack Monitor

Este proyecto es un panel de visualización en tiempo real de amenazas cibernéticas globales. Utiliza una arquitectura distribuida para extraer, procesar y visualizar datos de ataques reales mediante un flujo automatizado.

## 🚀 Demos
- **Mapa en Vivo:** [https://cyber-attack-map-iota.vercel.app/](https://cyber-attack-map-iota.vercel.app/)
- **Explicación de Arquitectura:** [/how-it-works.html](https://cyber-attack-map-iota.vercel.app/how-it-works.html)
- **API Backend:** https://cyber-attack-api-production.up.railway.app/attacks

## 🛠️ Stack Tecnológico
- **Frontend:** HTML5, CSS3 (Estética Cyberpunk), JavaScript Vanilla y **Leaflet.js** para mapeo geoespacial.
- **Backend:** Node.js con Express y **SQLite (better-sqlite3)** para una persistencia liviana y veloz.
- **Automatización (ETL):** **n8n** (Self-hosted) para la extracción y normalización de datos.

## 📂 Estructura del Repositorio
/
├── backend/            # Servidor Express y lógica de Base de Datos
│   ├── data/           # Persistencia SQLite
│   ├── src/            # Rutas y controladores
│   └── Dockerfile      # Configuración para despliegue en Railway
├── frontend/           # Interfaz de usuario y lógica del mapa
│   ├── css/            # Estilos neón y layout responsivo
│   ├── img/            # Iconografía y recursos visuales
│   ├── js/             # Implementación de Leaflet y Fetch API
│   ├── index.html      # El Monitor (Main View)
│   └── how-it-works.html # Diagrama interactivo de arquitectura
└── README.md

## 🧩 Flujo del Sistema
1. **Extracción**: n8n consulta cada 30 segundos la API de **Abuse.ch** obteniendo IPs de servidores C&C.
2. **Procesamiento**: Se normalizan los datos (país, malware) y se envían vía POST al backend.
3. **Almacenamiento**: El backend en **Railway** guarda los datos en SQLite y mantiene un historial de 500 registros.
4. **Visualización**: El frontend en **Vercel** consulta la API cada 10 segundos para actualizar las trayectorias.

## 🧠 Habilidades Técnicas Demostradas
- **Desarrollo Fullstack**: Integración de servicios desacoplados (Frontend-Backend-DB).
- **Manipulación de Datos**: Creación de pipelines ETL automatizados.
- **UI/UX**: Diseño de interfaces "Low-latency" con estética avanzada mediante CSS puro.
- **DevOps**: Despliegue continuo en múltiples plataformas y gestión de APIs.

## ⚖️ Licencia
Este proyecto está bajo la Licencia **MIT**. Podés usarlo, modificarlo y distribuirlo libremente citando la autoría.
