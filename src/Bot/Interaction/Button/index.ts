import { codeBlock } from "../../../utils/codeblock";
import { ExcludeBotButton } from "./Buttons.excludeBot";
import { ExcludeBotButtonOn } from "./Buttons.excludeBotOn";
import { ExcludeBotButtonOff } from "./Buttons.excludeBotOff";

import type { ButtonInteraction, CacheType, Client } from "discord.js";
import type { ButtonsBase } from "./Buttons.base";
import type { Database } from "../../../Database/index";

export class Buttons {
	public readonly buttons: ButtonsBase[]

	constructor(private readonly client: Client, private readonly database: Database) {
		this.buttons = [
            new ExcludeBotButton(this.client),
            new ExcludeBotButtonOn(this.client, database),
            new ExcludeBotButtonOff(this.client, database),
		];
	}
	async reply(interaction: ButtonInteraction<CacheType>): Promise<void> {
		for (const button of this.buttons) {
			if (button.customId === interaction.customId) {
				const result = await button.reply(interaction);
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
