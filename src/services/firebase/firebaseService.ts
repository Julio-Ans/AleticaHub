// Firebase Service - Gerenciamento do Firebase Authentication

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export class FirebaseService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private isInitialized = false;

  // Configuração temporária do Firebase (fallback)
  private defaultConfig: FirebaseConfig = {
    apiKey: "AIzaSyDnxRlMqd3-2Grip-HTp2LZmmOBUTSvFX8",
    authDomain: "atleticahub-7b449.firebaseapp.com",
    projectId: "atleticahub-7b449",
    storageBucket: "atleticahub-7b449.appspot.com", 
    messagingSenderId: "153299263604",
    appId: "1:153299263604:web:23db28f46bdbde4fe57121",
    measurementId: "G-924HQCPT8M"
  };

  // Buscar configuração do Firebase do backend
  async getFirebaseConfig(): Promise<FirebaseConfig> {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
      const response = await fetch(`${baseURL}/config/firebase`);
      if (!response.ok) {
        console.warn('Usando configuração local do Firebase como fallback');
        return this.defaultConfig;
      }
      return response.json();
    } catch (error) {
      console.warn('Erro ao buscar configuração do Firebase, usando configuração local:', error);
      return this.defaultConfig;
    }
  }

  // Inicializar Firebase
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const config = await this.getFirebaseConfig();
      this.app = initializeApp(config);
      this.auth = getAuth(this.app);
      this.isInitialized = true;
    } catch (error) {
      console.error('Erro ao inicializar Firebase:', error);
      throw error;
    }
  }

  // Fazer login no Firebase
  async signIn(email: string, password: string): Promise<string> {
    if (!this.auth) {
      await this.initialize();
    }

    if (!this.auth) {
      throw new Error('Firebase não inicializado');
    }    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      return idToken;
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      throw new Error(this.getFirebaseErrorMessage(firebaseError.code || 'unknown'));
    }
  }

  // Registrar usuário no Firebase
  async signUp(email: string, password: string): Promise<string> {
    if (!this.auth) {
      await this.initialize();
    }

    if (!this.auth) {
      throw new Error('Firebase não inicializado');
    }    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      return idToken;
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      throw new Error(this.getFirebaseErrorMessage(firebaseError.code || 'unknown'));
    }
  }

  // Fazer logout
  async signOut(): Promise<void> {
    if (!this.auth) return;

    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
  // Obter token do usuário atual
  async getCurrentToken(): Promise<string | null> {
    console.log('🔍 getCurrentToken: Verificando estado da autenticação...');
    
    if (!this.isInitialized) {
      console.log('⚠️ Firebase não inicializado, inicializando agora...');
      await this.initialize();
    }
    
    if (!this.auth) {
      console.log('❌ Auth object não disponível');
      return null;
    }
    
    if (!this.auth.currentUser) {
      console.log('❌ Nenhum usuário logado no Firebase');
      return null;
    }

    try {
      console.log('🔑 Obtendo token para usuário:', this.auth.currentUser.email);
      const token = await this.auth.currentUser.getIdToken();
      console.log('✅ Token obtido com sucesso');
      return token;
    } catch (error) {
      console.error('❌ Erro ao obter token:', error);
      return null;
    }
  }

  // Verificar se usuário está logado
  isSignedIn(): boolean {
    return !!this.auth?.currentUser;
  }

  // Converter códigos de erro do Firebase para mensagens em português
  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-disabled':
        return 'Conta desabilitada';
      case 'auth/email-already-in-use':
        return 'Email já está em uso';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      case 'auth/network-request-failed':
        return 'Erro de conexão';
      case 'auth/invalid-credential':
        return 'Credenciais inválidas';
      default:
        return 'Erro de autenticação';
    }
  }
}

export const firebaseService = new FirebaseService();
export default firebaseService;
