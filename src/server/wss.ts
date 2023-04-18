// DEV SERVER

import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from './api/root';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';

const wss = new ws.Server({
    port: 3001,
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext: createTRPCContext });

wss.on('connection', (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', () => {
        console.log(`➖➖ Connection (${wss.clients.size})`);
    });
});
console.log(`✅ WebSocket Server listening on ws://localhost:${wss.options.port}`);

process.on('SIGTERM', () => {
    console.log('SIGTERM');
    handler.broadcastReconnectNotification();
    wss.close();
});