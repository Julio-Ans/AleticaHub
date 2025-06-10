// Script para verificar o estado de autenticação no localStorage
console.log('🔍 Verificando estado de autenticação...');

// Verificar se há token no localStorage
const token = localStorage.getItem('athletica_token');
console.log('Token no localStorage:', token ? 'Presente' : 'Ausente');

if (token) {
  console.log('Token (primeiros 50 caracteres):', token.substring(0, 50) + '...');
  
  // Verificar se o token é válido testando a API
  fetch('https://atleticahubapi.onrender.com/auth/verify', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Status de verificação do token:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Resposta da verificação:', data);
  })
  .catch(error => {
    console.error('Erro ao verificar token:', error);
  });
  
  // Testar API de esportes
  fetch('https://atleticahubapi.onrender.com/api/esportes', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Status da API de esportes:', response.status);
    if (response.ok) {
      return response.json();
    } else {
      return response.text();
    }
  })
  .then(data => {
    console.log('Resposta da API de esportes:', data);
  })
  .catch(error => {
    console.error('Erro ao buscar esportes:', error);
  });
} else {
  console.log('❌ Nenhum token encontrado. Usuário não está logado.');
}

// Verificar outros dados no localStorage
console.log('\n📋 Todos os itens no localStorage:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}:`, value?.substring(0, 100) + (value && value.length > 100 ? '...' : ''));
}
