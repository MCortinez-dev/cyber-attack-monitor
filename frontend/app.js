const map = L.map('map', { zoomControl: false }).setView([20, 10], 2);
L.control.zoom({ position: 'bottomright' }).addTo(map);
setTimeout(() => {
    map.invalidateSize();
}, 500);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const coords = {
  "China": [35, 103], "USA": [37, -95], "Russia": [61, 105],
  "Germany": [51, 10], "Iran": [32, 53], "UK": [55, -3]
};

const attackLayer = L.layerGroup().addTo(map);
let lastId = 0;
let totalAtaques = 0;

function drawAttack(a) {
  const sourceCoord = coords[a.source];
  const targetCoord = coords[a.target];
  if (!sourceCoord || !targetCoord) return;

  // 1. Dibujar rastro (30 seg)
  const line = L.polyline([sourceCoord, targetCoord], {
    color: "#ff0000", weight: 1, opacity: 0.4, dashArray: '4, 8'
  }).addTo(attackLayer);

  // 2. Nombres en el mapa (5 seg)
  const sourceLabel = L.marker(sourceCoord, { opacity: 0 })
    .bindTooltip(a.source, { permanent: true, direction: 'top', className: 'map-label' }).addTo(attackLayer);
  
  const targetLabel = L.marker(targetCoord, { opacity: 0 })
    .bindTooltip(a.target, { permanent: true, direction: 'bottom', className: 'map-label' }).addTo(attackLayer);

  setTimeout(() => {
    attackLayer.removeLayer(sourceLabel);
    attackLayer.removeLayer(targetLabel);
  }, 5000);

  setTimeout(() => {
    attackLayer.removeLayer(line);
  }, 30000);

  // --- ACTUALIZAR UI ---
  totalAtaques++;
  const countEl = document.getElementById('count');
  if (countEl) countEl.innerText = totalAtaques;

  const lastEl = document.getElementById('last-attack');
  if (lastEl) lastEl.innerHTML = `<span style="color:red">${a.type}</span><br>${a.source} >> ${a.target}`;

  // Log de ataques (EL PUNTO CRÍTICO)
  const log = document.getElementById('attack-log');
  if (log) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${a.source} > ${a.type}`;
    log.insertBefore(entry, log.firstChild);
    if (log.children.length > 8) log.removeChild(log.lastChild);
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
  } catch (err) { console.error("Error API:", err); }
}

fetchAttacks();
setInterval(fetchAttacks, 10000);