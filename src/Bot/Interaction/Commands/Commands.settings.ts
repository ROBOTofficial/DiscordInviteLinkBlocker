import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } from "discord.js";
import { CommandsBase, CommandsError } from "./Commands.base";

import type { ChatInputCommandInteraction, CacheType, MessagePayload, InteractionReplyOptions } from "discord.js";

export class SettingsCommand extends CommandsBase {
    public readonly commandName = "settings";

    public async commands(interaction: ChatInputCommandInteraction<CacheType>): Promise<void | string | MessagePayload | InteractionReplyOptions | CommandsError | null> {
        if (interaction.member && interaction.member.permissions instanceof PermissionsBitField && interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle("設定")
                .setDescription("このボットに関する色々な設定が出来ます。");
            return {
                embeds: [ embed ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("settingExcludeBot")
                            .setLabel("除外対象設定")
                            .setStyle(ButtonStyle.Success),
                    ),
                ],
                ephemeral: true,
            } satisfies InteractionReplyOptions;
        }

        return { content: "管理者権限を持ってない人は設定できません", ephemeral: true } satisfies InteractionReplyOptions;
    }
}
