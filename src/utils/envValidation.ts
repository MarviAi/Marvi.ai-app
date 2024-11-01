/**
 * Validates required environment variables
 * @returns True if all required variables are present
 */
export const validateEnv = (): boolean => {
  const requiredVars = ['VITE_BREVO_API_KEY', 'VITE_OPENAI_API_KEY'];
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    return false;
  }

  return true;
};