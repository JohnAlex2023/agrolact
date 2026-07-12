import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import { AppError } from './shared/errors/AppError';
import authRoutes from './modules/auth/auth.routes';

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

// ─── Rutas ────────────────────────────────────────────────────────
app.use('/auth', authRoutes);

// ─── Ruta no encontrada (404) ────────────────────────────────────────
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada',
    });
});

// ─── Manejo global de errores ────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
        res.status(422).json({
            status: 'error',
            message: 'Datos invalidos',
            errores: err.issues.map((issue) => ({ campo: issue.path.join('.'), mensaje: issue.message })),
        });
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
        return;
    }

    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
    });
});

export default app;