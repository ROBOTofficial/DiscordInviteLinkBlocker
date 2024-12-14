import { Database } from "./Database/index";
import { Bot } from "./Bot/index";

export class Main {
    private readonly bot = new Bot();
    private readonly database = new Database();

    public async start() {}
}
