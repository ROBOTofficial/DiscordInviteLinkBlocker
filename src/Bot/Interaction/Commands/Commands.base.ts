import { Client } from "discord.js";
import { codeBlock } from "../../../utils/codeblock";

import type { CacheType, ChatInputCommandInteraction, InteractionReplyOptions, MessagePayload } from "discord.js";
import type { Database } from "../../../Database/index";

export class CommandsError {
    constructor(public readonly content: string) {}
}

export abstract class CommandsBase {
    public readonly commandName: string | null = null;

    constructor(public readonly client: Client, public readonly database: Database) {}

    async commands(interaction: ChatInputCommandInteraction<CacheType>): Promise<void | string | MessagePayload | InteractionReplyOptions | CommandsError | null> {
        return new CommandsError("Commands Not Found");
    }

    async reply(interaction: ChatInputCommandInteraction<CacheType>): Promise<void | CommandsError> {
        const result = await this.commands(interaction);
        if (result === null) {
            return void await interaction.reply({ content: codeBlock(`Error: Commands Not Found`), ephemeral: true });
        }
        if (result instanceof CommandsError) {
            return void await interaction.reply({ content: codeBlock(`Error: ${result.content}`), ephemeral: true });
        }
		if (result || typeof result === "string") {
			return void await interaction.reply(result);
		} else {
			return result;
		};
    }
}
