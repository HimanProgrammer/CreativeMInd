/**
 * Turns a downloaded Firebase service-account JSON into the single-line
 * .env.local entry the admin user-management API needs.
 *
 *   node scripts/add-service-key.js "C:/Users/you/Downloads/creatiemind-xxxx.json" you@example.com
 *
 * Writes FIREBASE_SERVICE_ACCOUNT_KEY (and ADMIN_EMAILS if given) into .env.local,
 * replacing any existing values. The key is never printed to the console.
 */
const fs = require('fs');
const path = require('path');

const [, , jsonPath, adminEmail] = process.argv;

if (!jsonPath) {
  console.error('Usage: node scripts/add-service-key.js <path-to-service-account.json> [admin@email.com]');
  process.exit(1);
}
if (!fs.existsSync(jsonPath)) {
  console.error(`✗ File not found: ${jsonPath}`);
  process.exit(1);
}

let creds;
try {
  creds = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (e) {
  console.error(`✗ That file is not valid JSON: ${e.message}`);
  process.exit(1);
}

for (const field of ['type', 'project_id', 'private_key', 'client_email']) {
  if (!creds[field]) {
    console.error(`✗ Missing "${field}". This does not look like a service-account key.`);
    console.error('  Get it from: Firebase Console → Project Settings → Service accounts → Generate new private key');
    process.exit(1);
  }
}
if (creds.type !== 'service_account') {
  console.error(`✗ Expected "type":"service_account" but got "${creds.type}".`);
  process.exit(1);
}

const envPath = path.join(process.cwd(), '.env.local');
let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

// JSON.stringify keeps the \n escapes inside private_key, which is what we want
// on a single line — firebaseAdmin.js unescapes them at runtime.
const line = `FIREBASE_SERVICE_ACCOUNT_KEY=${JSON.stringify(creds)}`;

const upsert = (text, key, value) => {
  const re = new RegExp(`^${key}=.*$`, 'm');
  return re.test(text) ? text.replace(re, value) : `${text.replace(/\s*$/, '')}\n${value}\n`;
};

env = upsert(env, 'FIREBASE_SERVICE_ACCOUNT_KEY', line);
if (adminEmail) env = upsert(env, 'ADMIN_EMAILS', `ADMIN_EMAILS=${adminEmail}`);

fs.writeFileSync(envPath, env, 'utf8');

console.log('✓ Wrote FIREBASE_SERVICE_ACCOUNT_KEY to .env.local');
console.log(`  project_id:   ${creds.project_id}`);
console.log(`  client_email: ${creds.client_email}`);
if (adminEmail) console.log(`✓ Wrote ADMIN_EMAILS=${adminEmail}`);
else console.log('! No admin email given — add ADMIN_EMAILS=you@example.com yourself, or you will get 403.');
console.log('\nNext: restart the dev server, then open /admin/users');
console.log('Remember to add BOTH variables in Vercel for production.');
