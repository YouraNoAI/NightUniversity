import express from 'express';
import pool from '../db/init.js';

const router = express.Router();

router.post('/submit', async (req, res) => {
  let { username, score, lokasi, ip, fingerprint } = req.body;

  // 🚫 Cek username ngaco
  if (/\s/.test(username)) {
    return res.status(400).json({ error: 'Username tidak boleh mengandung spasi. Coba lagi tanpa spasi!' });
  }

  // ✂️ Bersihin karakter aneh (kayak @)
  username = username.replace(/@/g, '');

  try {
    await pool.query(
      'INSERT INTO leaderboard (username, score) VALUES ($1, $2)',
      [username, score]
    );

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

router.post("/cek-device", async (req, res) => {
  const { fingerprint } = req.body;
  const exist = await db.query("SELECT * FROM browser WHERE fingerprint = $1", [fingerprint]);
  res.json({ bolehLogin: exist.rows.length === 0 });
});

router.post('/', async (req, res) => {
  const { username, score, lokasi, ip, fingerprint } = req.body;
  const client = await pool.connect();
  try {
    await client.query(`INSERT INTO leaderboard (username, score) VALUES ($1, $2)`, [username, score]);
    await client.query(`INSERT INTO browser (ip, lokasi, fingerprint) VALUES ($1, $2, $3)`, [ip, lokasi, fingerprint]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
});

export default router;
