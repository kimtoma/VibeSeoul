export default function handler(req, res) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return res.status(500).send('// Server misconfiguration');
  }

  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(`
(function() {
  var s = document.createElement('script');
  s.src = 'https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap';
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
})();
`.trim());
}
