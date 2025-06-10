// Script para testar login e salvar token
async function testarLoginCompleto() {
    console.log('🔄 Testando login completo...');
    
    try {
        // 1. Testar se a API está respondendo
        console.log('📡 Testando conexão com API...');
        const healthCheck = await fetch('https://atleticahubapi.onrender.com/config/firebase');
        if (!healthCheck.ok) {
            console.error('❌ API não está respondendo');
            return;
        }
        console.log('✅ API respondendo');
        
        // 2. Testar login direto (se houver endpoint)
        console.log('🔑 Tentando login direto...');
        const loginDireto = await fetch('https://atleticahubapi.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@test.com',
                password: '123456'
            })
        });
        
        if (loginDireto.ok) {
            const loginData = await loginDireto.json();
            console.log('✅ Login direto funcionou!', loginData);
            
            // Salvar token
            localStorage.setItem('authToken', loginData.token);
            localStorage.setItem('athletica_token', loginData.token);
            console.log('🔑 Token salvo!');
            
            return loginData.token;
        } else {
            console.log('⚠️ Login direto não funcionou, tentando com Firebase...');
        }
        
        // 3. Se login direto não funcionar, verificar se precisa do Firebase
        console.log('🔥 Verificando configuração Firebase...');
        const firebaseConfig = await healthCheck.json();
        console.log('Firebase config:', firebaseConfig);
        
        console.log('ℹ️ Login com Firebase seria necessário aqui');
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

// Executar teste
testarLoginCompleto().then(token => {
    if (token) {
        console.log('🎉 Login concluído com sucesso!');
        console.log('Token salvo:', localStorage.getItem('authToken') ? 'SIM' : 'NÃO');
    }
});
