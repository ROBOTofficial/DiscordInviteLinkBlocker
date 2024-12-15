import { inviteLinkChecker } from "./url";

const URL_REGEXP = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/mi;

const URL_REGEXP_NO_HTTP = /discord\.gg\/[A-Za-z0-9]+/mi;

const URL_REGEXP_INVITE_NO_HTTP = /discord\.com\/invite(\/|\\)[A-Za-z0-9]+/mi;

export async function findUrls(content: string): Promise<string | null> {
    const regExp = /(https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#$%\(\)'\[\]]+)|(discord\.gg\/[A-Za-z0-9]+)|(discord\.com\/invite(\/|\\)[A-Za-z0-9]+)/mi;
    const lines = content.split("\n");

    for (const line of lines) {
        const urls = line.split(regExp);
        for (const url of urls) {
            if (URL_REGEXP_NO_HTTP.test(url) || URL_REGEXP_INVITE_NO_HTTP.test(url)) {
                return url;
            }
            if (URL_REGEXP.test(url) && await inviteLinkChecker(url)) {
                return url;
            }
        }
    }

    return null;
}
