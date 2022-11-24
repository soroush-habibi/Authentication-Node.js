import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/getRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.ROOT = __dirname;

const app = express();

app.use(express.static(path.join(__dirname, "/public")));

app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`Server is Running on port ${process.env.PORT}`);
})