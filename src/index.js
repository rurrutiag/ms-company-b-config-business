// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.js';
import { createServer } from 'http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const corsOrigin = process.env.CORS_ORIGIN || '*';

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(express.json());

// Middleware para registrar las solicitudes entrantes y habilitar CORS
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`); // Imprimir la solicitud entrante
    cors({
        origin: corsOrigin,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
        credentials: true, // Habilita el envío de cookies
    })(req, res, next); // Llama al siguiente middleware
});

app.use(express.json());

app.use('/', routes);

async function startServer() {
    try {
        const server = createServer(app);
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE'){
                console.log(`Puerto ${PORT} en uso`);
                console.error('Error al iniciar el servidor', error.message);
                process.exit(1);
            }
        });
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error en cargar certificado', error);
    }
}

startServer();