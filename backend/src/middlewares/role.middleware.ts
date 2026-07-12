import { Request, Response, NextFunction } from 'express';
import { Rol } from '../generated/prisma/enums';

export function requireRole(...rolesPermitidos: Rol[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'No autenticado' });
            return;
        }

        if (!rolesPermitidos.includes(req.user.rol)) {
            res.status(403).json({ status: 'error', message: 'No tiene permisos para esta accion' });
            return;
        }

        next();
    };
}
