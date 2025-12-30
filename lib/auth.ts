import { SignJWT, jwtVerify } from "jose";

// Session payload type
export interface SessionPayload {
  userId: string;
  username: string;
  name: string;
  exp?: number;
}

// Token expiration time (7 days)
const TOKEN_EXPIRATION = "7d";

// Cookie name for the session
export const SESSION_COOKIE_NAME = "admin_session";

// Helper to get secret key (lazy initialization)
function getSecretKey(): Uint8Array {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("Please define the JWT_SECRET environment variable");
  }

  return new TextEncoder().encode(JWT_SECRET);
}

/**
 * Create a signed JWT token
 */
export async function signToken(
  payload: Omit<SessionPayload, "exp">
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(getSecretKey());
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Create session cookie options
 */
export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  };
}
