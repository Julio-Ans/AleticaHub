// Example usage of the testApi utilities
import { 
  testApiConnectivity, 
  testAuthenticatedEndpoints, 
  testAdminEndpoints,
  runComprehensiveTests,
  demoApiTesting,
  createTestRunner,
  quickDebugTest,
  apiTestSuite 
} from './testApi';

/**
 * Example 1: Basic API Testing without Authentication
 */
export async function runBasicTests() {
  console.log('🚀 Running Basic API Tests...\n');
  
  // Test basic connectivity to the API
  await testApiConnectivity();
  
  // Run a quick demo
  await demoApiTesting();
}

/**
 * Example 2: Testing with User Authentication
 * Replace 'your-actual-jwt-token' with a real JWT token from your login
 */
export async function runUserTests(userToken: string) {
  console.log('👤 Running User-specific Tests...\n');
    // Test authenticated endpoints
  await testAuthenticatedEndpoints(userToken);
  
  // Test specific endpoints with user permissions
  await apiTestSuite.workflows.messaging(userToken, '0', 'Test message from user');
  
  // Test shopping workflow
  // await apiTestSuite.workflows.shopping(1, 2); // product ID 1, quantity 2
}

/**
 * Example 3: Testing with Admin Authentication
 * Replace 'your-actual-admin-jwt-token' with a real admin JWT token
 */
export async function runAdminTests(adminToken: string) {
  console.log('🔐 Running Admin-specific Tests...\n');
  
  // Test admin endpoints
  await testAdminEndpoints(adminToken);
  
  // Test admin operations
  await apiTestSuite.admin.operations(adminToken);
}

/**
 * Example 4: Comprehensive Testing Suite
 * This runs all available tests with both user and admin tokens
 */
export async function runFullTestSuite(userToken?: string, adminToken?: string) {
  console.log('🎯 Running Full Test Suite...\n');
  
  await runComprehensiveTests(userToken, adminToken);
}

/**
 * Example 5: Create a Test Runner with Pre-configured Tokens
 * This creates a test runner object with methods for different test scenarios
 */
export function createMyTestRunner(userToken?: string, adminToken?: string) {
  const testRunner = createTestRunner(userToken, adminToken);
  
  return {
    // Basic tests (no auth required)
    testConnectivity: testRunner.runBasicTests,
    testPerformance: testRunner.runPerformanceTest,
    testErrors: testRunner.runErrorTests,
    
    // User tests (requires user token)
    testUserEndpoints: testRunner.runUserTests,
    testUserValidation: testRunner.testValidation,
    testUserConcurrency: testRunner.testConcurrency,
    
    // Admin tests (requires admin token)
    testAdminEndpoints: testRunner.runAdminTests,
    
    // Workflow tests
    testInscription: (esporteId: string) => testRunner.testWorkflows.inscription?.(esporteId),
    testShopping: (produtoId: number, quantity = 1) => testRunner.testWorkflows.shopping?.(produtoId, quantity),
    testEventInscription: (eventoId: string) => testRunner.testWorkflows.eventInscription?.(eventoId),
    testMessaging: (esporteId: string, message: string) => testRunner.testWorkflows.messaging?.(esporteId, message),
    
    // Full suite
    runAll: testRunner.runFullSuite,
  };
}

/**
 * Example 6: Quick Debug Tests
 * Useful for testing specific endpoints during development
 */
export async function debugSpecificEndpoints(token?: string) {
  console.log('🔍 Running Debug Tests...\n');
  
  // Test specific endpoints
  await quickDebugTest('/api/esportes', token);
  await quickDebugTest('/api/produtos');
  await quickDebugTest('/config/firebase');
  
  if (token) {
    await quickDebugTest('/api/inscricoes/minhas', token);
    await quickDebugTest('/api/cart', token);
  }
}

/**
 * Example 7: Test Specific Workflows
 * Test individual user workflows step by step
 */
export async function testUserWorkflows(userToken: string) {
  console.log('🛠️ Testing User Workflows...\n');
  
  try {
    // Test inscription workflow
    console.log('Testing inscription workflow...');
    // await apiTestSuite.workflows.inscription('some-sport-id');
    
    // Test shopping workflow
    console.log('Testing shopping workflow...');
    // await apiTestSuite.workflows.shopping(1, 2);
      // Test messaging
    console.log('Testing messaging...');
    await apiTestSuite.workflows.messaging(userToken, '0', 'Test message from workflow test');
    
    console.log('✅ All workflows tested successfully!');
  } catch (error) {
    console.error('❌ Workflow test failed:', error);
  }
}

