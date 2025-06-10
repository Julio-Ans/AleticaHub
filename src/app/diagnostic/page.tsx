'use client';

import { useState } from 'react';

export default function DiagnosticTest() {
  const [log, setLog] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLog(prev => prev + `${new Date().toLocaleTimeString()}: ${message}\n`);
  };

  const testFirebaseConnection = async () => {
    setLoading(true);
    setLog('');
    addLog('🔥 Starting Firebase connection test...');
    
    try {
      // Test 1: Import FirebaseService
      addLog('Step 1: Importing FirebaseService...');
      const { FirebaseService } = await import('@/services/firebase/firebaseService');
      addLog('✅ FirebaseService imported successfully');
      
      // Test 2: Initialize Firebase
      addLog('Step 2: Initializing Firebase...');
      const firebaseService = new FirebaseService();
      await firebaseService.initialize();
      addLog('✅ Firebase initialized successfully');
      
      // Test 3: Check Firebase config
      addLog('Step 3: Getting Firebase config...');
      const config = await firebaseService.getFirebaseConfig();
      addLog(`✅ Firebase config retrieved: projectId=${config.projectId}`);
      
      addLog('🎉 Firebase connection test completed successfully!');
      
    } catch (error) {
      addLog(`❌ Firebase connection failed: ${error}`);
    }
    
    setLoading(false);
  };

  const testBackendConnection = async () => {
    setLoading(true);
    addLog('');
    addLog('🌐 Starting backend connection test...');
    
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
      addLog(`Testing connection to: ${baseURL}`);
      
      // Test 1: Health check
      addLog('Step 1: Health check...');
      const healthResponse = await fetch(`${baseURL}/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.text();
        addLog(`✅ Health check OK: ${healthData}`);
      } else {
        addLog(`⚠️ Health check returned: ${healthResponse.status}`);
      }
      
      // Test 2: Firebase config endpoint
      addLog('Step 2: Testing Firebase config endpoint...');
      const configResponse = await fetch(`${baseURL}/config/firebase`);
      if (configResponse.ok) {
        const configData = await configResponse.json();
        addLog(`✅ Firebase config endpoint OK: projectId=${configData.projectId}`);
      } else {
        addLog(`⚠️ Firebase config endpoint returned: ${configResponse.status}`);
      }
      
      // Test 3: Check CORS
      addLog('Step 3: Testing CORS...');
      const corsResponse = await fetch(`${baseURL}/api/esportes`, {
        method: 'OPTIONS',
      });
      addLog(`CORS preflight response: ${corsResponse.status}`);
      
      addLog('🎉 Backend connection test completed!');
      
    } catch (error) {
      addLog(`❌ Backend connection failed: ${error}`);
    }
    
    setLoading(false);
  };

  const testFullAuthFlow = async () => {
    setLoading(true);
    setLog('');
    addLog('🔐 Starting complete authentication flow test...');
    
    try {
      // Clear existing tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('athletica_token');
      addLog('🧹 Cleared existing tokens');
      
      // Step 1: Firebase Authentication
      addLog('Step 1: Testing Firebase authentication...');
      const { FirebaseService } = await import('@/services/firebase/firebaseService');
      const firebaseService = new FirebaseService();
        const testEmail = 'user3@fatec.br';
      const testPassword = '123456';
      
      addLog(`Attempting Firebase sign-in with: ${testEmail}`);
      
      let firebaseToken: string;
      try {
        firebaseToken = await firebaseService.signIn(testEmail, testPassword);
        addLog(`✅ Firebase authentication successful! Token length: ${firebaseToken.length}`);
        addLog(`Token preview: ${firebaseToken.substring(0, 100)}...`);
      } catch (firebaseError) {
        addLog(`❌ Firebase authentication failed: ${firebaseError}`);
        
        // Try to create the user if login failed
        addLog('Attempting to create test user...');
        try {
          firebaseToken = await firebaseService.signUp(testEmail, testPassword);
          addLog(`✅ User created and signed in! Token length: ${firebaseToken.length}`);
        } catch (signupError) {
          addLog(`❌ User creation also failed: ${signupError}`);
          setLoading(false);
          return;
        }
      }
      
      // Step 2: Backend Authentication
      addLog('Step 2: Testing backend authentication...');
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
      
      const loginPayload = {
        idToken: firebaseToken,
        email: testEmail,
        displayName: testEmail.split('@')[0]
      };
      
      addLog(`Sending login request to: ${baseURL}/auth/login`);
      addLog(`Payload: ${JSON.stringify(loginPayload, null, 2)}`);
      
      const loginResponse = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload),
      });
      
      addLog(`Backend login response status: ${loginResponse.status}`);
        if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        addLog(`✅ Backend authentication successful!`);
        
        if (loginData.token) {
          addLog(`JWT Token: ${loginData.token.substring(0, 100)}...`);
          // Save tokens
          localStorage.setItem('authToken', loginData.token);
          localStorage.setItem('athletica_token', loginData.token);
          addLog(`✅ Tokens saved to localStorage`);
        } else {
          addLog(`⚠️ No token received from backend`);
        }
        
        if (loginData.user) {
          addLog(`User data: ${JSON.stringify(loginData.user, null, 2)}`);
        } else {
          addLog(`⚠️ No user data received from backend`);        }
        
        // Step 3: Test authenticated API call
        addLog('Step 3: Testing authenticated API call...');
          if (loginData.token) {
          const apiResponse = await fetch(`${baseURL}/api/esportes`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${loginData.token}`,
            },
          });
          
          addLog(`Sports API response status: ${apiResponse.status}`);
          
          if (apiResponse.ok) {
            const sportsData = await apiResponse.json();
            addLog(`✅ Authenticated API call successful!`);
            addLog(`Found ${sportsData.length} sports in the system`);
            sportsData.slice(0, 3).forEach((sport: { nome: string }, index: number) => {
              addLog(`  ${index + 1}. ${sport.nome}`);
            });
          } else {
            const errorText = await apiResponse.text();
            addLog(`❌ Authenticated API call failed: ${errorText}`);
          }
        } else {
          addLog(`❌ Cannot test API call - no token available`);
        }
        
        addLog('🎉 Complete authentication flow test successful!');
        
      } else {
        const errorText = await loginResponse.text();
        addLog(`❌ Backend authentication failed: ${errorText}`);
      }
      
    } catch (error) {
      addLog(`❌ Authentication flow error: ${error}`);
    }
    
    setLoading(false);
  };

  const clearLogs = () => {
    setLog('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Authentication Diagnostic Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testFirebaseConnection}
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : '🔥 Test Firebase'}
          </button>
          
          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : '🌐 Test Backend'}
          </button>
          
          <button
            onClick={testFullAuthFlow}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : '🔐 Test Full Flow'}
          </button>
        </div>
        
        <div className="mb-4">
          <button
            onClick={clearLogs}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Logs
          </button>
        </div>
        
        <div className="bg-black text-green-400 p-6 rounded font-mono text-sm whitespace-pre-wrap min-h-96 overflow-auto">
          {log || 'Click a button to start diagnostic testing...'}
        </div>
      </div>
    </div>
  );
}
