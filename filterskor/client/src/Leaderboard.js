import { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/leaderboard')
      .then((res) => setData(res.data))
      .catch((err) => console.error('❌ Gagal ambil leaderboard:', err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🏆 Leaderboard Cantik Nasional</h2>
      <table border="1" cellPadding={10} style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Username</th>
            <th>Score</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id}>
              <td>{i + 1}</td>
              <td>@{row.username}</td>
              <td>{row.score}</td>
              <td>{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
