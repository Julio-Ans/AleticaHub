// Test script para verificar a API de esportes
const fetch = require('node-fetch');

const API_BASE_URL = 'https://atleticahubapi.onrender.com';

async function testEsportesAPI() {
  console.log('🧪 Testando API de Esportes...');
  
  try {
    // Teste 1: Listar esportes sem autenticação
    console.log('📡 Testando GET /api/esportes (público)...');
    const response = await fetch(`${API_BASE_URL}/api/esportes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Esportes carregados com sucesso:');
      console.log(`📈 Quantidade: ${data.length || 'N/A'}`);
      console.log('📝 Primeiros esportes:', JSON.stringify(data.slice(0, 2), null, 2));
    } else {
      const errorData = await response.text();
      console.log('❌ Erro na resposta:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

// Executar teste
testEsportesAPI();
