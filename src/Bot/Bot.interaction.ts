import type { Client } from "discord.js";
import type { Database } from "../Database/index";

export class BotInteraction {
    constructor(private readonly client: Client, private readonly database: Database) {}
}
