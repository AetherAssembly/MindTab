// Validates that every CSS selector in config/filters.json is parseable.
// Run via: node .github/scripts/check-selectors.js

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filters = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../config/filters.json'), 'utf8')
);

const { document } = new JSDOM('<!DOCTYPE html><html><body></body></html>').window;

let errors = 0;

for (const [site, selectors] of Object.entries(filters.feedSanitizer)) {
  for (const selector of selectors) {
    try {
      document.querySelector(selector);
      console.log(`  ✓  [${site}] ${selector}`);
    } catch (e) {
      if (e.name === 'SyntaxError') {
        console.error(`  ✗  [${site}] ${selector}`);
        console.error(`        ${e.message}`);
        errors++;
      } else {
        // Not a syntax error (e.g. unsupported pseudo-class in jsdom) - skip
        console.log(`  ?  [${site}] ${selector}  (skipped: ${e.message})`);
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} invalid selector(s) found.`);
  process.exit(1);
} else {
  console.log('\nAll selectors are valid.');
}
