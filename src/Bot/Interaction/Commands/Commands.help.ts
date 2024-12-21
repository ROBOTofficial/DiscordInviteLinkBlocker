import { EmbedBuilder } from "discord.js";

import { CommandsBase, CommandsError } from "./Commands.base";

import type { ChatInputCommandInteraction, CacheType, MessagePayload, InteractionReplyOptions } from "discord.js";

export class HelpCommand extends CommandsBase {
    public readonly commandName = "help";

    public async commands(interaction: ChatInputCommandInteraction<CacheType>): Promise<void | string | MessagePayload | InteractionReplyOptions | CommandsError | null> {
        const embed = new EmbedBuilder()
            .setTitle("ヘルプ | 招待リンク殺戮マン")
            .setColor("White")
            .setDescription("招待リンク殺戮マンに関するヘルプです。")
            .addFields(
                { name: "上手く削除されません!", value: "ロールなどの権限を再度確認してください。このボットより権限の高いユーザーのメッセージは削除できません", inline: false },
                { name: "権限設定ってどうすればいい?", value: "このボットについてるロールの順位を上下させることによって対処してください。\n削除されなくしたいロールは、このボットのロールより上へ\n削除してもいいロールは、このボットよりロールを下に", inline: false },
                { name: "改善点があります!", value: "重要なバグはDiscord: robot_officialまでご連絡ください。\nその他は自分で修正してください。このボットはOSSです。 https://github.com/ROBOTofficial/DiscordInviteLinkBlocker", inline: false },
            );
        return { embeds: [ embed ] } satisfies InteractionReplyOptions;
    }
}
