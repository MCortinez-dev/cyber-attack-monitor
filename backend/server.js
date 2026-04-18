const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

// Nota: En Railway, sin volumen persistente, la DB se resetea al desplegar.
const db = new Database("attacks.db");

// Crear tabla con índice en ID para limpieza rápida
db.prepare(`
CREATE TABLE IF NOT EXISTS attacks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT,
  target TEXT,
  type TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Endpoint para recibir ataques desde n8n
app.post("/attack", (req, res) => {
  const { source, target, type } = req.body;

  if (!source || !target) {
    return res.status(400).json({ error: "Faltan datos: source o target vacíos" });
  }

  try {
    // 1. Insertar el nuevo ataque
    const stmt = db.prepare("INSERT INTO attacks (source, target, type) VALUES (?, ?, ?)");
    stmt.run(source, target, type);

    // 2. AUTO-LIMPIEZA: Mantener solo los últimos 500 registros
    // Borra todo lo que no esté entre los 500 IDs más recientes
    db.prepare(`
      DELETE FROM attacks 
      WHERE id NOT IN (
        SELECT id FROM attacks 
        ORDER BY id DESC 
        LIMIT 500
      )
    `).run();

    res.json({ status: "attack stored and db cleaned" });
  } catch (err) {
    console.error("Error en DB:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Endpoint para que el Frontend lea los ataques
app.get("/attacks", (req, res) => {
  try {
    // Solo devolvemos los últimos 100 para que el mapa cargue rápido
    const rows = db.prepare("SELECT * FROM attacks ORDER BY id DESC LIMIT 100").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al leer ataques" });
  }
});

// Limpieza manual por si acaso
app.get("/clear-attacks", (req, res) => {
  db.prepare("DELETE FROM attacks").run();
  db.prepare("VACUUM").run();
  res.send("Base de datos limpia y compactada");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor de Ciberataques corriendo en puerto ${PORT}`);
});