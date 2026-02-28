const ALLOWED_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.1-flash-image-preview',
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { model, body } = req.body;

  if (!model || !body) {
    return res.status(400).json({ error: 'Missing model or body' });
  }

  if (!ALLOWED_MODELS.includes(model)) {
    return res.status(400).json({ error: 'Invalid model' });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  const data = await upstream.json();
  return res.status(upstream.status).json(data);
}
