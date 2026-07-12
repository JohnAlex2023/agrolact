import { Request, Response, NextFunction } from 'express';
import { loginSchema } from './auth.schema';
import { login } from './auth.service';

export async function loginController(req: Request, res: Response, next: NextFunction) {
    try {
        const input = loginSchema.parse(req.body);
        const resultado = await login(input);
        res.status(200).json({ status: 'ok', data: resultado });
    } catch (error) {
        next(error);
    }
}
