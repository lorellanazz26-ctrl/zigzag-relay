export default async function handler(req, res) {
  const { ZIGZAG_BASE_URL, ZIGZAG_ACCESO, ZIGZAG_USER, RELAY_SECRET } = process.env;

  if (RELAY_SECRET && req.headers['x-relay-secret'] !== RELAY_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const checks = [];

  try {
    const now = new Date();
    const url = `${ZIGZAG_BASE_URL}/despachos_detalle?acceso=${ZIGZAG_ACCESO}&user=${ZIGZAG_USER}&month=${now.getMonth() + 1}&year=${now.getFullYear()}`;
    const r = await fetch(url);
    checks.push({ name: 'API Despachos (ZigZag)', url: ZIGZAG_BASE_URL, ok: r.ok });
  } catch {
    checks.push({ name: 'API Despachos (ZigZag)', url: ZIGZAG_BASE_URL, ok: false });
  }

  res.status(200).json(checks);
}
