import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/utils/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email et mot de passe obligatoires" },
                { status: 400 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return NextResponse.json(
                { error: "Identifiants invalides" },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isValid) {
            return NextResponse.json(
                { error: "Identifiants invalides" },
                { status: 401 }
            );
        }

        const token = await signToken({
    id: admin.id,
    email: admin.email,
});

        const response = NextResponse.json(
            { success: true },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}