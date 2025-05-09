import { CommandsBase, CommandsError } from "./Commands.base";
import { MessageFlags } from "discord.js";

import type { ChatInputCommandInteraction, CacheType, MessagePayload, InteractionReplyOptions } from "discord.js";

export class ReplaceCommand extends CommandsBase {
    public commandName = "replace";
    
    public async commands(interaction: ChatInputCommandInteraction<CacheType>): Promise<void | string | MessagePayload | InteractionReplyOptions | CommandsError | null> {
        const data = await this.database.user.fetch(interaction.user.id);
        const msgReplace = data && data.msgReplace !== null
            ? !data.msgReplace
            : true;
        await this.database.user.update(interaction.user.id, { msgReplace });

        return { content: `メッセージ自動置き換えを${msgReplace ? "有効" : "無効"}にしました。`, flags: [ MessageFlags.Ephemeral ] };
    }
}
