import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext, type createTRPCRouter } from "~/server/api/trpc";


interface RevalidateRequest {
    pages: string[];
    token: string;
}


const revalidateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Create context and caller
    const ctx = createTRPCContext({ req, res });
    const caller = appRouter.createCaller(ctx);


    try {

        const requestBody: RevalidateRequest = req.body as RevalidateRequest;

        const newFact = await caller.cache.revalidate(requestBody);

        res.status(200).json(newFact);
    }
    catch (cause) {
        if (cause instanceof TRPCError) {
            // An error from tRPC occured
            const httpCode = getHTTPStatusCodeFromError(cause);
            return res.status(httpCode).json(cause);
        }
        // Another error occured
        console.error(cause);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default revalidateHandler;