import { PermissionsBitField } from "discord.js";
import { findUrls } from "../utils/regex";

import type { Client, Message, OmitPartialGroupDMChannel } from "discord.js";

export class BotMessage {
    constructor(private readonly client: Client) {}

    public async create(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        if (message.member && !message.member.permissions.has(PermissionsBitField.Flags.Administrator) && await findUrls(message.content)) {
            return void await message.delete();
        }
    }
}
