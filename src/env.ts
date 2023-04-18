import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  WAIT_TIMES_API_TOKEN: z.string().min(7),
  REDIS_URL: z.string().url(),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 */
const processEnv: Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined> = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  WAIT_TIMES_API_TOKEN: process.env.WAIT_TIMES_API_TOKEN,
  REDIS_URL: process.env.REDIS_URL,
  // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

type MergedInput = z.input<typeof merged>;
type MergedOutput = z.infer<typeof merged>;
type MergedSafeParseReturn = z.SafeParseReturnType<MergedInput, MergedOutput>;

let env: MergedOutput = process.env as unknown as MergedOutput;

if (!!process.env.SKIP_ENV_VALIDATION === false) {
  const isServer = typeof window === "undefined";

  const parsed: z.SafeParseSuccess<any> | z.SafeParseError<any> = isServer
    ? merged.safeParse(processEnv) // on server we can validate all env vars
    : client.safeParse(processEnv); // on client we can only validate the ones that are exposed

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop): any {
      if (typeof prop !== "string") return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
        );

      return target[prop as keyof typeof target];
    },
  });
}

export { env };