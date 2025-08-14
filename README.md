# SOCD Webhooks API — Facade para n8n

Servidor Express que **encaminha** (forward) todos os endpoints para o **Webhook Trigger do n8n** quando `N8N_WEBHOOK_BASE` está definido. Se não estiver, responde com mocks locais.

## Variáveis de ambiente

- `N8N_WEBHOOK_BASE` — URL base dos webhooks do n8n (ex.: `https://socd.app.n8n.cloud/webhook`).
- `N8N_API_KEY` — (opcional) chave para enviar no header `x-api-key` ao n8n.

## Rodar localmente

```bash
npm install
npm run dev
# http://localhost:3000
```

## Exemplo de uso (forward)

```bash
export N8N_WEBHOOK_BASE="https://socd.app.n8n.cloud/webhook"
# opcional: export N8N_API_KEY="minha-chave"

node src/index.js
# Rotas:
# GET  /webhook/health
# POST /webhook/catalog/product
# POST /webhook/orders/get
# POST /webhook/orders/list
# POST /webhook/inventory/sku
# POST /webhook/pricing/sku
```
