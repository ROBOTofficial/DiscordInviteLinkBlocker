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
            name: "check",
            description: "invite link checker",
            options: [
                {
                    type: 3,
                    name: "url",
                    description: "please enter url",
                    required: true,
                }
            ]
        },
        {
            name: "help",
            description: "help command",
        },
        {
            name: "settings",
            description: "設定が出来ます。",
        },
        {
            name: "replace",
            description: "メッセージの自動置き換え設定の切り替えが出来ます。",
        }
    ];
    public readonly interactionRespnse: InteractionResponse;

    constructor(private readonly client: Client, private readonly database: Database) {
        this.interactionRespnse = new InteractionResponse(this.client, this.database);
    }

    public async create(interaction: Interaction<CacheType>) {
        return void await this.interactionRespnse.reply(interaction);
    }
}
