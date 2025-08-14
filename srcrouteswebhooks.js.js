import { Router } from 'express';

const router = Router();

const N8N_WEBHOOK_BASE = process.env.N8N_WEBHOOK_BASE; // ex.: https://socd.app.n8n.cloud/webhook
const N8N_API_KEY = process.env.N8N_API_KEY || '';     // se usar header próprio

async function forwardToN8N(path, method, body) {
  if (!N8N_WEBHOOK_BASE) return null; // sem forward
  const url = `${N8N_WEBHOOK_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const headers = { 'Content-Type': 'application/json' };
  if (N8N_API_KEY) headers['x-api-key'] = N8N_API_KEY;

  const res = await fetch(url, {
    method,
    headers,
    body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
  });
  const text = await res.text();
  try { return { status: res.status, data: JSON.parse(text) }; }
  catch { return { status: res.status, data: text }; }
}

// GET /webhook/health
router.get('/webhook/health', async (req, res) => {
  const fwd = await forwardToN8N('/webhook/health', 'GET');
  if (fwd) return res.status(fwd.status).json(fwd.data);
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /webhook/catalog/product
router.post('/webhook/catalog/product', async (req, res) => {
  const fwd = await forwardToN8N('/webhook/catalog/product', 'POST', req.body);
  if (fwd) return res.status(fwd.status).send(fwd.data);
  const body = req.body || {};
  return res.json({ received: true, productId: String(body.productId ?? body.id ?? 'unknown') });
});

// POST /webhook/orders/get
router.post('/webhook/orders/get', async (req, res) => {
  const fwd = await forwardToN8N('/webhook/orders/get', 'POST', req.body);
  if (fwd) return res.status(fwd.status).send(fwd.data);
  const body = req.body || {};
  const orderId = String(body.orderId ?? 'missing');
  return res.json({
    orderId,
    status: 'invoiced',
    total: 350.0,
    items: [
      { sku: 'SKU-123', name: 'Produto A', quantity: 1, price: 100.0 },
      { sku: 'SKU-456', name: 'Produto B', quantity: 5, price: 50.0 },
    ],
    customer: { id: 'CUST-1', name: 'Cliente Exemplo', email: 'cliente@example.com' },
  });
});

// POST /webhook/orders/list
router.post('/webhook/orders/list', async (req, res) => {
  const fwd = await forwardToN8N('/webhook/orders/list', 'POST', req.body);
  if (fwd) return res.status(fwd.status).send(fwd.data);
  const body = req.body || {};
  const page = Number(body.page ?? 1);
  const pageSize = Number(body.pageSize ?? 2);
  const orders = [
    { orderId: '1001', status: 'invoiced', total: 199.9, items: [], customer: { id: 'C1', name: 'Cliente 1' } },
    { orderId: '1002', status: 'processing', total: 89.9, items: [], customer: { id: 'C2', name: 'Cliente 2' } },
  ];
  return res.json({ total: orders.length, page, pageSize, orders });
});

// POST /webhook/inventory/sku
router.post('/webhook/inventory/sku', async (req, res) => {
  const fwd = await forwardToN8N('/webhook/inventory/sku', 'POST', req.body);
  if (fwd) return res.status(fwd.status).send(fwd.data);
  const body = req.body || {};
  const sku = String(body.sku ?? 'SKU-UNKNOWN');
  return res.json({ sku, available: 42, updatedAt: new Date().toISOString() });
});

// POST /webhook/pricing/sku
router.post('/webhook/pricing/sku', async (req, res) => {
  const fwd = await forwardToN8N('/webhook/pricing/sku', 'POST', req.body);
  if (fwd) return res.status(fwd.status).send(fwd.data);
  const body = req.body || {};
  const sku = String(body.sku ?? 'SKU-UNKNOWN');
  return res.json({ sku, price: 19.9, listPrice: 24.9, currency: 'BRL', updatedAt: new Date().toISOString() });
});

export default router;
