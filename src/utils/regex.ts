import { inviteLinkChecker } from "./url";
import { SpecialChar } from "./string";

import type { Database } from "../Database/index";

const URL_REGEXP = /^https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+$/gim;

const URL_REGEXP_NO_HTTP = /(?:https?:\/\/)?(?:discord).*gg.*([a-zA-Z0-9_-]+)/gim;

const URL_REGEXP_INVITE_NO_HTTP = /(?:https?:\/\/)?(?:discord)\.(?:[a-z]{2,6})\/?.*invite.*([a-zA-Z0-9_-]+)\b|(?:https?:\/\/)?(?:discordapp)\.(?:[a-z]{2,6})\/?.*invite.*([a-zA-Z0-9_-]+)/gim;

const regExp = new RegExp(
	URL_REGEXP.source 
    + URL_REGEXP_NO_HTTP.source
    + URL_REGEXP_INVITE_NO_HTTP.source,
	"gmi"
);

export async function findUrls(
	content: string,
	database?: Database
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
			if (database && (await database.inviteLink.includeArchives(url))) {
				return url;
			}
			if (URL_REGEXP.test(url) && (await inviteLinkChecker(url))) {
				return url;
			}
		}
	}

	return null;
}
