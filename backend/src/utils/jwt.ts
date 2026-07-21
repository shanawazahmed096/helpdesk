import { SignJWT, jwtVerify } from "jose";
import { config } from "../config/env.config.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "node:crypto";

const accessSecret = new TextEncoder().encode(config.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(config.JWT_REFRESH_SECRET);

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export async function generateAccessToken(payload: JwtPayload) {
  return await new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(config.JWT_ACCESS_EXPIRES_IN)
    .sign(accessSecret);
}

export async function generateRefreshToken(payload: JwtPayload) {
  const jti = crypto.randomUUID();

  const token = await new SignJWT({})
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(payload.sub)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(config.JWT_REFRESH_EXPIRES_IN)
    .sign(refreshSecret);

  return {
    token,
    jti,
  };
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, accessSecret);

  return payload;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, refreshSecret);

  return payload;
}