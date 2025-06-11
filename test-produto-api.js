// Teste simples da API de produtos
const https = require('https');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testProdutoAPI() {
  console.log('🔄 Testando API de produtos...');
  
  try {    const baseURL = 'https://atleticahubapi.onrender.com';
    console.log('\n1. Testando GET /api/produtos');
    
    const result = await makeRequest(`${baseURL}/api/produtos`);
    console.log('📡 Status:', result.status);
    
    if (result.status === 200) {
      const produtos = result.data;
      console.log('✅ Produtos carregados:', Array.isArray(produtos) ? produtos.length : 'Não é array');
      
      if (Array.isArray(produtos) && produtos.length > 0) {
        const primeiroP = produtos[0];
        console.log('🔍 Estrutura do produto:', Object.keys(primeiroP));
        console.log('📝 Dados essenciais:');
        console.log('  - id:', primeiroP.id, typeof primeiroP.id);
        console.log('  - nome:', primeiroP.nome);
        console.log('  - preco:', primeiroP.preco);
        console.log('  - estoque:', primeiroP.estoque);
        console.log('  - imagemUrl:', primeiroP.imagemUrl ? 'SIM' : 'NÃO');
      } else {
        console.log('📋 Nenhum produto encontrado ou formato inesperado');
        console.log('📋 Resposta:', JSON.stringify(produtos, null, 2));
      }
    } else {
      console.log('❌ Erro na resposta:', result.status);
      console.log('📄 Conteúdo:', result.data);
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

// Executar teste
testProdutoAPI();
