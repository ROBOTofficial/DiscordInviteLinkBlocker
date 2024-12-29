import { errorHandling } from "../utils/error";

import type { Prisma } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";

export class InviteLink {
    constructor(private readonly table: Prisma.InviteLinkDelegate<DefaultArgs>) {
    }

    public async isNotFound(url: string) {
        try {
            return Boolean(await this.table.findFirst({ where: { url } }));
        } catch (error) {
            errorHandling(error);
            return false;
        }
    }

    public async update(url: string) {
        try {
            const element = await this.table.findFirst({ where: { url } });
            const time = BigInt(Date.now());
            if (element) {
                await this.table.updateMany({
                    where: { url: element.url },
                    data: { time },
                })
            } else {
                await this.table.create({
                    data: { url, time }
                })
            }
            return true;
        } catch (error) {
            errorHandling(error);
            return false;
        }
    }

    public async includeArchives(url: string) {
        try {
            return (await this.table.findMany()).map(value => value.url).includes(url);
        } catch (error) {
            errorHandling(error);
            return false;
        }
    }
}
