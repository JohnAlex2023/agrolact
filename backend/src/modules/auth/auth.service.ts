import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../../shared/errors/AppError';
import { LoginInput } from './auth.schema';
import { findUsuarioByEmail } from './auth.repository';

export async function login(input: LoginInput) {
    const usuario = await findUsuarioByEmail(input.email);

    if (!usuario || !usuario.activo) {
        throw new AppError('Credenciales invalidas', 401);
    }

    const passwordValida = await bcrypt.compare(input.password, usuario.passwordHash);

    if (!passwordValida) {
        throw new AppError('Credenciales invalidas', 401);
    }

    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'] }
    );

    return {
        token,
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
        },
    };
}
