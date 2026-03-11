/**
 * Express app factory for both Node and Cloudflare Workers.
 */

import { createRequire } from 'module';
import express from 'express';
import { getConfig } from './config.js';
import { handleMessages, listModels, countTokens } from './handler.js';
import { handleOpenAIChatCompletions, handleOpenAIResponses } from './openai-handler.js';

const require = createRequire(import.meta.url);
const { version: VERSION } = require('../package.json') as { version: string };

export function createApp() {
    const app = express();
    const config = getConfig();

    // 解析 JSON body（增大限制以支持 base64 图片，单张图片可达 10MB+）
    app.use(express.json({ limit: '50mb' }));

    // CORS
    app.use((_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', '*');
        if (_req.method === 'OPTIONS') {
            res.sendStatus(200);
            return;
        }
        next();
    });

    // ==================== 路由 ====================

    // Anthropic Messages API
    app.post('/v1/messages', handleMessages);
    app.post('/messages', handleMessages);

    // OpenAI Chat Completions API（兼容）
    app.post('/v1/chat/completions', handleOpenAIChatCompletions);
    app.post('/chat/completions', handleOpenAIChatCompletions);

    // OpenAI Responses API（Cursor IDE Agent 模式）
    app.post('/v1/responses', handleOpenAIResponses);
    app.post('/responses', handleOpenAIResponses);

    // Token 计数
    app.post('/v1/messages/count_tokens', countTokens);
    app.post('/messages/count_tokens', countTokens);

    // OpenAI 兼容模型列表
    app.get('/v1/models', listModels);

    // 健康检查
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', version: VERSION });
    });

    // 根路径
    app.get('/', (_req, res) => {
        res.json({
            name: 'cursor2api',
            version: VERSION,
            description: 'Cursor Docs AI → Anthropic & OpenAI & Cursor IDE API Proxy',
            endpoints: {
                anthropic_messages: 'POST /v1/messages',
                openai_chat: 'POST /v1/chat/completions',
                openai_responses: 'POST /v1/responses',
                models: 'GET /v1/models',
                health: 'GET /health',
            },
            usage: {
                claude_code: 'export ANTHROPIC_BASE_URL=http://localhost:' + config.port,
                openai_compatible: 'OPENAI_BASE_URL=http://localhost:' + config.port + '/v1',
                cursor_ide: 'OPENAI_BASE_URL=http://localhost:' + config.port + '/v1 (选用 Claude 模型)',
            },
        });
    });

    return { app, config, VERSION };
}
