import { exec } from 'child_process';

// Log to check if RAILWAY_DATABASE_URL is correctly set
console.log('RAILWAY_DATABASE_URL:', process.env.RAILWAY_DATABASE_URL);

// Set the DATABASE_URL temporarily to RAILWAY_DATABASE_URL for the push command
if (process.env.RAILWAY_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.RAILWAY_DATABASE_URL;
  console.log('DATABASE_URL has been set to Railway database URL');
} else {
  console.error('Error: RAILWAY_DATABASE_URL is not set. Please ensure this environment variable is available.');
  process.exit(1);  // Exit the script if the DATABASE_URL is not set.
}

console.log('Database URL:', process.env.DATABASE_URL);  // Log to confirm the final DATABASE_URL

console.log('Pushing schema to Railway database...');
exec('npm run db:push', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
