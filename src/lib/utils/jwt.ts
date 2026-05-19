import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function signToken(payload: Record<string, unknown>) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(secret)
}

export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, secret)
    return payload
}

export function requireAuth(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("Unauthorized");
    return verifyToken(token);
}
