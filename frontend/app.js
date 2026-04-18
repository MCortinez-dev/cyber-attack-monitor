// Inicializar mapa desactivando el zoom por defecto
const map = L.map('map', {
    zoomControl: false 
}).setView([20, 0], 2);

// Agregamos el control de zoom en la esquina inferior derecha
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Coordenadas exactas para los países en n8n
const coords = {
  "China": [35, 103],
  "USA": [37, -95],
  "Russia": [61, 105],
  "Germany": [51, 10],
  "Iran": [32, 53],
  "UK": [55, -3]
};

const attackLayer = L.layerGroup().addTo(map);
let lastId = 0;
let totalAtaques = 0; // <--- Definido aquí arriba para que no falle

function drawAttack(a) {
  const sourceCoord = coords[a.source];
  const targetCoord = coords[a.target];

  if (!sourceCoord || !targetCoord) {
    console.warn(`País no reconocido. Source: ${a.source}, Target: ${a.target}`);
    return;
  }

  // 1. Dibujar la línea (el rastro del ataque)
  const line = L.polyline([sourceCoord, targetCoord], {
    color: "red",
    weight: 2,
    opacity: 0.6,
    dashArray: '5, 10'
  }).addTo(attackLayer);

  // 2. Dibujar el impacto
  const marker = L.circleMarker(targetCoord, {
    radius: 6,
    color: "orange",
    fillColor: "#ff0000",
    fillOpacity: 0.9
  }).addTo(attackLayer).bindPopup(`Ataque: ${a.type || 'Desconocido'}`);

  // 3. Limpieza automática del rastro
  setTimeout(() => {
    attackLayer.removeLayer(line);
    attackLayer.removeLayer(marker);
  }, 10000);

  // --- ACTUALIZACIÓN DEL PANEL ---
  
  // 4. Actualizar el contador global
  totalAtaques++;
  const countElement = document.getElementById('count');
  if (countElement) {
    countElement.innerText = totalAtaques;
  }

  // 5. Actualizar ficha técnica del último ataque
  const lastAttackElement = document.getElementById('last-attack');
  if (lastAttackElement) {
    lastAttackElement.innerHTML = `
        <div style="color: #00ff00; margin-top: 5px; line-height: 1.4;">
            <strong>AMENAZA:</strong> ${a.type || 'Desconocido'}<br>
            <strong>ORIGEN:</strong> ${a.source}<br>
            <strong>DESTINO:</strong> ${a.target}
        </div>
    `;
  }
}

async function fetchAttacks() {
  try {
    const res = await fetch("https://cyber-attack-api-production.up.railway.app/attacks");
    if (!res.ok) throw new Error("Error en la respuesta de la API");
    
    const attacks = await res.json();

    // Procesar de los más viejos a los más nuevos
    attacks.reverse().forEach(a => {
      if (a.id > lastId) {
        drawAttack(a);
        lastId = a.id;
      }
    });
  } catch (err) {
    console.error("Error cargando ataques:", err);
  }
}

// Ejecución inicial y cada 10 segundos
fetchAttacks();
setInterval(fetchAttacks, 10000);