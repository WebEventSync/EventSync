import { SpeakerRepository } from "@/repository/speaker.repository";
import {Prisma} from "@/generated/prisma";
import SpeakerCreateInput = Prisma.SpeakerCreateInput;
import SpeakerUpdateInput = Prisma.SpeakerUpdateInput;

export class SpeakerService {
    constructor(private speaker_repository: SpeakerRepository) {}

    async get_all_speakers() {
        return this.speaker_repository.find_all_speakers();
    }

    async get_speaker_by_id(id: string) {
        return this.speaker_repository.find_speaker_by_id(id);
    }

    async get_sessions_by_speaker(id: string) {
        return this.speaker_repository.find_sessions_by_speaker(id);
    }

    async create_speaker(data: {
        fullName: any;
        photo: any;
        bio: any;
        twitter: any;
        linkedin: any;
        github: any;
        website: any
    }) {
        return this.speaker_repository.create_speaker(data);
    }

    async put_speaker(data: {
        fullName: any;
        photo: any;
        bio: any;
        twitter: any;
        linkedin: any;
        github: any;
        website: any
    }, id: string) {
        return this.speaker_repository.put_speaker(data, id);
    }

    async delete_speaker(id: string) {
        return this.speaker_repository.delete_speaker(id);
    }
}