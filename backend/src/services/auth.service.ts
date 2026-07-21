import bcrypt from "bcrypt";
import { AuthRepository } from "../repositories/auth.repository.js";
import {
    verifyRefreshToken,
    generateAccessToken,
    generateRefreshToken,
} from "../utils/jwt.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export async function login(email: string, password: string) {

    const user = await AuthRepository.findUserByEmail(email);
    console.log("User from DB:", user);

    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const passwordMatched = await bcrypt.compare(
        password,
        user.passwordHash,
    );

    if (!passwordMatched) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role.code,
    };

    const accessToken = await generateAccessToken(payload);
    // const refreshToken = await generateRefreshToken(payload);
    const { token: refreshToken, jti } =
        await generateRefreshToken(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    const refreshExpiry = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    await AuthRepository.createRefreshToken({
        jti,
        tokenHash: hashedRefreshToken,
        userId: user.id,
        expiresAt: refreshExpiry,
    });

    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.code,
        },
        accessToken,
        refreshToken,
    };
}

export async function refresh(refreshToken: string) {
  // Verify JWT signature
  const payload = await verifyRefreshToken(refreshToken);

  const userId = payload.sub as string;

  // Find user
  const user = await AuthRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Find latest refresh token
  const storedToken = await AuthRepository.findRefreshTokenByUserId(user.id);

  if (!storedToken) {
    throw new Error("Refresh token not found.");
  }

  // Compare hashes
  const valid = await bcrypt.compare(
    refreshToken,
    storedToken.tokenHash,
  );

  if (!valid) {
    throw new Error("Invalid refresh token.");
  }

  // Generate new tokens
  const accessToken = await generateAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role.name,
  });

 const newRefreshToken = await generateRefreshToken({
  sub: user.id,
  email: user.email,
  role: user.role.name,
});

const tokenHash = await bcrypt.hash(
  newRefreshToken.token,
  10,
);

  // Remove old refresh token
  await AuthRepository.deleteUserRefreshTokens(user.id);

  // Save new refresh token
  await AuthRepository.createRefreshToken({
    jti: newRefreshToken.jti,
    tokenHash,
    userId: user.id,
    expiresAt: new Date(
      Date.now() +
      1000 * 60 * 60 * 24 * 7,
    ),
  });

  return {
    accessToken,
    refreshToken: newRefreshToken.token,
  };
}
