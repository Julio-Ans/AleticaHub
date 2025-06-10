// Teste direto da API de esportes para debug
console.log('🔍 Testando API de Esportes...');

// URL da API
const API_BASE = 'https://atleticahubapi.onrender.com';

// Testar sem autenticação
async function testarSemAuth() {
  console.log('\n=== TESTE SEM AUTENTICAÇÃO ===');
  try {
    const response = await fetch(`${API_BASE}/api/esportes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Status:', response.status);
    console.log('📝 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('📄 Response:', data);
    
    if (response.ok) {
      console.log('✅ Sucesso sem autenticação!');
      return data;
    } else {
      console.log('❌ Erro sem autenticação:', data);
      return null;
    }
  } catch (error) {
    console.error('🚨 Erro na requisição sem auth:', error);
    return null;
  }
}

// Testar com token fake
async function testarComTokenFake() {
  console.log('\n=== TESTE COM TOKEN FAKE ===');
  try {
    const response = await fetch(`${API_BASE}/api/esportes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token-fake-para-teste'
      }
    });
    
    console.log('📡 Status:', response.status);
    console.log('📝 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('📄 Response:', data);
    
    if (response.ok) {
      console.log('✅ Sucesso com token fake!');
      return data;
    } else {
      console.log('❌ Erro com token fake:', data);
      return null;
    }
  } catch (error) {
    console.error('🚨 Erro na requisição com token fake:', error);
    return null;
  }
}

// Executar testes
async function executarTestes() {
  const resultadoSemAuth = await testarSemAuth();
  const resultadoComTokenFake = await testarComTokenFake();
  
  console.log('\n=== RESUMO DOS TESTES ===');
  console.log('Sem Auth:', resultadoSemAuth ? '✅ OK' : '❌ FALHOU');
  console.log('Com Token Fake:', resultadoComTokenFake ? '✅ OK' : '❌ FALHOU');
  
  // Verificar qual método funciona
  if (resultadoSemAuth) {
    console.log('\n🎯 SOLUÇÃO: A API aceita requisições sem autenticação');
    console.log('📝 Ação: Configurar esportesApi.ts para usar { auth: false }');
  } else if (resultadoComTokenFake) {
    console.log('\n🎯 SOLUÇÃO: A API aceita qualquer token');
    console.log('📝 Ação: Problema pode estar na validação do token no frontend');
  } else {
    console.log('\n🚨 PROBLEMA: A API está rejeitando ambas as tentativas');
    console.log('📝 Ação: Verificar se a API está funcionando ou se há problemas de CORS');
  }
}

// Executar quando a página carregar
if (typeof window !== 'undefined') {
  executarTestes();
} else {
  // Para Node.js
  executarTestes();
}
