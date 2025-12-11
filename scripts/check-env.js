// Quick test to verify environment variable is loaded
console.log('Checking environment variables...');
console.log('GOOGLE_APPS_SCRIPT_URL:', process.env.GOOGLE_APPS_SCRIPT_URL);

if (!process.env.GOOGLE_APPS_SCRIPT_URL) {
    console.error('❌ ERROR: GOOGLE_APPS_SCRIPT_URL is not set!');
    console.log('\n📝 Please add this to your .env.local file:');
    console.log('GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzRZF1xu1RX8dXbqSg6nH7zfMrOF7oJcI6578TtI_zWc8uHp-bm2MTbxmxZAyOsMiYW/exec');
} else {
    console.log('✅ GOOGLE_APPS_SCRIPT_URL is configured correctly!');
    console.log('URL:', process.env.GOOGLE_APPS_SCRIPT_URL);
}
