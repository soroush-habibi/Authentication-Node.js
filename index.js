import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import DB from './models/mongo.js'
import getRoutes from './routes/getRoutes.js';
import postRoutes from './routes/postRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.ROOT = __dirname;

const app = express();

DB.connect(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is Running on port ${process.env.PORT}`);
    })
});

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.use(getRoutes);
app.use(postRoutes);