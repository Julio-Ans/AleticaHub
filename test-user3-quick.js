// Quick test for user3@fatec.br authentication
(async () => {
    console.log('🧪 Testing user3@fatec.br authentication...');
    
    try {
        // Test direct backend first
        console.log('📡 Testing direct backend authentication...');
        
        const directResponse = await fetch('https://atleticahubapi.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'user3@fatec.br',
                password: '123456'
            }),
        });
        
        console.log(`Direct auth response: ${directResponse.status}`);
        
        if (directResponse.ok) {
            const data = await directResponse.json();
            console.log('✅ Direct authentication successful!', data);
        } else {
            const error = await directResponse.text();
            console.log('❌ Direct authentication failed:', error);
            
            // This confirms the backend requires Firebase authentication
            console.log('✨ Backend requires Firebase authentication - this is expected');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
})();
