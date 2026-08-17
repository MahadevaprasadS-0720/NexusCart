// Clover eCommerce Configuration for Frontend
export const CLOVER_CONFIG = {
  tokenName: 'Clover eComm Iframe',
  integrationType: 'IFRAME',
  merchantId: import.meta.env.VITE_CLOVER_MERCHANT_ID || 'DS4FQK0J81Z21',
  publicToken: import.meta.env.VITE_CLOVER_PUBLIC_TOKEN || 'bb54ff7ea831c08ee1cc01f1acb750b',
  privateToken: 'a05a0cdc-7e14-39e6-9a3c-660754e3bb35',
  environment: import.meta.env.VITE_CLOVER_ENVIRONMENT || 'sandbox',
  apiBaseUrl: import.meta.env.VITE_CLOVER_API_BASE || 'https://apisandbox.dev.clover.com',
  ecommBaseUrl: import.meta.env.VITE_CLOVER_ECOMM_BASE || 'https://scl-sandbox.dev.clover.com',
  iframeBaseUrl: 'https://checkout.sandbox.dev.clover.com',
  dashboardUrl: 'https://sandbox.dev.clover.com/setupapp/m/DS4FQK0J81Z21/ecomm-api-tokens'
};

export default CLOVER_CONFIG;
