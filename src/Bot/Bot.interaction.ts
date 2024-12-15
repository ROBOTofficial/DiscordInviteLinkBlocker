import { InteractionResponse } from "./Interaction/index";

import type { CacheType, Client, Interaction } from "discord.js";
import type { Database } from "../Database/index";

type Choice = {
	name: string
	value: string
}

type Choices = Array<Choice>

export type InteractionCommand = {
    name: string
    description: string
    options?: {
        type: number
        name: string
        description: string
        required?: boolean
        channel_types?: number[]
		choices?: Choices
        options?: {
            type: number
            name: string
            description: string
            required?: boolean
            channel_types?: number[]
			choices?: Choices
            options?: {
                type: number
                name: string
                description: string
                required?: boolean
                channel_types?: number[]
				choices?: Choices
            }[]
        }[]
    }[]
};

export type InteractionCommands = Array<InteractionCommand>;

export class BotInteraction {
    public readonly commands: InteractionCommands = [
        {
            name: "regExp",
            description: "regExp",
            options: [
                {
                    type: 3,
                    name: "check",
                    description: "check content",
                }
            ]
        },
    ];
    public readonly interactionRespnse: InteractionResponse;

    constructor(private readonly client: Client, private readonly database: Database) {
        this.interactionRespnse = new InteractionResponse(this.client);
    }

    public async create(interaction: Interaction<CacheType>) {
        return void await this.interactionRespnse.reply(interaction);
    }
}
