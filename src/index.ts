import { Database } from "./Database/index";
import { Bot } from "./Bot/index";

export class Main {
    private readonly database = new Database();
    private readonly bot = new Bot(this.database);

    public async start() {
        await this.bot.loadEvents();
        await this.bot.login();
    }
}
