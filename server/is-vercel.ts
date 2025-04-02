/**
 * Helper function to detect if the code is running in a Vercel environment
 */
export function isVercel(): boolean {
  return process.env.VERCEL === '1';
}