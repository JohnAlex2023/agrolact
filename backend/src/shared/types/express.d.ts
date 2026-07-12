import { Rol } from '../../generated/prisma/enums';

export interface JwtPayload {
    id: string;
    rol: Rol;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
