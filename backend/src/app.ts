import 'dotenv/config';
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
    cors: {
        origin: '*'
    }
});

io.on('connection', socket => {
    console.log(`Usuário conectado no socket ${socket.id}`);
});

app.get('/github', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.get('/signin/callback', (req, res) => {
    const { code } = req.query;
    res.json(code)
});

export { serverHttp, io }