import prisma from '../../config/prisma';

export function findUsuarioByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
}
