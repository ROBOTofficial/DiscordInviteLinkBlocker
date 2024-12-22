import { ButtonsBase, ButtonsError } from "./Buttons.base";

import type { ButtonInteraction, CacheType, MessagePayload, InteractionReplyOptions, Client } from "discord.js";
import type { Database } from "../../../Database/index";

export class ExcludeBotButtonOn extends ButtonsBase {
    public readonly customId = "settingExcludeBotOn";

    constructor(client: Client, private readonly database: Database) {
        super(client);
    }

    public async commands(interaction: ButtonInteraction<CacheType>): Promise<void | string | MessagePayload | InteractionReplyOptions | ButtonsError | null> {
        if (interaction.guild) {
            const result = await this.database.settings.bot.update(interaction.guild.id, false);
            if (result) {
                return { content: "ONにしました。", ephemeral: true } satisfies InteractionReplyOptions;
            }
        }
        return { content: "ERR", ephemeral: true } satisfies InteractionReplyOptions;
    }
}
