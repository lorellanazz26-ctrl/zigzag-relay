/**
 * Cloudflare Pages Function
 * Ruta: GET /api/status
 * Health-check de las integraciones, usado por el panel admin.
 */
export async function onRequestGet(context) {
  const { env } = context;
  const { ZIGZAG_BASE_URL, ZIGZAG_ACCESO, ZIGZAG_USER } = env;
  const checks = [];

  try {
    const now = new Date();
    const url = `${ZIGZAG_BASE_URL}/despachos_detalle?acceso=${ZIGZAG_ACCESO}&user=${ZIGZAG_USER}&month=${now.getMonth() + 1}&year=${now.getFullYear()}`;
    const r = await fetch(url);
    checks.push({ name: 'API Despachos (ZigZag)', url: ZIGZAG_BASE_URL, ok: r.ok });
  } catch {
    checks.push({ name: 'API Despachos (ZigZag)', url: ZIGZAG_BASE_URL, ok: false });
  }

  // TODO: agregar un check por cada API adicional (picking, packing, inventario...)

  return new Response(JSON.stringify(checks), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
