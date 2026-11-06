module.exports = async (req, res) => {
  const prompt = String(req.query.prompt || '').trim();
  if (!prompt) return res.status(400).send('Missing prompt');
  if (prompt.length > 1000) return res.status(400).send('Prompt too long');

  const key = process.env.POLLINATIONS_KEY;
  if (!key) return res.status(500).send('Server key not set');

  const url =
    'https://gen.pollinations.ai/image/' +
    encodeURIComponent(prompt) +
    '?width=1024&height=1024&nologo=true';

  try {
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + key } });
    if (!r.ok) return res.status(r.status).send(await r.text());
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', r.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(buf);
  } catch (e) {
    return res.status(502).send('Upstream error');
  }
};
