import { prisma } from "@/lib/prisma";
import {Prisma} from "@/generated/prisma";
import SpeakerCreateInput = Prisma.SpeakerCreateInput;
import SpeakerUpdateInput = Prisma.SpeakerUpdateInput;

export class SpeakerRepository {

    async find_all_speakers() {
        return prisma.speaker.findMany({
            orderBy: { firstName: "asc" },
        });
    }

    async find_speaker_by_id(id: string) {
        return prisma.speaker.findUnique({
            where: { id },
        });
    }
    async find_sessions_by_speaker(id: string) {
        return prisma.session.findMany({
            where: {
                speakers: {
                    some: { speakerId: id },
                },
            },
            include: {
                room: true,
                speakers: { include: { speaker: true } },
            },
            orderBy: { startTime: "asc" },
        });
    }
    
    async create_speaker(data: { firstName: string; lastName: string; photo?: string | null; biography?: string | null; links?: string[];
    }) {
        return prisma.speaker.create({
            data: {firstName: data.firstName, lastName: data.lastName, photo: data.photo ?? null, biography: data.biography ?? null,
                links: data.links?.length
                    ? { create: data.links.map((url) => ({ url })) }
                    : undefined,
            },
            include: { links: true },
        });
    }

    async put_speaker(data: SpeakerUpdateInput, id: string) {
        return prisma.speaker.update({
            where: { id },
            data,
        });
    }

    async delete_speaker(id: string) {
        await prisma.speakerLink.deleteMany({
            where: { speakerId: id },
        });

        return prisma.speaker.delete({
            where: { id },
        });
    }
}