import { PrismaClient } from "@prisma/client";

export default async function getLatestReport({ prisma }: { prisma: PrismaClient }) {
    const latestWaitTimeReport = await prisma.waitTimeReport.findFirst({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            waitTimes: true
        }
    });

    return latestWaitTimeReport;
}
