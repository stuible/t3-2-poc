import { PrismaClient } from "@prisma/client";

export default async function getLatestWaitTimes({ prisma, emergencyDepartmentSlugs }: { prisma: PrismaClient, emergencyDepartmentSlugs: string[] }) {

    const waitTimes = await Promise.all(
        emergencyDepartmentSlugs.map(async (slug) => {
            const waitTime = await prisma.waitTime.findFirst({
                where: { emergencyDepartment: slug },
                orderBy: { createdAt: 'desc' },
            })

            return waitTime ?? undefined;
        })
    )
        .then(resolvedPromises => resolvedPromises.filter(x => x));

    return waitTimes;
}
