<h1 align="center">✨ Filterskor ✨</h1>
<p align="center">Seberapa cantik si aku? 💅 Aplikasi web AI selfie scoring, dengan gaya ala-ala Instagram & leaderboard realtime.</p>

---

## 🚀 Fitur

- 📸 Akses kamera langsung via browser
- 🧠 Skor wajah menggunakan randomizer (AI palsu tapi lucu)
- 📍 Deteksi lokasi & IP (biar kelihatan dari planet mana)
- 🕵️‍♀️ Browser fingerprinting
- 🏆 Realtime Leaderboard
- 🖼️ Download & Share foto yang sudah diberi skor
- 🛡️ Penyimpanan data user secara lokal (LocalStorage) + backend PostgreSQL

---

## 🧠 Tech Stack

| Frontend | Backend | DB |
|----------|---------|----|
| React.js + Tailwind | Express.js | PostgreSQL |

---

## 📷 Tampilan

<div align="center">
  <img src="https://media.giphy.com/media/l2SpQsB0ZDqESGgRO/giphy.gif" width="250" />
  <p><i>✨ Kalo cakep, jangan disimpen sendiri dong... 😗</i></p>
</div>

---

## 🛠️ Cara Jalanin

```bash
# Install depedensi frontend
cd client
npm install

# Install depedensi backend
cd ../server
npm install

# Start frontend
cd ../client
npm run dev

# Start backend
cd ../server
node index.js
