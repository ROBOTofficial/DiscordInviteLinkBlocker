import { errorHandling } from "../../utils/error";

import type { Prisma } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";

export class SettingsBot {
    constructor(private readonly table: Prisma.SettingsBotDelegate<DefaultArgs>) {}

    public async data(guildId: string) {
        try {
            return Boolean(await this.table.findFirst({ where: { guildId } }));
        } catch (error) {
            errorHandling(error);
            return false;
        }
    }

    public async update(guildId: string, content: boolean) {
        try {
            if (content) {
                const element = await this.table.findFirst({ where: { guildId } });
                if (!element) {
                    await this.table.create({
                        data: { guildId }
                    })
                }
            } else {
                await this.table.deleteMany({
                    where: { guildId }
                })
            }
            return true;
        } catch (error) {
            errorHandling(error);
            return false;
        }
    }
}
