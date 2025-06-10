// Firebase Configuration - Configuração dinâmica do Firebase
// DEPRECATED: Use firebaseService.ts instead

import { initializeApp } from 'firebase/app';

// Esta configuração será obtida dinamicamente do backend
// Este arquivo é mantido para compatibilidade, mas o novo sistema
// usa firebaseService.ts que busca a configuração do backend

const firebaseConfig = {
  apiKey: "AIzaSyDnxRlMqd3-2Grip-HTp2LZmmOBUTSvFX8",
  authDomain: "atleticahub-7b449.firebaseapp.com",
  projectId: "atleticahub-7b449",
  storageBucket: "atleticahub-7b449.appspot.com", 
  messagingSenderId: "153299263604",
  appId: "1:153299263604:web:23db28f46bdbde4fe57121",
  measurementId: "G-924HQCPT8M"
};

export const app = initializeApp(firebaseConfig);
