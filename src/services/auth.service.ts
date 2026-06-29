import { adminRepository } from "@/repository/admin.repository";
import { comparePassword, hashPassword } from "@/lib/utils/hash";
import { signToken } from "@/lib/utils/jwt";

export const authService = {

    async getAllAdmins() {
        const admins = await adminRepository.findAll();
        return admins.map(admin => ({
            id: admin.id,
            name: admin.name,
            email: admin.email
        }));
    },

    async getAdminById(id: string) {
        const admin = await adminRepository.findById(id);
        if (!admin) {
            throw new Error("Admin not found");
        }
        return {
            id: admin.id,
            name: admin.name,
            email: admin.email
        };
    },

    async deleteAdmin(id: string) {
        try{
            await adminRepository.delete(id);
        }catch (e: any) {
            throw new Error("Admin not found");
        }
    },

    async updateAdmin(id: string, data: { name?: string; email?: string; password?: string }) {
        const admin = await adminRepository.findById(id);
        if (!admin) {
            throw new Error("Admin not found");
        }
        const updatedData: { name?: string; email?: string; password?: string } = {};
        if (data.name) {
            updatedData.name = data.name;
        }
        if (data.email) {
            const existing = await adminRepository.findByEmail(data.email);
            if (existing && existing.id !== id) {
                throw new Error("Email already used");
            }
            updatedData.email = data.email;
        }
        if (data.password) {
            updatedData.password = await hashPassword(data.password);
        }
        const updatedAdmin = await adminRepository.update(id, updatedData);
        return {
            id: updatedAdmin.id,
            name: updatedAdmin.name,
            email: updatedAdmin.email
        };
    },

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