/**
 * Example 8: Performance and Load Testing
 */
export async function runPerformanceTests(userToken?: string) {
  console.log('⚡ Running Performance Tests...\n');
  
  // Test API performance
  await apiTestSuite.advanced.performance();
  
  if (userToken) {
    // Test concurrent operations
    await apiTestSuite.advanced.concurrency(userToken);
    
    // Test edge cases
    await apiTestSuite.advanced.edgeCases(userToken);
  }
}

/**
 * Example 9: Error Testing and Validation
 */
export async function testErrorScenarios(userToken?: string) {
  console.log('🚨 Testing Error Scenarios...\n');
  
  // Test error handling
  await apiTestSuite.errorHandling();
  
  if (userToken) {
    // Test data validation
    await apiTestSuite.advanced.validation(userToken);
  }
  
  // Test API documentation compliance
  await apiTestSuite.advanced.compliance();
}

/**
 * Example 10: Automated Test Suite for CI/CD
 * This function can be used in automated testing environments
 */
export async function runAutomatedTests(config: {
  userToken?: string;
  adminToken?: string;
  skipPerformanceTests?: boolean;
  skipAdminTests?: boolean;
}) {
  console.log('🤖 Running Automated Test Suite...\n');
  
  const results: { [key: string]: boolean } = {};
  
  try {
    // Basic connectivity test
    console.log('Running connectivity tests...');
    await testApiConnectivity();
    results.connectivity = true;
  } catch (error) {
    console.error('Connectivity test failed:', error);
    results.connectivity = false;
  }
  
  if (config.userToken) {
    try {
      console.log('Running user tests...');
      await testAuthenticatedEndpoints(config.userToken);
      results.userTests = true;
    } catch (error) {
      console.error('User tests failed:', error);
      results.userTests = false;
    }
  }
  
  if (config.adminToken && !config.skipAdminTests) {
    try {
      console.log('Running admin tests...');
      await testAdminEndpoints(config.adminToken);
      results.adminTests = true;
    } catch (error) {
      console.error('Admin tests failed:', error);
      results.adminTests = false;
    }
  }
  
  if (!config.skipPerformanceTests) {
    try {
      console.log('Running performance tests...');
      await apiTestSuite.advanced.performance();
      results.performanceTests = true;
    } catch (error) {
      console.error('Performance tests failed:', error);
      results.performanceTests = false;
    }
  }
  
  // Generate test report
  console.log('\n📊 Test Results Summary:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📈 Overall: ${passedTests}/${totalTests} tests passed`);
  
  return results;
}

// Export all examples for easy usage
export const apiTestExamples = {
  basic: runBasicTests,
  user: runUserTests,
  admin: runAdminTests,
  fullSuite: runFullTestSuite,
  createRunner: createMyTestRunner,
  debug: debugSpecificEndpoints,
  workflows: testUserWorkflows,
  performance: runPerformanceTests,
  errors: testErrorScenarios,
  automated: runAutomatedTests,
};

// Example usage in console:
/*
// 1. Basic tests (no authentication)
await apiTestExamples.basic();

// 2. User tests (requires JWT token)
const userToken = 'your-jwt-token-here';
await apiTestExamples.user(userToken);

// 3. Admin tests (requires admin JWT token)
const adminToken = 'your-admin-jwt-token-here';
await apiTestExamples.admin(adminToken);

// 4. Full test suite
await apiTestExamples.fullSuite(userToken, adminToken);

// 5. Create test runner
const myTestRunner = apiTestExamples.createRunner(userToken, adminToken);
await myTestRunner.testConnectivity();
await myTestRunner.runAll();

// 6. Debug specific endpoints
await apiTestExamples.debug();
await apiTestExamples.debug(userToken);

// 7. Performance tests
await apiTestExamples.performance(userToken);

// 8. Error testing
await apiTestExamples.errors(userToken);

// 9. Automated testing for CI/CD
const results = await apiTestExamples.automated({
  userToken,
  adminToken,
  skipPerformanceTests: false,
  skipAdminTests: false
});
*/
