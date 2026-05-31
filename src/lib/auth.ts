import crypto from "crypto";

/**
 * Hashes a password using SHA-256
 */
export async function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Verifies if the entered password matches the stored hash
 */
export async function verifyPassword(enteredPassword: string, storedHash: string) {
  const hashedEntered = await hashPassword(enteredPassword);
  return hashedEntered === storedHash;
}

/**
 * Standard logout logic
 */
export function logout() {
  if (typeof window !== "undefined") {
    sessionStorage.clear();
    window.location.href = "/login";
  }
}