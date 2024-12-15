import type { CacheType, Client, Interaction } from "discord.js";
import type { Database } from "../Database/index";

export class BotInteraction {
    constructor(private readonly client: Client, private readonly database: Database) {}

    public async create(interaction: Interaction<CacheType>) {}
}
