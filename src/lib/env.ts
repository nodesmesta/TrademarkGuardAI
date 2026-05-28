// Centralized environment validation for server side
// This file is imported wherever we need to ensure required env vars are present.

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY',
];

// Check each required variable and log a clear error if missing.
required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[ENV] Required env var ${key} is missing`);
  }
});

// Export a helper if other modules want to verify at runtime.
export const validateEnv = () => {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required env variables: ${missing.join(', ')}`);
  }
};
