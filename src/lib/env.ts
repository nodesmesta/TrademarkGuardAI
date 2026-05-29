
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY',
];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[ENV] Required env var ${key} is missing`);
  }
});

export const validateEnv = () => {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required env variables: ${missing.join(', ')}`);
  }
};
