import { ChannelType, PermissionsBitField } from "discord.js";
import { findUrls } from "../utils/regex";

import type { Client, Message, OmitPartialGroupDMChannel } from "discord.js";
import type { Database } from "../Database/index";

export class BotMessage {
    constructor(private readonly client: Client, private readonly database: Database) {}

    private async settingCheck(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        return message.guildId && await this.database.settings.bot.data(message.guildId);
    }

    private async checkPastMessages(url: string) {
        try {
            for (const channel of this.client.channels.cache.values()) {
                if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
                    for (const message of channel.messages.cache.values()) {
                        try {
                            if (message.content.includes(url)) {
                                await message.delete();
                            }
                        } catch {}
                    }
                }
            }
            return true;
        } catch {
            return false;
        }
    }

    public async create(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        try {
            if (!(await this.settingCheck(message)) && message.author.bot && message.author.id !== process.env.ID) {
                return;
            }
            if (message.member && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const url = await findUrls(message.content, {
                    database: this.database,
                    embeds: message.embeds,
                });
                if (url) {
                    if (await this.database.inviteLink.isNotFound(url)) {
                        await this.checkPastMessages(url);
                    }
                    await this.database.inviteLink.update(url);
                    return void await message.delete();
                }
            }
        } catch {
            return;
        }
    }
}
