// Teste rápido do Firebase Service
async function testFirebaseService() {
  console.log('🔍 Testando Firebase Service...');
  
  try {
    // Importar o Firebase Service
    const { firebaseService } = await import('./src/services/firebase/firebaseService');
    
    console.log('📦 Firebase Service importado');
    
    // Inicializar
    await firebaseService.initialize();
    console.log('🔥 Firebase inicializado');
    
    // Verificar se há usuário logado
    const isSignedIn = firebaseService.isSignedIn();
    console.log('👤 Usuário logado:', isSignedIn);
    
    // Tentar obter token
    const token = await firebaseService.getCurrentToken();
    console.log('🔑 Token obtido:', token ? 'SIM' : 'NÃO');
    
    if (!token && !isSignedIn) {
      console.log('ℹ️ Nenhum usuário logado - isso é normal se não fez login ainda');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar teste se estiver no navegador
if (typeof window !== 'undefined') {
  testFirebaseService();
}
