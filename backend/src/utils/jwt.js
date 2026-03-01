import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, env.accessSecret, { expiresIn: env.accessExpiresIn });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.accessSecret);
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.refreshSecret, { expiresIn: `${env.refreshExpiresDays}d` });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.refreshSecret);
}
