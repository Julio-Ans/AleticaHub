// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\hooks\useAuthForm.ts
// Auth Form Hook - Hook para gerenciar formulários de autenticação

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefone: string;
  dataNascimento: string;
  curso: string;
  codigo?: string; // Adicionado campo opcional
}

interface FormErrors {
  [key: string]: string;
}

export const useAuthForm = () => {
  const { login, register } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Validation functions
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email é obrigatório';
    if (!emailRegex.test(email)) return 'Email inválido';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Senha é obrigatória';
    if (password.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phone) return 'Telefone é obrigatório';
    if (!phoneRegex.test(phone)) return 'Formato: (11) 99999-9999';
    return null;
  };

  const validateRequired = (value: string, fieldName: string): string | null => {
    if (!value.trim()) return `${fieldName} é obrigatório`;
    return null;
  };

  const validateLoginForm = (data: LoginForm): FormErrors => {
    const formErrors: FormErrors = {};

    const emailError = validateEmail(data.email);
    if (emailError) formErrors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) formErrors.password = passwordError;

    return formErrors;
  };

  const validateRegisterForm = (data: RegisterForm): FormErrors => {
    const formErrors: FormErrors = {};

    const nomeError = validateRequired(data.nome, 'Nome');
    if (nomeError) formErrors.nome = nomeError;

    const emailError = validateEmail(data.email);
    if (emailError) formErrors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) formErrors.password = passwordError;

    if (data.password !== data.confirmPassword) {
      formErrors.confirmPassword = 'Senhas não conferem';
    }

    const phoneError = validatePhone(data.telefone);
    if (phoneError) formErrors.telefone = phoneError;

    const dateError = validateRequired(data.dataNascimento, 'Data de nascimento');
    if (dateError) formErrors.dataNascimento = dateError;

    const cursoError = validateRequired(data.curso, 'Curso');
    if (cursoError) formErrors.curso = cursoError;

    return formErrors;
  };  const handleLogin = async (formData: LoginForm) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form
      const formErrors = validateLoginForm(formData);
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return false;
      }

      // Attempt login
      const result = await login(formData.email, formData.password);
      
      // Redireciona conforme o papel do usuário
      if (result?.user?.role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/home');
      }
      return true;
    } catch (error) {
      setErrors({ 
        general: error instanceof Error ? error.message : 'Erro ao fazer login' 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegister = async (formData: RegisterForm) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form
      const formErrors = validateRegisterForm(formData);
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return false;
      }

      // Prepare data for API
      const registrationData = {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        telefone: formData.telefone,
        dataNascimento: formData.dataNascimento,
        curso: formData.curso,
        codigo: formData.codigo || '', // Envia vazio se não preenchido
      };

      // Attempt registration
      await register(registrationData);
      
      // Redirect on success
      router.push('/home');
      return true;
    } catch (error) {
      setErrors({ 
        general: error instanceof Error ? error.message : 'Erro ao registrar usuário' 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };

  return {
    handleLogin,
    handleRegister,
    isLoading,
    errors,
    clearErrors,
    formatPhoneNumber,
    validateEmail,
    validatePassword,
    validatePhone,
    validateRequired,
  };
};

export default useAuthForm;
