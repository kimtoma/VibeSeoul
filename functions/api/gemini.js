const ALLOWED_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.1-flash-image-preview',
];

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { model, body: geminiBody } = body;

  if (!model || !geminiBody) return json({ error: 'Missing model or body' }, 400);
  if (!ALLOWED_MODELS.includes(model)) return json({ error: 'Invalid model' }, 400);

  const key = env.GEMINI_API_KEY;
  if (!key) return json({ error: 'Server misconfiguration' }, 500);

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    }
  );

  const data = await upstream.json();
  return json(data, upstream.status);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
