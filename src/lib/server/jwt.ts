import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export function generateToken(): string {
  return jwt.sign(
    {}, 
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}