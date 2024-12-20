import { PermissionsBitField } from "discord.js";
import { findUrls } from "../utils/regex";

import type { Client, Message, OmitPartialGroupDMChannel } from "discord.js";
import type { Database } from "../Database/index";

export class BotMessage {
    constructor(private readonly client: Client, private readonly database: Database) {}

    public async create(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        if (message.author.bot) {
            return;
        }
        if (message.member && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const url = await findUrls(message.content, this.database);
            if (url) {
                await this.database.inviteLink.update(url);
                return void await message.delete();
            }
        }
    }
}
