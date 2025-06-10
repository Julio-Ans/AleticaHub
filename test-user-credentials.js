// Quick test to verify user credentials
import fetch from 'node-fetch';

async function testUser() {
    console.log('🧪 Testing user credentials...');
    
    const email = 'user3@fatec.br';
    const password = '123456';
    
    try {
        // Test 1: Direct backend login (without Firebase)
        console.log('📡 Testing direct backend login...');
        
        const response = await fetch('https://atleticahubapi.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                password: password 
            }),
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Direct login successful!', data);
            return data;
        } else {
            const error = await response.text();
            console.log('❌ Direct login failed:', response.status, error);
            
            // Try to parse as JSON if possible
            try {
                const errorData = JSON.parse(error);
                console.log('Error details:', errorData);
            } catch {
                console.log('Raw error:', error);
            }
        }
        
    } catch (error) {
        console.error('❌ Network error:', error);
    }
}

// Run the test
testUser();
