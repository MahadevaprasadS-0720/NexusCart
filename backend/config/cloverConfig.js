// Clover eCommerce & Merchant API Configuration
require('dotenv').config();

const cloverConfig = {
  merchantId: process.env.CLOVER_MERCHANT_ID || 'DS4FQK0J81Z21',
  publicToken: process.env.CLOVER_PUBLIC_TOKEN || 'bb54ff7ea831c08ee1cc01f1acb750b',
  privateToken: process.env.CLOVER_PRIVATE_TOKEN || 'a05a0cdc-7e14-39e6-9a3c-660754e3bb35',
  environment: process.env.CLOVER_ENVIRONMENT || 'sandbox',
  apiBaseUrl: process.env.CLOVER_API_BASE || 'https://apisandbox.dev.clover.com',
  ecommBaseUrl: process.env.CLOVER_ECOMM_BASE || 'https://scl-sandbox.dev.clover.com',
  tokenName: 'Clover eComm Iframe',
  integrationType: 'IFRAME'
};

module.exports = cloverConfig;
