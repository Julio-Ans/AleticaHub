// Debug script para ser executado no console do navegador
// Para usar: copie e cole este código no console do navegador (F12)

async function debugUserToken() {
  console.log('🔍 Iniciando debug do token do usuário...');
    // Verificar localStorage e sessionStorage
  const authToken = localStorage.getItem('athletica_token') || 
                   localStorage.getItem('authToken') || 
                   localStorage.getItem('token') || 
                   sessionStorage.getItem('athletica_token') || 
                   sessionStorage.getItem('authToken') || 
                   sessionStorage.getItem('token');
  
  console.log('📋 Verificando armazenamento local...');
  console.log('localStorage athletica_token:', localStorage.getItem('athletica_token'));
  console.log('localStorage authToken:', localStorage.getItem('authToken'));
  console.log('localStorage token:', localStorage.getItem('token'));
  console.log('sessionStorage athletica_token:', sessionStorage.getItem('athletica_token'));
  console.log('sessionStorage authToken:', sessionStorage.getItem('authToken'));
  console.log('sessionStorage token:', sessionStorage.getItem('token'));
  
  if (!authToken) {
    console.log('❌ Nenhum token encontrado no localStorage ou sessionStorage');
    console.log('🔍 Verificando todas as chaves no localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`  ${key}: ${localStorage.getItem(key)}`);
    }
    return;
  }
  
  console.log('✅ Token encontrado:', authToken);
  
  // Analisar o token JWT
  try {
    const tokenParts = authToken.split('.');
    if (tokenParts.length !== 3) {
      console.log('❌ Token não parece ser um JWT válido (não tem 3 partes)');
      return;
    }
    
    const header = JSON.parse(atob(tokenParts[0]));
    const payload = JSON.parse(atob(tokenParts[1]));
    
    console.log('\n📊 Análise do Token:');
    console.log('Header:', header);
    console.log('Payload:', payload);
    
    // Verificar expiração
    if (payload.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      console.log('Expira em:', expirationDate);
      console.log('Agora:', now);
      console.log('Token válido:', expirationDate > now ? '✅ SIM' : '❌ NÃO (expirado)');
    }
    
    // Verificar informações do usuário
    if (payload.sub || payload.userId || payload.id) {
      console.log('ID do usuário:', payload.sub || payload.userId || payload.id);
    }
    
  } catch (error) {
    console.log('❌ Erro ao decodificar token:', error);
  }
  
  // Testar o token com a API
  console.log('\n🔧 Testando token com a API...');
  
  try {
    // Teste com endpoint de esportes
    const esportesResponse = await fetch('https://atleticahubapi.onrender.com/api/esportes', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status /api/esportes:', esportesResponse.status);
    
    if (esportesResponse.ok) {
      const esportes = await esportesResponse.json();
      console.log('✅ Esportes carregados com sucesso:', esportes);
    } else {
      const errorText = await esportesResponse.text();
      console.log('❌ Erro ao carregar esportes:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Erro na requisição:', error);
  }
  
  // Teste com endpoint de verificação
  try {
    const verifyResponse = await fetch('https://atleticahubapi.onrender.com/auth/verify', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status /auth/verify:', verifyResponse.status);
    
    if (verifyResponse.ok) {
      const userData = await verifyResponse.json();
      console.log('✅ Token válido, dados do usuário:', userData);
    } else {
      const errorText = await verifyResponse.text();
      console.log('❌ Token inválido:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Erro na verificação:', error);
  }
}

// Executar automaticamente
debugUserToken();

// Função para debug manual com token
window.debugTokenManual = function(token) {
  console.log('🔍 Debug manual com token fornecido...');
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log('❌ Token não parece ser um JWT válido');
      return;
    }
    
    const payload = JSON.parse(atob(tokenParts[1]));
    console.log('Payload:', payload);
    
    if (payload.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      console.log('Expira em:', expirationDate);
      console.log('Token válido:', expirationDate > now ? '✅ SIM' : '❌ NÃO');
    }
    
  } catch (error) {
    console.log('❌ Erro ao analisar token:', error);
  }
};

console.log('✨ Script de debug carregado!');
console.log('💡 Para debug manual com token: debugTokenManual("SEU_TOKEN_AQUI")');
