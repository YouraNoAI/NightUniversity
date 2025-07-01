// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initDatabase } from './db/init.js';
import router from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PORT2 = 3000

app.use(cors());
app.use(bodyParser.json());

app.use('/api', router);

initDatabase()
  .then(() => {
    console.log('✅ Tables created');
    app.listen(PORT, () => {
      console.log(`🚀 App codespace berjalan di: https://${process.env.CODESPACE_NAME}-${PORT2}.app.github.dev`);
      console.log(`🚀 App Local berjalan di localhost:${PORT2}`);
});
  })
  .catch((err) => console.error('❌ DB Init Error:', err));
