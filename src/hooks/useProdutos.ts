// Hook para gerenciar produtos

import { useState, useEffect, useCallback } from 'react';
import { produtosService, type Produto, type CreateProdutoData, type UpdateProdutoData } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginacao, setPaginacao] = useState({
    total: 0,
    pagina: 1,
    totalPaginas: 0
  });
  const { user } = useAuth();

  // Carregar produtos com paginação e filtros
  const carregarProdutos = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoria?: string;
  }) => {    try {
      setIsLoading(true);
      setError(null);
      console.log('Carregando produtos...', params);
      
      const response = await produtosService.listarProdutos(params);
      
      // Handle both response formats
      if (Array.isArray(response)) {
        // Simple array response
        setProdutos(response);
        setPaginacao({
          total: response.length,
          pagina: 1,
          totalPaginas: 1
        });
        
        return {
          produtos: response,
          total: response.length,
          pagina: 1,
          totalPaginas: 1
        };
      } else {
        // Paginated response
        setProdutos(response.produtos);
        setPaginacao({
          total: response.total,
          pagina: response.pagina,
          totalPaginas: response.totalPaginas
        });
        
        return response;
      }    } catch (err) {
      // Silenciar erros comuns de carregamento de produtos
      if (err instanceof Error && !err.message.includes('Erro ao buscar produto')) {
        console.error('Erro ao carregar produtos:', err);
      }
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  }, []);  // Carregar categorias
  const carregarCategorias = useCallback(async () => {
    try {
      const data = await produtosService.listarCategorias();
      setCategorias(data);
    } catch {
      // Silenciar completamente erros de categorias e usar categorias padrão
      setCategorias(['Equipamentos', 'Roupas', 'Acessórios', 'Suplementos']);
    }
  }, []);
  // Buscar produto por ID
  const buscarProduto = async (id: string): Promise<Produto | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const produto = await produtosService.buscarProduto(id);
      return produto;
    } catch (err) {
      // Silenciar erros de produto não encontrado
      if (err instanceof Error && !err.message.includes('não encontrado')) {
        console.error('Erro ao buscar produto:', err);
        setError(err.message);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };  // Criar produto (admin)
  const criarProduto = async (data: CreateProdutoData) => {
    if (user?.role !== 'admin') {
      throw new Error('Apenas administradores podem criar produtos');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await produtosService.criarProduto(data);
      
      // Recarregar a lista
      await carregarProdutos();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto';
      console.error('Erro ao criar produto:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar produto (admin)
  const atualizarProduto = async (id: string, data: UpdateProdutoData) => {
    if (user?.role !== 'admin') {
      throw new Error('Apenas administradores podem atualizar produtos');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await produtosService.atualizarProduto(id, data);
      
      // Atualizar na lista local
      setProdutos(prev => prev.map(produto => 
        produto.id === id ? response : produto
      ));
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir produto (admin)
  const excluirProduto = async (id: string) => {
    if (user?.role !== 'admin') {
      throw new Error('Apenas administradores podem excluir produtos');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await produtosService.excluirProduto(id);
      
      // Remover da lista local
      setProdutos(prev => prev.filter(produto => produto.id !== id));
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir produto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar produtos
  const buscarProdutos = async (termo: string) => {
    return carregarProdutos({ search: termo, page: 1 });
  };

  // Filtrar por categoria
  const filtrarPorCategoria = async (categoria: string) => {
    return carregarProdutos({ categoria, page: 1 });
  };

  // Navegar páginas
  const irParaPagina = async (pagina: number) => {
    return carregarProdutos({ page: pagina });
  };

  // Verificar se produto está em estoque
  const verificarEstoque = (produto: Produto, quantidade: number = 1): boolean => {
    return produto.estoque >= quantidade;
  };  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      // Carregar produtos e categorias de forma independente
      Promise.allSettled([
        carregarProdutos(),
        carregarCategorias()
      ]).then(results => {
        // Verificar se houve algum erro crítico apenas nos produtos
        const produtosResult = results[0];
        if (produtosResult.status === 'rejected') {
          // Só logar se for um erro inesperado
          const error = produtosResult.reason;
          if (error instanceof Error && 
              !error.message.includes('Erro ao buscar produto') &&
              !error.message.includes('404') &&
              !error.message.includes('não encontrado')) {
            console.error('Erro crítico ao carregar produtos:', error);
          }
        }
      });
    };

    loadInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Carregar apenas uma vez no mount

  return {
    produtos,
    categorias,
    isLoading,
    error,
    paginacao,
    carregarProdutos,
    carregarCategorias,
    buscarProduto,
    criarProduto,
    atualizarProduto,
    excluirProduto,
    buscarProdutos,
    filtrarPorCategoria,
    irParaPagina,
    verificarEstoque,
    isAdmin: user?.role === 'admin'
  };
};
