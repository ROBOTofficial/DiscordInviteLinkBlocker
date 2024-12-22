import { SettingsBot } from "./Settings.bot";

import type { PrismaClient } from "@prisma/client";

export class Settings {
    public readonly bot: SettingsBot

    constructor(prisma: PrismaClient) {
        this.bot = new SettingsBot(prisma.settingsBot);
    }
}
