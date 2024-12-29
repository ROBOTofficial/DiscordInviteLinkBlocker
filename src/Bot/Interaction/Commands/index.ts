import { Client } from "discord.js";
import { codeBlock } from "../../../utils/codeblock";

import { CheckCommand } from "./Commands.check";
import { HelpCommand } from "./Commands.help";
import { SettingsCommand } from "./Commands.settings";

import type { ChatInputCommandInteraction, CacheType } from "discord.js";
import type { CommandsBase } from "./Commands.base";
import type { Database } from "../../../Database/index";

export class Commands {
    public readonly commands: CommandsBase[]

    constructor(private readonly client: Client, private readonly database: Database) {
        this.commands = [
            new CheckCommand(this.client, this.database),
            new HelpCommand(this.client, this.database),
            new SettingsCommand(this.client, this.database),
        ]
    }

    async reply(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        for (const command of this.commands) {
            if (command.commandName === interaction.commandName) {
                const result = await command.reply(interaction);
                if (result) {
                    return void await interaction.reply({ content: codeBlock(`Error: ${result.content}`), ephemeral: true });
                } else {
                    return result;
                }
            }
        }

        return void await interaction.reply({ content: "Command Not Found", ephemeral: true });
    }
}
