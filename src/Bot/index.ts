import { Client } from "discord.js";
import { INTENTS } from "./Bot.intents";

export class Bot {
    private readonly client = new Client({
        intents: INTENTS
    });
}
