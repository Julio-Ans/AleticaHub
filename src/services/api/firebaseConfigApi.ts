// Firebase Config API Service - Busca configurações do Firebase do backend

import AtleticaHubAPI from './baseApi';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

class FirebaseConfigService extends AtleticaHubAPI {
  // Buscar configuração do Firebase do backend
  async getFirebaseConfig(): Promise<FirebaseConfig> {
    return this.request('/config/firebase', { auth: false });
  }
}

export const firebaseConfigService = new FirebaseConfigService();
