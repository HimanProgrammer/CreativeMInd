import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Support both new publishable key format and legacy anon key
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// The client is built on first use, not on import. createClient() throws
// ("supabaseUrl is required") when the env vars are missing, and at module
// scope that kills the whole build during prerendering — every page importing
// this file fails, even though none of them touch Supabase until a browser
// effect runs. Deferring it keeps the build green and turns a missing key into
// a runtime error on the one call that actually needs it.
let client = null;

function getClient() {
  if (!client) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).'
      );
    }
    client = createClient(supabaseUrl, supabaseKey);
  }
  return client;
}

export const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      const value = getClient()[prop];
      return typeof value === 'function' ? value.bind(getClient()) : value;
    },
    has(_target, prop) {
      return prop in getClient();
    },
  }
);

export { getClient as getSupabase };
