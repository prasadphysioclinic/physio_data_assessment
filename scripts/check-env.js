// Quick test to verify environment variable is loaded
console.log('Checking environment variables...');
console.log('GOOGLE_APPS_SCRIPT_URL:', process.env.GOOGLE_APPS_SCRIPT_URL);

if (!process.env.GOOGLE_APPS_SCRIPT_URL) {
    console.error('❌ ERROR: GOOGLE_APPS_SCRIPT_URL is not set!');
    console.log('\n📝 Please add this to your .env.local file:');
    console.log('GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbw7FLPoP3zRUQ8PyuUDd_e1NZhJFu4AdqfHzJolEu-2MB7ZmBiWe8-WBdnzH-aiG1LL/exec');
} else {
    console.log('✅ GOOGLE_APPS_SCRIPT_URL is configured correctly!');
    console.log('URL:', process.env.GOOGLE_APPS_SCRIPT_URL);
}
