import { ButtonsBase, ButtonsError } from "./Buttons.base";

import type { ButtonInteraction, CacheType, MessagePayload, InteractionReplyOptions, Client } from "discord.js";
import type { Database } from "../../../Database/index";

export class ExcludeBotButtonOff extends ButtonsBase {
    public readonly customId = "settingExcludeBotOff";

    constructor(client: Client, private readonly database: Database) {
        super(client);
    }

    public async commands(interaction: ButtonInteraction<CacheType>): Promise<void | string | MessagePayload | InteractionReplyOptions | ButtonsError | null> {
        if (interaction.guild) {
            const result = await this.database.settings.bot.update(interaction.guild.id, true);
            if (result) {
                return { content: "OFFにしました。", ephemeral: true } satisfies InteractionReplyOptions;
            }
        }
        return { content: "ERR", ephemeral: true } satisfies InteractionReplyOptions;
    }
}
