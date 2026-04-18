# Real-time Cyber Attack Monitor 🛡️🌐

Este proyecto es un panel de visualización en tiempo real de amenazas cibernéticas globales. Utiliza una arquitectura distribuida para extraer, procesar y visualizar datos de ataques reales.

## 🚀 Demo
- **Frontend (Live):** [https://cyber-attack-map-iota.vercel.app/](https://cyber-attack-map-iota.vercel.app/)
- **API Backend:** `https://cyber-attack-api-production.up.railway.app/attacks`

## 🛠️ Stack Tecnológico
- **Frontend:** HTML5, CSS3 (Cyberpunk aesthetic), JavaScript (Vanilla) y [Leaflet.js](https://leafletjs.com/) para el mapeo geoespacial. Desplegado en **Vercel**.
- **Backend:** Node.js con Express, utilizando **SQLite (better-sqlite3)** para persistencia liviana. Desplegado en **Railway**.
- **Automatización (ETL):** **n8n** corriendo en servidor local (Linux) para la extracción y transformación de datos desde feeds de ciberseguridad.

## 🧩 Arquitectura del Sistema
El flujo de datos funciona de la siguiente manera:
1. **Extracción:** n8n consulta cada 30 segundos la API de [Abuse.ch (Feodo Tracker)](https://abuse.ch/) obteniendo IPs de servidores de comando y control (C&C).
2. **Procesamiento:** n8n normaliza el país de origen y el tipo de malware, enviándolos vía POST al backend.
3. **Almacenamiento:** El backend en Railway recibe los datos, los guarda en una base de datos SQLite y realiza una auto-limpieza para mantener solo los últimos 500 registros.
4. **Visualización:** El mapa en Vercel consulta la API del backend cada 10 segundos y dibuja las trayectorias de los ataques.

## ⚠️ Notas Técnicas y Limitaciones (Issues)
Para fines de este proyecto de portfolio, es importante notar:
- **Origen de datos:** Los países de origen y los tipos de malware son **100% reales**, basados en actividad de botnets detectada recientemente.
- **Simulación de destino:** Dado que los objetivos específicos de los ataques son información privada, los países de destino se asignan de forma aleatoria dentro de un conjunto de nodos de infraestructura global para facilitar la visualización de trayectorias.
- **Persistencia:** La base de datos es efímera; se reinicia con cada despliegue del backend en Railway si no se utiliza un volumen persistente.

## 📂 Estructura del Repositorio
/
├── backend/    # Servidor Express, Dockerfile y lógica de Base de Datos.
├── frontend/   # Interfaz de usuario, estilos y lógica del mapa Leaflet.
└── README.md