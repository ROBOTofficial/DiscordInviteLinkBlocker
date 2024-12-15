import { PrismaClient } from "@prisma/client";
import { InviteLink } from "./Database.inviteLink";

export class Database {
    private readonly prisma = new PrismaClient();

    public readonly inviteLink = new InviteLink(this.prisma.inviteLink);
}
