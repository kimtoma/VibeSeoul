export async function onRequestGet(context) {
  const { request, env } = context;
  const q = new URL(request.url).searchParams.get('q');

  if (!q) return json({ posterUrl: null }, 400);

  const token = env.TMDB_READ_TOKEN;
  if (!token) return json({ posterUrl: null });

  const res = await fetch(
    `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=1`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
  );

  if (!res.ok) return json({ posterUrl: null });

  const data = await res.json();
  const result = data.results?.find(r => r.poster_path);
  const posterUrl = result?.poster_path
    ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
    : null;

  return json({ posterUrl });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
