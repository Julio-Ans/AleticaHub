// Debug do endpoint /auth/me
const baseURL = 'https://atleticahubapi.onrender.com';

async function testAuthMe() {
    console.log('🔍 Testando endpoint /auth/me...');
    
    try {
        // Teste sem token
        console.log('\n📡 Teste sem token:');
        const responseNoToken = await fetch(`${baseURL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status:', responseNoToken.status);
        const dataNoToken = await responseNoToken.text();
        console.log('Resposta:', dataNoToken);
        
        // Teste com token inválido
        console.log('\n📡 Teste com token inválido:');
        const responseInvalidToken = await fetch(`${baseURL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token_invalido_123'
            }
        });
        
        console.log('Status:', responseInvalidToken.status);
        const dataInvalidToken = await responseInvalidToken.text();
        console.log('Resposta:', dataInvalidToken);
        
    } catch (error) {
        console.error('❌ Erro:', error);
    }
}

// Teste do endpoint de esportes
async function testEsportes() {
    console.log('\n🏃 Testando endpoint /api/esportes...');
    
    try {
        // Teste sem token (deveria funcionar)
        console.log('\n📡 Teste esportes sem token:');
        const responseNoToken = await fetch(`${baseURL}/api/esportes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status:', responseNoToken.status);
        const dataNoToken = await responseNoToken.text();
        console.log('Resposta:', dataNoToken.substring(0, 200) + '...');
        
        // Teste com token inválido
        console.log('\n📡 Teste esportes com token inválido:');
        const responseInvalidToken = await fetch(`${baseURL}/api/esportes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token_invalido_123'
            }
        });
        
        console.log('Status:', responseInvalidToken.status);
        const dataInvalidToken = await responseInvalidToken.text();
        console.log('Resposta:', dataInvalidToken.substring(0, 200) + '...');
        
    } catch (error) {
        console.error('❌ Erro:', error);
    }
}

async function runTests() {
    await testAuthMe();
    await testEsportes();
}

runTests();
