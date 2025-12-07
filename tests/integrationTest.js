/**
 * Integration test script for frontend-backend communication
 * Run this after starting both frontend and backend servers
 */

import { analyzeGitHubProfile, checkBackendHealth, fetchGitHubData } from '../services/api.js';

const runIntegrationTests = async () => {
  console.log('🚀 Starting Frontend-Backend Integration Tests...\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check Endpoint...');
  try {
    const health = await checkBackendHealth();
    console.log('✅ Health Check Passed:', health);
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
  }

  // Test 2: Valid GitHub Profile
  console.log('\n2️⃣ Testing GitHub Profile Analysis...');
  try {
    const testUrl = 'https://github.com/octocat';
    console.log(`Testing with: ${testUrl}`);
    const response = await analyzeGitHubProfile(testUrl);
    console.log('✅ GitHub Analysis Passed:', response.status);
  } catch (error) {
    console.error('❌ GitHub Analysis Failed:', error.message);
  }

  // Test 3: Invalid GitHub URL
  console.log('\n3️⃣ Testing Invalid GitHub URL Handling...');
  try {
    const invalidUrl = 'https://invalid-url.com/user';
    await analyzeGitHubProfile(invalidUrl);
    console.log('❌ Should have thrown validation error');
  } catch (error) {
    console.log('✅ Validation Working:', error.message);
  }

  // Test 4: Network Error Simulation
  console.log('\n4️⃣ Testing Network Error Handling...');
  try {
    // Test with non-existent endpoint
    await fetchGitHubData('non-existent-endpoint');
    console.log('❌ Should have thrown network error');
  } catch (error) {
    console.log('✅ Error Handling Working:', error.message);
  }

  console.log('\n🎉 Integration tests completed!');
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests().catch(console.error);
}

export default runIntegrationTests;
