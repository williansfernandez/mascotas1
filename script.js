const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const router = express.Router();

// Configura multer para subir archivos en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Conexión a MySQL (pon tu conexión correcta)
const pool = mysql.createPool({
  host: 'mysql.railway.internal', 
  user: 'root',
  password: 'wcFzmSOpAjphHfiPjLxbVHMNXOauRLQy',
  database: 'railway',
  port: 3306
});

// POST para registrar mascota con imagen
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const { nombre, ubicacion, cuidados } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO mascotas (nombre, ubicacion, cuidados, imagen) VALUES (?, ?, ?, ?)',
      [nombre, ubicacion, cuidados, imagen]
    );

    res.json({ mensaje: 'Mascota registrada', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar mascota' });
  }
});

// GET para obtener mascotas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM mascotas');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener mascotas' });
  }
});

module.exports = router;
