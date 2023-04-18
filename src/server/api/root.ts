import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { waitTimesRouter } from "~/server/api/routers/waitTimes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  waitTimes: waitTimesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
