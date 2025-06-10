// Debug script para verificar token do usuário logado
const baseURL = 'https://atleticahubapi.onrender.com';

async function debugUserToken() {
  console.log('🔍 Iniciando debug do token do usuário...');
  console.log('Base URL:', baseURL);
  
  // Primeiro, vamos tentar pegar o token do localStorage (simulando como o frontend faria)
  console.log('\n📋 Verificando como obter o token...');
  console.log('⚠️  Este script precisa ser executado no contexto do navegador para acessar localStorage');
  console.log('Ou você pode fornecer o token manualmente abaixo.\n');
  
  // Para teste, vamos verificar a API sem token primeiro
  await testTokenVerificationEndpoint();
  
  console.log('\n💡 Para testar com seu token real:');
  console.log('1. Abra o console do navegador (F12)');
  console.log('2. Execute: localStorage.getItem("authToken") ou sessionStorage.getItem("authToken")');
  console.log('3. Copie o token e execute: await debugUserTokenWithToken("SEU_TOKEN_AQUI")');
}

async function testTokenVerificationEndpoint() {
  console.log('🔧 Testando endpoint de verificação de token...');
  
  try {
    // Teste sem token - deve retornar 401
    const response = await fetch(`${baseURL}/auth/verify`);
    console.log('Status sem token:', response.status);
    
    if (response.status === 401) {
      console.log('✅ Endpoint de verificação funcionando (retorna 401 sem token)');
    } else {
      console.log('⚠️  Resposta inesperada:', response.status);
      const data = await response.text();
      console.log('Resposta:', data);
    }
  } catch (error) {
    console.error('❌ Erro ao testar endpoint de verificação:', error);
  }
  
  try {
    // Teste com token inválido - deve retornar 401
    const invalidResponse = await fetch(`${baseURL}/auth/verify`, {
      headers: {
        'Authorization': 'Bearer token-invalido-teste'
      }
    });
    console.log('Status com token inválido:', invalidResponse.status);
    
    if (invalidResponse.status === 401) {
      console.log('✅ Endpoint rejeita tokens inválidos corretamente');
    }
  } catch (error) {
    console.error('❌ Erro ao testar token inválido:', error);
  }
}

async function debugUserTokenWithToken(token) {
  console.log('🔍 Debugando token fornecido...');
  console.log('Token (primeiros 20 chars):', token ? token.substring(0, 20) + '...' : 'undefined');
  
  if (!token) {
    console.log('❌ Token não fornecido');
    return;
  }
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  try {
    // 1. Verificar se o token é válido
    console.log('\n1️⃣ Verificando validade do token...');
    const verifyResponse = await fetch(`${baseURL}/auth/verify`, { headers });
    console.log('Status verificação:', verifyResponse.status);
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ Token válido!');
      console.log('Dados do usuário:', {
        uid: verifyData.uid,
        email: verifyData.email,
        displayName: verifyData.displayName,
        isAdmin: verifyData.isAdmin
      });
      
      // 2. Testar endpoint de esportes com token válido
      console.log('\n2️⃣ Testando endpoint /api/esportes com token válido...');
      const esportesResponse = await fetch(`${baseURL}/api/esportes`, { headers });
      console.log('Status esportes:', esportesResponse.status);
      
      if (esportesResponse.ok) {
        const esportesData = await esportesResponse.json();
        console.log('✅ Esportes carregados com sucesso!');
        console.log('Quantidade de esportes:', esportesData.length);
        console.log('Esportes:', esportesData.map(e => ({ id: e.id, nome: e.nome })));
      } else {
        console.log('❌ Falha ao carregar esportes');
        const errorData = await esportesResponse.text();
        console.log('Erro:', errorData);
      }
      
      // 3. Testar outros endpoints protegidos
      console.log('\n3️⃣ Testando outros endpoints protegidos...');
      
      const protectedEndpoints = [
        { name: 'Minhas Inscrições', url: '/api/inscricoes/minhas' },
        { name: 'Carrinho', url: '/api/cart' },
        { name: 'Meus Pedidos', url: '/api/pedidos/usuario' }
      ];
      
      for (const endpoint of protectedEndpoints) {
        try {
          const response = await fetch(`${baseURL}${endpoint.url}`, { headers });
          console.log(`${endpoint.name}: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`  ✅ ${endpoint.name} funcionando`);
          } else {
            const errorData = await response.text();
            console.log(`  ❌ ${endpoint.name} falhou:`, errorData);
          }
        } catch (error) {
          console.log(`  ❌ Erro em ${endpoint.name}:`, error.message);
        }
      }
      
    } else {
      console.log('❌ Token inválido');
      const errorData = await verifyResponse.text();
      console.log('Erro de verificação:', errorData);
      
      // Vamos analisar o token
      console.log('\n🔍 Analisando estrutura do token...');
      try {
        // Tentar decodificar JWT (apenas a parte do payload, sem verificar assinatura)
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          console.log('✅ Token tem estrutura JWT válida (3 partes)');
          
          // Decodificar header
          const header = JSON.parse(atob(tokenParts[0]));
          console.log('Header:', header);
          
          // Decodificar payload
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Payload:', {
            iss: payload.iss,
            aud: payload.aud,
            exp: payload.exp,
            iat: payload.iat,
            sub: payload.sub,
            email: payload.email
          });
          
          // Verificar expiração
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < now) {
            console.log('❌ Token expirado!');
            console.log(`Expirou em: ${new Date(payload.exp * 1000)}`);
            console.log(`Agora: ${new Date(now * 1000)}`);
          } else {
            console.log('✅ Token não expirado');
          }
          
        } else {
          console.log('❌ Token não tem estrutura JWT válida');
        }
      } catch (decodeError) {
        console.log('❌ Erro ao decodificar token:', decodeError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral no debug:', error);
  }
}

// Função para obter token do browser (para executar no console)
function getTokenFromBrowser() {
  console.log('🔍 Procurando token no navegador...');
  
  // Verificar localStorage
  const localToken = localStorage.getItem('authToken') || 
                     localStorage.getItem('token') ||
                     localStorage.getItem('firebase-token') ||
                     localStorage.getItem('jwt');
  
  if (localToken) {
    console.log('✅ Token encontrado no localStorage');
    return localToken;
  }
  
  // Verificar sessionStorage
  const sessionToken = sessionStorage.getItem('authToken') || 
                       sessionStorage.getItem('token') ||
                       sessionStorage.getItem('firebase-token') ||
                       sessionStorage.getItem('jwt');
  
  if (sessionToken) {
    console.log('✅ Token encontrado no sessionStorage');
    return sessionToken;
  }
  
  console.log('❌ Token não encontrado no browser storage');
  return null;
}

// Função completa para executar no console do navegador
async function debugTokenInBrowser() {
  const token = getTokenFromBrowser();
  if (token) {
    await debugUserTokenWithToken(token);
  } else {
    console.log('❌ Não foi possível encontrar o token');
    console.log('💡 Verifique se você está logado e tente:');
    console.log('- localStorage.getItem("authToken")');
    console.log('- sessionStorage.getItem("authToken")');
    console.log('- Ou forneça o token manualmente');
  }
}

// Executar debug inicial
debugUserToken();

// Exportar funções para uso no console
if (typeof window !== 'undefined') {
  window.debugUserTokenWithToken = debugUserTokenWithToken;
  window.debugTokenInBrowser = debugTokenInBrowser;
  window.getTokenFromBrowser = getTokenFromBrowser;
}
