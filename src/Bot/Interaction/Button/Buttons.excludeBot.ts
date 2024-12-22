import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { ButtonsBase, ButtonsError } from "./Buttons.base";

import type { ButtonInteraction, CacheType, MessagePayload, InteractionReplyOptions } from "discord.js";

export class ExcludeBotButton extends ButtonsBase {
    public readonly customId = "settingExcludeBot";

    public async commands(interaction: ButtonInteraction<CacheType>): Promise<void | string | MessagePayload | InteractionReplyOptions | ButtonsError | null> {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("ボットを削除対象から除外する。")
                    .setDescription("ボットを削除対象に入れるかどうかを設定できます。")
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("settingExcludeBotOn")
                        .setLabel("ON")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("settingExcludeBotOff")
                        .setLabel("OFF")
                        .setStyle(ButtonStyle.Danger),
                )
            ],
            ephemeral: true,
        } satisfies InteractionReplyOptions;
    }
}
