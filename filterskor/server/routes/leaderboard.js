import express from 'express';
import pool from '../db/init.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`SELECT * FROM leaderboard ORDER BY score DESC LIMIT 100`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal ambil leaderboard' });
  } finally {
    client.release();
  }
});

export default router;
