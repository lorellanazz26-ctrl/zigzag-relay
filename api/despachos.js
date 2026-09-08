export default async function handler(req, res) {
  const { month, year } = req.query;
  const { ZIGZAG_BASE_URL, ZIGZAG_ACCESO, ZIGZAG_USER, RELAY_SECRET } = process.env;

  if (RELAY_SECRET && req.headers['x-relay-secret'] !== RELAY_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  if (!month || !year) {
    return res.status(400).json({ error: 'Faltan parámetros month y year' });
  }

  try {
    const url = `${ZIGZAG_BASE_URL}/despachos_detalle?acceso=${ZIGZAG_ACCESO}&user=${ZIGZAG_USER}&month=${month}&year=${year}`;
    const upstream = await fetch(url);

    if (!upstream.ok) {
      console.error('Error upstream ZigZag:', upstream.status, upstream.statusText);
      return res.status(502).json({ error: 'No se pudo obtener datos de despachos' });
    }

    const data = await upstream.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Error de conexión con ZigZag:', err.message);
    res.status(502).json({ error: 'Error de conexión con la API de despachos' });
  }
}
