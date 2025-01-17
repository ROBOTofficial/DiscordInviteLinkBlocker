import { ChannelType, PermissionsBitField } from "discord.js";
import { findUrls } from "../utils/regex";

import type { Client, Message, OmitPartialGroupDMChannel, PartialMessage } from "discord.js";
import type { Database } from "../Database/index";

export class BotMessage {
    constructor(private readonly client: Client, private readonly database: Database) {}

    private async settingCheck(guildId: string) {
        return await this.database.settings.bot.data(guildId);
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
            if (message.guildId && !(await this.settingCheck(message.guildId)) && message.author.bot && message.author.id !== process.env.ID) {
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

    public async update(oldMessage: Message<boolean> | PartialMessage, newMessage: Message<boolean> | PartialMessage) {
        try {
            if (newMessage.guildId && !(await this.settingCheck(newMessage.guildId)) && newMessage.author && newMessage.author.bot && newMessage.author.id !== process.env.ID) {
                return;
            }
            if (newMessage.member && !newMessage.member.permissions.has(PermissionsBitField.Flags.Administrator) && newMessage.content) {
                const url = await findUrls(newMessage.content, {
                    database: this.database,
                    embeds: newMessage.embeds,
                });
                if (url) {
                    if (await this.database.inviteLink.isNotFound(url)) {
                        await this.checkPastMessages(url);
                    }
                    await this.database.inviteLink.update(url);
                    return void await newMessage.delete();
                }
            }
        } catch {
            return;
        }
    }
}
