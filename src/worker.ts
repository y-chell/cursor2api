/**
 * Cloudflare Workers entry.
 *
 * Uses the Node.js compatibility layer to run Express inside Workers.
 */

import { createServer } from 'node:http';
import { httpServerHandler } from 'cloudflare:node';
import { createApp } from './app.js';

const { app } = createApp();
const server = createServer(app);

export default httpServerHandler(server);
