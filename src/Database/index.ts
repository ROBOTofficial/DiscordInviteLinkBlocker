import { PrismaClient } from "@prisma/client";
import { InviteLink } from "./Database.inviteLink";
import { Settings } from "./Settings/index";
import { User } from "./Database.user";

export class Database {
    private readonly prisma = new PrismaClient();

    public readonly inviteLink = new InviteLink(this.prisma.inviteLink);
    public readonly settings = new Settings(this.prisma);
    public readonly user = new User(this.prisma.userSetting);
}
