console.log('🧹 Limpando tokens antigos...');

// Limpar localStorage
localStorage.removeItem('authToken');
localStorage.removeItem('athletica_token');

console.log('✅ Tokens removidos do localStorage');

// Verificar Firebase
console.log('🔥 Verificando status do Firebase...');

// Esta função será executada no console do navegador
async function checkFirebase() {
  try {
    const { FirebaseService } = await import('./src/services/firebase/firebaseService.js');
    const firebaseService = new FirebaseService();
    
    console.log('Firebase logado?', firebaseService.isSignedIn());
    
    if (firebaseService.isSignedIn()) {
      const token = await firebaseService.getCurrentToken();
      console.log('Firebase token:', token ? token.substring(0, 100) + '...' : 'null');
    }
  } catch (error) {
    console.error('Erro ao verificar Firebase:', error);
  }
}

checkFirebase();
