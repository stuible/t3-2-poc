import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

import { env } from "~/env";
import { NextApiResponse } from "next";


function isNextApiResponse(res: any): res is NextApiResponse {
    return typeof res === 'object' && 'send' in res && 'json' in res && 'status' in res;
}

export const cacheRouter = createTRPCRouter({
    revalidate: protectedProcedure
        .input(
            z.object({
                token: z.string().min(1),
                pages: z.array(z.string())
            })
        )
        .mutation(async ({ input, ctx }) => {

            // Invalidate Caches for pages
            try {
                const res: NextApiResponse | null = isNextApiResponse(ctx.res) ? ctx.res : null;

                if (res) input.pages.forEach(async (page) => await res.revalidate(page))
            } catch (error) {
                console.log(error)
            }

            return input.pages;
        }),

});
