import { Client } from "discord.js";

import { INTENTS } from "./Bot.intents";
import { BotMessage } from "./Bot.message";
import { BotInteraction } from "./Bot.interaction";

import type { Database } from "../Database/index";

export class Bot {
    private readonly client = new Client({
        intents: INTENTS
    });
    private readonly interaction: BotInteraction;
    private readonly message: BotMessage;

    constructor(private readonly database: Database) {
        this.interaction = new BotInteraction(this.client, this.database);
        this.message = new BotMessage(this.client, this.database);
    }

    public async loadEvents() {
        this.client.on("messageCreate", async (message) => {
            return await this.message.create(message);
        })
    }

    public async login() {
        await this.client.login(process.env.TOKEN);
    }

    public async logout() {
        await this.client.destroy();
    }
}
