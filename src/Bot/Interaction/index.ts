import { Client } from "discord.js";

import { Commands } from "./Commands/index";
import { Buttons } from "./Button/index";

import type { CacheType, Interaction } from "discord.js";
import type { Database } from "../../Database/index";

export class InteractionResponse {
    public readonly commands: Commands;
    public readonly buttons: Buttons;

    constructor(private readonly client: Client, private readonly database: Database) {
        this.commands = new Commands(this.client, this.database);
        this.buttons = new Buttons(this.client, this.database);
    }

    async reply(interaction: Interaction<CacheType>): Promise<void> {
        if (interaction.isContextMenuCommand()) {
            return;
        }
        if (interaction.isButton()) {
            return await this.buttons.reply(interaction);
        }
        if (interaction.isCommand()) {
            return await this.commands.reply(interaction);
        }
    }
}
