// testConfig.js
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import('../config/config.cjs').then(module => {
  const config = module.default;
  console.log('Development Config:', config.development);
  console.log('Production Config:', config.production);
}).catch(err => {
  console.error('Error loading config:', err);
});