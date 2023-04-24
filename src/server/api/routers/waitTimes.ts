import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { observable } from '@trpc/server/observable';

import { PrismaClient, WaitTimeReport } from "@prisma/client";
import { getLatestReport } from "~/server/prisma";


import { createClient } from 'redis';
import { env } from "~/env";


const redisClient = createClient({
    url: env.REDIS_URL,
});

redisClient.on('error', err => console.log('Redis Client Error', err));




export const waitTimesRouter = createTRPCRouter({
    latestReport: publicProcedure.query(async ({ ctx }) => {

        return await getLatestReport({ prisma: ctx.prisma });
    }),
    addReport: protectedProcedure
        .input(
            z.object({
                token: z.string().min(1),
                waitTimes: z.array(z.object({
                    emergencyDepartment: z.string().min(1),
                    waitTimeMinutes: z.number().min(0),
                }))
            })
        )
        .mutation(async ({ input, ctx }) => {

            // Connect to redis if not connected
            if (!redisClient.isReady) {
                // console.log("Redis client is not connected!");
                await redisClient.connect();
            }

            console.log(`protectedProcedure.mutation()`);

            const waitTimeReport = await ctx.prisma.waitTimeReport.create({
                data: {
                    waitTimes: {
                        create: input.waitTimes.map((waitTime) => ({
                            waitTimeMinutes: waitTime.waitTimeMinutes,
                            emergencyDepartment: waitTime.emergencyDepartment,
                        }))

                    }
                },
                include: {
                    waitTimes: true
                }
            });

            await redisClient.publish("new-waittimes-report", JSON.stringify(waitTimeReport));
            // console.log(`after emit`);

            return waitTimeReport;
        }),
    onReport: publicProcedure.subscription(async ({ ctx }) => {
        if (!redisClient.isReady) {
            console.log("Redis client is not connected!");
            await redisClient.connect();
        }


        console.log("publicProcedure.subscription")



        // `resolve()` is triggered for each client when they start subscribing `onFact`
        // return an `observable` with a callback which is triggered immediately
        return observable<WaitTimeReport>((emit) => {
            // define a listener function to handle incoming messages
            const listener = (message: string, channel: string) => {
                console.log(`Received message on channel ${channel}: ${message}`);

                if (channel === "new-waittimes-report") {
                    const fact = JSON.parse(message);
                    // emit data to client
                    emit.next(fact);
                }
            };

            // subscribe to the `new-waittimes-report` channel in Redis
            const subscriber = redisClient.duplicate();
            subscriber.subscribe("new-waittimes-report", listener);

            // if (!subscriber.isReady) {
            subscriber.connect();
            // }

            console.log('observable<CatFact>')
            const onReport = (channel: string, message: string) => {
                console.log('onReport()')
                if (channel === "new-waittimes-report") {
                    const fact = JSON.parse(message);
                    // emit data to client
                    emit.next(fact);
                }
            };
            // trigger `onReport()` when a message is published to the `new-waittimes-report` channel
            subscriber.on("message", onReport);

            // unsubscribe function when client disconnects or stops subscribing
            return () => {
                // unsubscribe from the `new-waittimes-report` channel in Redis
                subscriber.unsubscribe("new-waittimes-report");
                subscriber.off("message", onReport);

            };
        });
    }),
});
