import { addToWaitlist } from './services/emailService';

const testEmail = 'test@example.com';

async function runTest() {
  console.log(`Testing addToWaitlist with email: ${testEmail}`);
  const result = await addToWaitlist(testEmail);
  console.log(`Result: ${result ? 'Success' : 'Failure'}`);
}

runTest();