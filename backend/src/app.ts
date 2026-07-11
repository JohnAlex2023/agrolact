import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

// ─── Crear la aplicación Express ────────────────────────────────────
const app: Application = express();

// ─── Middlewares globales ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
);

// ─── Ruta de salud ──────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        app: 'AgroLact API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// ─── Ruta no encontrada (404) ────────────────────────────────────────
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada',
    });
});

// ─── Manejo global de errores ────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
    });
});

export default app;