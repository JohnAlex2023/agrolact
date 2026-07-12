import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../shared/types/express';

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ status: 'error', message: 'Token no proporcionado' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = payload;
        next();
    } catch {
        res.status(401).json({ status: 'error', message: 'Token invalido o expirado' });
    }
}
