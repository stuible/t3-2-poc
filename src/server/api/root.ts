import { createTRPCRouter } from "~/server/api/trpc";
import { waitTimesRouter } from "~/server/api/routers/waitTimes";
import { cacheRouter } from "./routers/cache";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  waitTimes: waitTimesRouter,
  cache: cacheRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
