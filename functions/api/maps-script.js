export async function onRequestGet(context) {
  const { env } = context;
  const key = env.GOOGLE_MAPS_API_KEY;

  if (!key) {
    return new Response('// Server misconfiguration', {
      status: 500,
      headers: { 'Content-Type': 'application/javascript' },
    });
  }

  const script = `(function(){var s=document.createElement('script');s.src='https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap';s.async=true;s.defer=true;document.head.appendChild(s);})();`;

  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
