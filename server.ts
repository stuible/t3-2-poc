import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import http from "http";
import next from "next";
import { parse } from "url";
import ws from "ws";

import conf from "./next.config.mjs";
import { createServer } from "http";

// const port = parseInt(process.env.PORT ?? "3000", 10);
// const dev = process.env.NODE_ENV !== "production";

// const hostname = process.env.HOST ?? "localhost";

// const app = next({
//   dev,
//   port,
//   hostname,
//   conf,
// });
// const handle = app.getRequestHandler();

// void app.prepare().then(() => {
//   const server = createServer((req, res) => {
//     try {
//       const parsedUrl = parse(req.url ?? "", true);

//       void handle(req, res, parsedUrl);
//     } catch (err) {
//       console.error("Error occurred handling", req.url, err);
//       res.statusCode = 500;
//       res.end("internal server error");
//     }
//   });

//   const wss = new ws.Server({ noServer: true });
//   const handler = applyWSSHandler({ wss, router: appRouter, createContext: createTRPCContext });

//   wss.on("connection", function connection(ws) {
//     console.log("Incoming websocket connection...");
//     ws.on("close", () =>
//       console.log("Websocket connection closed", wss.clients.size),
//     );
//     ws.on("error", (err) => console.error(err));
//   });

//   server.on("upgrade", function (req, socket, head) {
//     const { pathname } = parse(req.url ?? "", true);
//     if (pathname !== "/_next/webpack-hmr") {
//       wss.handleUpgrade(req, socket, head, function done(ws) {
//         wss.emit("connection", ws, req);
//       });
//     }
//   });

//   server.on("error", (err) => {
//     console.error(err);
//     process.exit(1);
//   });

//   server.listen(port, () => {
//     console.log(`> Server listening on port ${port}`);

//     console.log(app, process.env);
//   });

//   process.on("SIGTERM", () => {
//     console.log("SIGTERM");
//     handler.broadcastReconnectNotification();
//   });
// });


const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();



app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const proto = req.headers["x-forwarded-proto"];
    if (proto && proto === "http") {
      // redirect to ssl
      res.writeHead(303, {
        location: `https://${req.headers.host}${req.headers.url ?? ""}`,
      });
      res.end();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });
  const wss = new ws.Server({ server });
  const handler = applyWSSHandler({ wss, router: appRouter, createContext: createTRPCContext });

  process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
  });
  server.listen(port);

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV
    }`
  );
});

