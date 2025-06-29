import { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/leaderboard')
      .then(res => setData(res.data))
      .catch(err => console.error("❌ Gagal ambil leaderboard:", err));
  }, []);

  return (
    <div style={{ marginTop: 40 }}>
      <h2>👑 Top 10 Cantik Nasional</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>🏆 Rank</th>
            <th>📛 Username</th>
            <th>💯 Skor</th>
            <th>🕰️ Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td><b>{index + 1}</b></td>
              <td>{item.username}</td>
              <td>{item.score}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
