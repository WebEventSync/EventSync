import { adminRepository } from "@/repository/admin.repository";
import { comparePassword, hashPassword } from "@/lib/utils/hash";
import { signToken } from "@/lib/utils/jwt";

export const authService = {

    async register(
        name: string,
        email: string,
        password: string
    ) {

        // Vérifier email déjà utilisé
        const existing = await adminRepository.findByEmail(email);

        if (existing) {
            throw new Error("Email already used");
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Créer admin
        const admin = await adminRepository.create({
            name,
            email,
            password: hashedPassword
        });

        return {
            id: admin.id,
            name: admin.name,
            email: admin.email
        };
    },

    async login(
        email: string,
        password: string
    ) {

        // Chercher admin
        const admin = await adminRepository.findByEmail(email);

        if (!admin) {
            throw new Error("Invalid credentials");
        }

        // Vérifier password
        const validPassword = await comparePassword(
            password,
            admin.password
        );

        if (!validPassword) {
            throw new Error("Invalid credentials");
        }

        // Générer JWT
        const token = await signToken({
            adminId: admin.id,
            email: admin.email
        });

        return {
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        };
    }

};