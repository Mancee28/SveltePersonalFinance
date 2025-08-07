import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { randomUUID } from 'crypto';

export function generateToken(): string {
	return jwt.sign({ sessionId: randomUUID() }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sessionId: string } | null {
	return jwt.verify(token, JWT_SECRET) as { sessionId: string };
}
