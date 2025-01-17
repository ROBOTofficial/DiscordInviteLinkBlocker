import { ActivityType, Client, Message, REST } from "discord.js";

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

    private async setActivity(client: Client<true>) {
        client.user.setActivity({
            name: `${client.guilds.cache.size}個の鯖で招待リンクを撲殺中`,
            type: ActivityType.Playing,
        });
    }

    public async loadEvents() {
        this.client.on("ready", async (client) => {
            await this.setActivity(client);
            await this.rest.put(`/applications/${process.env.ID ?? ""}/commands`, {
                body: this.interaction.commands,
            });
            setInterval(async () => {
                await this.setActivity(client);
            }, 30 * 1000);
        });
        this.client.on("interactionCreate", async (interaction) => {
            return await this.interaction.create(interaction);
        });
        this.client.on("messageCreate", async (message) => {
            return await this.message.create(message);
        });
        this.client.on("messageUpdate", async (oldMessage, newMessage) => {
            return await this.message.update(oldMessage, newMessage);
        });
    }

    public async login() {
        await this.client.login(process.env.TOKEN);
    }

    public async logout() {
        await this.client.destroy();
    }
}
