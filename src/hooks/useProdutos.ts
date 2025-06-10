// Hook para gerenciar produtos

import { useState, useEffect, useCallback } from 'react';
import { produtosService, type Produto, type CreateProdutoData, type UpdateProdutoData, type ProdutosResponse } from '../services/api';
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
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar categorias
  const carregarCategorias = useCallback(async () => {
    try {
      const data = await produtosService.listarCategorias();
      setCategorias(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
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
      console.error('Erro ao buscar produto:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar produto');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Criar produto (admin)
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
  };

  // Carregar dados iniciais
  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
  }, [carregarProdutos, carregarCategorias]);

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
