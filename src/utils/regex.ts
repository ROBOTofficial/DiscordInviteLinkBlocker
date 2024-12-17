import { inviteLinkChecker } from "./url";
import { SpecialChar } from "./string";

import type { Database } from "../Database/index";

const URL_REGEXP = /^https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+$/gim;

const URL_REGEXP_NO_HTTP = /discord\.gg\/[A-Za-z0-9\-]+/gim;

const URL_REGEXP_INVITE_NO_HTTP =
	/discord\.com\/invite(\/|\\)[A-Za-z0-9\-]+/gim;

const regExp = new RegExp(
	URL_REGEXP.source +
		URL_REGEXP_NO_HTTP.source +
		URL_REGEXP_INVITE_NO_HTTP.source,
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
