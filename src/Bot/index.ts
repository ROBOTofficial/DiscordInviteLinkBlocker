import { Client } from "discord.js";

import { INTENTS } from "./Bot.intents";
import { BotMessage } from "./Bot.message";
import { BotInteraction } from "./Bot.interaction";

export class Bot {
    private readonly client = new Client({
        intents: INTENTS
    });
    private readonly interaction = new BotInteraction(this.client);
    private readonly message = new BotMessage(this.client);

    public async loadEvents() {
        this.client.on("messageCreate", async (message) => {
            return await this.message.create(message);
        })
    }

    public async login() {
        await this.client.login();
    }

    public async logout() {
        await this.client.destroy();
    }
}
