
export async function inviteLinkChecker(url: string) {
    const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
    });
    return response.url.startsWith("https://discord.com/invite/");
}
