export async function onRequestGet(context) {
  const { request, env } = context;
  const q = new URL(request.url).searchParams.get('q');

  if (!q) return json({ error: 'Missing query parameter' }, 400);

  const key = env.GOOGLE_API_KEY;
  if (!key) return json({ error: 'Server misconfiguration' }, 500);

  const upstream = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&videoCategoryId=10&maxResults=1&key=${key}`
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
