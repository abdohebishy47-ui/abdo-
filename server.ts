import express from 'express';
import http from 'node:http';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runAgent } from './src/server/agent.ts';

process.env.DISABLE_HMR = 'true';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Direct APK download endpoint for mobile installation
  app.get(['/download/apk', '/omniagent.apk'], (_req, res) => {
    const apkPath = path.resolve(__dirname, 'public', 'omniagent.apk');
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="omniagent.apk"');
    res.sendFile(apkPath, (err) => {
      if (err && !res.headersSent) {
        res.status(404).send('APK file currently compiling or not found');
      }
    });
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // Agent execution SSE endpoint
  app.post('/api/agent/run', async (req, res) => {
    const { userPrompt, history, language, mode } = req.body;

    if (!userPrompt || typeof userPrompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (typeof (res as any).flushHeaders === 'function') {
      (res as any).flushHeaders();
    }

    const sendEvent = (event: any) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    try {
      await runAgent({
        userPrompt,
        history,
        language: language === 'en' ? 'en' : 'ar',
        mode: mode || 'autonomous',
        onEvent: (event) => {
          sendEvent(event);
        }
      });
    } catch (err: any) {
      sendEvent({
        type: 'error',
        data: { message: err?.message || 'Server-side agent execution failed' }
      });
    } finally {
      res.end();
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
