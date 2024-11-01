interface EnvConfig {
  apiUrl: string;
  openaiApiKey: string;
  brevoApiKey: string;
}

const requiredEnvVars = [
  'VITE_API_URL',
  'VITE_OPENAI_API_KEY',
  'VITE_BREVO_API_KEY'
];

const validateEnv = (): void => {
  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw new Error('Application cannot start due to missing environment variables');
  }
};

const getEnvConfig = (): EnvConfig => {
  validateEnv();

  return {
    apiUrl: import.meta.env.VITE_API_URL,
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    brevoApiKey: import.meta.env.VITE_BREVO_API_KEY
  };
};

export const config = getEnvConfig();