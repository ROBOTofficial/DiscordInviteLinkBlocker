import type { Prisma } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";

export type Settings = {
    msgReplace?: boolean;
}

export class User {
    constructor(private readonly table: Prisma.UserSettingDelegate<DefaultArgs>) {}

    public async update(userId: string, content: Settings) {
        try {
            const element = await this.table.findFirst({ where: { userId } });
            if (element) {
                await this.table.updateMany({
                    where: { userId },
                    data: content
                })
            } else {
                await this.table.create({
                    data: { userId, ...content }
                });
            }
            return true;
        } catch {
            return false;
        }
    }

    public async fetch(userId: string) {
        try {
            return await this.table.findFirst({ where: { userId } });
        } catch {
            return null;
        }
    }
}
