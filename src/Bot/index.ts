import { ActivityType, Client, REST } from "discord.js";

import { INTENTS } from "./Bot.intents";
import { BotMessage } from "./Bot.message";
import { BotInteraction } from "./Bot.interaction";

import type { Database } from "../Database/index";

export class Bot {
    private readonly client = new Client({
        intents: INTENTS
    });
    private readonly rest = new REST({ version: "10" }).setToken(process.env.TOKEN ?? "");
    private readonly interaction: BotInteraction;
    private readonly message: BotMessage;

    constructor(private readonly database: Database) {
        this.interaction = new BotInteraction(this.client, this.database);
        this.message = new BotMessage(this.client, this.database);
    }

    public async loadEvents() {
        this.client.on("ready", async (client) => {
            client.user.setActivity({
                name: `${client.guilds.cache.size}個の鯖で招待リンクを撲殺中`,
                type: ActivityType.Playing,
            })
            await this.rest.put(`/applications/${process.env.ID ?? ""}/commands`, {
                body: this.interaction.commands,
            })
        });
        this.client.on("interactionCreate", async (interaction) => {
            return await this.interaction.create(interaction);
        });
        this.client.on("messageCreate", async (message) => {
            return await this.message.create(message);
        });
    }

    public async login() {
        await this.client.login(process.env.TOKEN);
    }

    public async logout() {
        await this.client.destroy();
    }
}
