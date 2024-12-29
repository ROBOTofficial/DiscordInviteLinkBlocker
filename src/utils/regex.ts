import { inviteLinkChecker } from "./url";
import { SpecialChar } from "./string";

import type { Database } from "../Database/index";
import type { Embed } from "discord.js";

export type Options = {
    database?: Database
    embeds?: Embed[]
}

const URL_REGEXP = /^https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+$/gim;

const URL_REGEXP_NO_HTTP = /(?:https?:\/\/)?(?:discord).*gg.*([a-zA-Z0-9_-]+)/gim;

const URL_REGEXP_INVITE_NO_HTTP = /(?:https?:\/\/)?(?:discord)\.(?:[a-z]{2,6})\/?.*invite.*([a-zA-Z0-9_-]+)\b|(?:https?:\/\/)?(?:discordapp)\.(?:[a-z]{2,6})\/?.*invite.*([a-zA-Z0-9_-]+)/gim;

const regExp = new RegExp(
	URL_REGEXP.source 
    + URL_REGEXP_NO_HTTP.source
    + URL_REGEXP_INVITE_NO_HTTP.source,
	"gmi"
);

async function embedChecker(embeds: Embed[]): Promise<boolean> {
    return Boolean(embeds.map(embed => embed.provider && embed.provider.name === "Discord").length);
}

export async function findUrls(
	content: string,
    options?: Options,
): Promise<string | null> {
	const lines = content.split("\n");

	for (const line of lines) {
		const urls = line.split(regExp);
		for (const url of urls.map((value) =>
			SpecialChar.specialChars2ASCII(value)
		)) {
			if (
				URL_REGEXP_NO_HTTP.test(url) ||
				URL_REGEXP_INVITE_NO_HTTP.test(url)
			) {
				return url;
			}
			if (options && options.database && (await options.database.inviteLink.includeArchives(url))) {
				return url;
			}
			if (URL_REGEXP.test(url)) {
                const result = await inviteLinkChecker(url);
                if (result.content || (result.cf && options && options.embeds && await embedChecker(options.embeds))) {
                    return url;
                }
			}
		}
	}

	return null;
}
