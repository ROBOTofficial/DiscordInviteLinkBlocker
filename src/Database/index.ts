import { PrismaClient } from "@prisma/client";
import { InviteLink } from "./Database.inviteLink";
import { Settings } from "./Settings/index";

export class Database {
    private readonly prisma = new PrismaClient();

    public readonly inviteLink = new InviteLink(this.prisma.inviteLink);
    public readonly settings = new Settings(this.prisma);
}
