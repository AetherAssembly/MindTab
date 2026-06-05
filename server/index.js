import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const PORT = parseInt(process.env.PORT || '3000', 10);
const LT_URL = (process.env.LANGUAGETOOL_URL || 'http://localhost:8081').replace(/\/$/, '');
const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin ||
        origin.startsWith('moz-extension://') ||
        origin.startsWith('chrome-extension://') ||
        /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: origin not allowed'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Health check - lets users verify the proxy is running and reachable before
// entering the URL in the extension settings.
app.get('/health', (_req, res) => {
  res.json({ ok: true, upstream: LT_URL });
});

// Forward grammar-check requests to LanguageTool.
// toneTranslator.js posts to POST /v2/check with application/x-www-form-urlencoded body.
app.post('/v2/check', async (req, res) => {
  try {
    const body = new URLSearchParams(req.body).toString();
    const upstream = await fetch(`${LT_URL}/v2/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Upstream returned ${upstream.status}` });
    }

    const data = await upstream.json();
    res.json(data);
  } catch (e) {
    console.error('[MindTab server] Upstream error:', e.message);
    res.status(502).json({ error: 'Could not reach LanguageTool', detail: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`[MindTab server] Listening on http://localhost:${PORT}`);
  console.log(`[MindTab server] Forwarding /v2/check → ${LT_URL}/v2/check`);
});
