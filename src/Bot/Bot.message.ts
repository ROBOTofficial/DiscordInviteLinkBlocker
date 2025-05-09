import { ChannelType, EmbedBuilder, PermissionsBitField } from "discord.js";
import { findUrls } from "../utils/regex";
import { sumArrayContents } from "../utils/array";

import type { Attachment, Client, Message, OmitPartialGroupDMChannel, PartialMessage } from "discord.js";
import type { Database } from "../Database/index";

export type File = {
    name: string
    content: ArrayBuffer
}

export type Files = Array<File>

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

    private compressTxt(content: string, compress: number): string {
        if (content.length < compress) {
            return content
        }
        return content.substring(0, compress) + "...(省略)"
    }

    private async getAttachment(url: string) {
        try {
            const response = await fetch(url, {
                method: "GET"
            });
            return await response.arrayBuffer();
        } catch {
            return null;
        }
    }

    private async getAttachments(attachments: Attachment[]) {
        const files: Files = [];
        if (sumArrayContents(attachments.map(attachment => attachment.size)) > 25 * 1024 * 1024) {
            return {
                files,
                urls: attachments.map(attachment => attachment.url),
            };
        }
        for (const attachment of attachments) {
            const data = await this.getAttachment(attachment.url);
            if (data) {
                files.push({
                    name: attachment.name,
                    content: data,
                })
            }
        }
        return {
            files,
            urls: [],
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

            const settings = await this.database.user.fetch(message.author.id);

            if (settings && settings.msgReplace) {
                const channel = this.client.channels.cache.get(message.channelId);
                if (channel && (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice)) {
                    const attachments = await this.getAttachments(message.attachments.values().toArray());
                    const webhook = await (async () => {
                        const whs = (await channel.fetchWebhooks()).values().toArray();
                        if (whs.filter(value => this.client.user && value.owner && value.owner.id === this.client.user.id).length) {
                            return whs[0];
                        } else {
                            return await channel.createWebhook({ name: "MsgReplace" });
                        }
                    })();

                    const embeds: EmbedBuilder[] = [];

                    try {
                        const repliedMessage = await message.fetchReference();
                        if (repliedMessage) {
                            const date = repliedMessage.createdAt;
                            const embed = new EmbedBuilder()
                                .setAuthor({ name: repliedMessage.author.displayName, iconURL: repliedMessage.author.avatarURL() ?? undefined, url: repliedMessage.url })
                                .setDescription(repliedMessage.content.length ? this.compressTxt(repliedMessage.content, 50) : "画像")
                                .setFooter({ text: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()} - ${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}` });
                            embeds.push(embed);
                        }
                    } catch {}

                    await webhook.send({
                        username: message.author.displayName.replaceAll(/discord/gi, "Dis***d"),
                        avatarURL: message.author.avatarURL() ?? undefined,
                        content: attachments.urls.length
                            ? `${message.content}\n${attachments.urls.map(value => `${value}\n`)}`
                            : message.content,
                        embeds,
                        allowedMentions: { parse: [] },
                        files: attachments.files.map(({ content }) => Buffer.from(content))
                    });
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
