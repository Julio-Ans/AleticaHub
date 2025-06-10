// Script para limpar tokens inválidos e testar API de esportes
console.log('🧹 Limpando tokens do localStorage...');

// Remover todos os tokens
localStorage.removeItem('authToken');
localStorage.removeItem('athletica_token');

console.log('✅ Tokens removidos');
console.log('📦 localStorage atual:', Object.keys(localStorage));

// Testar API de esportes sem autenticação
async function testarEsportes() {
  console.log('\n🔍 Testando API de esportes...');
  
  try {
    const response = await fetch('https://atleticahubapi.onrender.com/api/esportes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // SEM Authorization header
      }
    });
    
    console.log('📡 Status:', response.status);
    const data = await response.json();
    console.log('📄 Resposta:', data);
    
    if (response.ok) {
      console.log('✅ API de esportes funciona sem autenticação!');
      return true;
    } else {
      console.log('❌ API de esportes requer autenticação');
      return false;
    }
  } catch (error) {
    console.error('🚨 Erro ao testar:', error);
    return false;
  }
}

// Executar teste
testarEsportes().then(sucesso => {
  if (sucesso) {
    console.log('\n🎯 RECOMENDAÇÃO: Recarregue a página para aplicar as mudanças');
  } else {
    console.log('\n⚠️ A API realmente requer autenticação - necessário revisar backend');
  }
});
