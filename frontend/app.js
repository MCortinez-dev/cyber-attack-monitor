// Inicializar mapa centrado y oscuro
const map = L.map('map', {
    zoomControl: false 
}).setView([20, 10], 2);

L.control.zoom({ position: 'bottomright' }).addTo(map);

// TileLayer estándar, pero el CSS le aplica el filtro oscuro
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

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
let totalAtaques = 0;

function drawAttack(a) {
  const sourceCoord = coords[a.source];
  const targetCoord = coords[a.target];

  if (!sourceCoord || !targetCoord) return;

  // 1. Dibujar la línea (Dura 30 segundos para que no se vea vacío)
  const line = L.polyline([sourceCoord, targetCoord], {
    color: "#ff0000",
    weight: 1,
    opacity: 0.5,
    dashArray: '4, 8'
  }).addTo(attackLayer);

  // 2. Nombres en origen y destino (Tooltip permanente por 5 seg)
  const sourceLabel = L.marker(sourceCoord, { opacity: 0 })
    .bindTooltip(a.source, { permanent: true, direction: 'top', className: 'map-label' })
    .addTo(attackLayer);

  const targetLabel = L.marker(targetCoord, { opacity: 0 })
    .bindTooltip(a.target, { permanent: true, direction: 'bottom', className: 'map-label' })
    .addTo(attackLayer);

  // 3. Marcador de impacto
  const marker = L.circleMarker(targetCoord, {
    radius: 4,
    color: "#ff0000",
    fillColor: "#ff0000",
    fillOpacity: 0.8
  }).addTo(attackLayer);

  // 4. Limpieza: Nombres duran 5s, Líneas duran 30s
  setTimeout(() => {
    attackLayer.removeLayer(sourceLabel);
    attackLayer.removeLayer(targetLabel);
  }, 5000);

  setTimeout(() => {
    attackLayer.removeLayer(line);
    attackLayer.removeLayer(marker);
  }, 30000);

  // --- ACTUALIZACIÓN DE UI ---
  totalAtaques++;
  document.getElementById('count').innerText = totalAtaques;

  // Actualizar Ficha Superior
  document.getElementById('last-attack').innerHTML = `
    <div style="color: #ff3333; font-weight: bold;">${a.type || 'UNKNOWN'}</div>
    <div style="font-size: 0.8em;">FROM: ${a.source} -> TO: ${a.target}</div>
  `;

  // Agregar al Historial (Log)
  const log = document.getElementById('attack-log');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  const now = new Date().toLocaleTimeString();
  entry.innerHTML = `[${now}] ${a.source} > ${a.type}`;
  
  log.insertBefore(entry, log.firstChild); // El más nuevo arriba

  // Mantener solo los últimos 10 logs en pantalla
  if (log.children.length > 10) {
    log.removeChild(log.lastChild);
  }
}

async function fetchAttacks() {
  try {
    const res = await fetch("https://cyber-attack-api-production.up.railway.app/attacks");
    const attacks = await res.json();

    attacks.reverse().forEach(a => {
      if (a.id > lastId) {
        drawAttack(a);
        lastId = a.id;
      }
    });
  } catch (err) {
    console.error("API Error:", err);
  }
}

fetchAttacks();
setInterval(fetchAttacks, 10000); // Revisa la base de datos cada 60 seg