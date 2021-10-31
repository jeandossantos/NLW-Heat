import prisma from "../prisma";

export class ProfileUserService {
    async execute(user_id: string) {
        const profile = prisma.user.findFirst({
            where: {
                id: user_id
            }
        });

        return profile;
    }
}