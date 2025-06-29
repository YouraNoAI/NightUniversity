import express from 'express';
import pool from '../db/init.js';

const router = express.Router();

// 🔐 Validasi device (1x login per device)
router.post('/cek-device', async (req, res) => {
  const { fingerprint } = req.body;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM browser WHERE fingerprint = $1 LIMIT 1',
      [fingerprint]
    );
    res.json({ bolehLogin: rows.length === 0 });
  } catch (err) {
    console.error('❌ Gagal cek device:', err);
    res.status(500).json({ error: 'Gagal validasi device' });
  }
});

// 💾 Submit skor & browser info
router.post('/submit', async (req, res) => {
  const { username, score, lokasi, ip, fingerprint } = req.body;

  try {
    // Simpan skor
    await pool.query(
      'INSERT INTO leaderboard (username, score) VALUES ($1, $2)',
      [username, score]
    );

    // Simpan browser info jika fingerprint belum ada
    const exist = await pool.query(
      'SELECT * FROM browser WHERE fingerprint = $1',
      [fingerprint]
    );

    if (exist.rows.length === 0) {
      await pool.query(
        'INSERT INTO browser (ip, lokasi, fingerprint) VALUES ($1, $2, $3)',
        [ip, lokasi, fingerprint]
      );
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('❌ Gagal simpan data:', err);
    res.status(500).json({ error: 'Gagal simpan data' });
  }
});

// 📊 Ambil Top 10 leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT username, score, created_at FROM leaderboard ORDER BY score DESC, created_at ASC LIMIT 10'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal ambil leaderboard:', err);
    res.status(500).json({ error: 'Gagal ambil leaderboard' });
  }
});

export default router;
