import { JSDOM } from "jsdom";

export async function titleChecker(response: Response) {
    try {
        const html = await response.text();
        const jsdom = new JSDOM(html);
        const title = jsdom.window.document.querySelector("title");
        return title ? title.textContent === "Just a moment..." : false;
    } catch {
        return false;
    }
}

export async function inviteLinkChecker(url: string) {
    const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
    });
    const cf = await titleChecker(response);
    return {
        content: response.url.startsWith("https://discord.com/invite/"),
        cf,
    };
}
