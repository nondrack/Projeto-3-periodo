export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_EXPIRES_IN = "8h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não foi configurado no ambiente.");
}