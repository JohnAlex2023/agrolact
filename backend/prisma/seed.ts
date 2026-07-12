import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Rol } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'admin@agrolact.com';
    const passwordHash = await bcrypt.hash('admin123', 10);

    const admin = await prisma.usuario.upsert({
        where: { email },
        update: {},
        create: {
            nombre: 'Administrador',
            email,
            passwordHash,
            rol: Rol.ADMINISTRADOR,
        },
    });

    console.log('Usuario admin listo:', admin.email);
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
