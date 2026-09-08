/**
 * Cloudflare Pages Function
 * Ruta: GET /api/despachos?month=7&year=2026
 *
 * Proxea hacia ZigZag manteniendo las credenciales del lado del servidor.
 * Las variables ZIGZAG_BASE_URL, ZIGZAG_ACCESO y ZIGZAG_USER se configuran en:
 * Cloudflare Dashboard > Pages > tu proyecto > Settings > Environment variables
 * (marcarlas como "Secret" para que no queden visibles en el dashboard).
 */
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const month = url.searchParams.get('month');
  const year = url.searchParams.get('year');

  if (!month || !year) {
    return new Response(JSON.stringify({ error: 'Faltan parámetros month y year' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { ZIGZAG_BASE_URL, ZIGZAG_ACCESO, ZIGZAG_USER } = env;

  try {
    const upstreamUrl = `${ZIGZAG_BASE_URL}/despachos_detalle?acceso=${ZIGZAG_ACCESO}&user=${ZIGZAG_USER}&month=${month}&year=${year}`;
    const upstream = await fetch(upstreamUrl);

    if (!upstream.ok) {
      console.error('Error upstream ZigZag:', upstream.status, upstream.statusText);
      return new Response(JSON.stringify({ error: 'No se pudo obtener datos de despachos' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await upstream.json();

    // TODO: mapear/normalizar al formato del dashboard cuando tengamos
    // un ejemplo real de la respuesta: { proceso, valor, unidad, meta, trend }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error de conexión con ZigZag:', err.message);
    return new Response(JSON.stringify({ error: 'Error de conexión con la API de despachos' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
