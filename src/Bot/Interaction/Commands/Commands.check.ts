import { CommandsBase, CommandsError } from "./Commands.base";
import { findUrls } from "../../../utils/regex";

import type { ChatInputCommandInteraction, CacheType, MessagePayload, InteractionReplyOptions } from "discord.js";

export class CheckCommand extends CommandsBase {
    public readonly commandName = "check";

    public async commands(interaction: ChatInputCommandInteraction<CacheType>): Promise<void | string | MessagePayload | InteractionReplyOptions | CommandsError | null> {
        const url = interaction.options.getString("url");
        if (url) {
            if (await findUrls(url, { database: this.database })) {
                return { content: `以下は招待リンクが含まれています。\n\`${url.replaceAll("`", "\`")}\`` } satisfies InteractionReplyOptions;
            } else {
                return { content: `以下は招待リンクが含まれていません\n\`${url.replaceAll("`", "\`")}\`` } satisfies InteractionReplyOptions;
            }
        }
        return null;
    }
}
