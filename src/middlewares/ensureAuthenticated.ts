import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import authConfig from '../config/auth';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

function ensureAuthenticate(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    /**
     * validação do token JWT
     */

    const authHeader = request.headers.authorization;

    if (!authHeader) throw new AppError('JWT token is missing', 401);

    const [, token] = authHeader.split(' ');

    const { secret } = authConfig.jwt;

    try {
        const decoded = verify(token, secret);

        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        };

        return next();
    } catch (err) {
        throw new AppError('JWT is invalid', 401);
    }
}

export default ensureAuthenticate;
