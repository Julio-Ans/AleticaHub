// API Services - Centralized exports

// Services
export { firebaseConfigService } from './firebaseConfigApi';
export { authApi as authService } from './authApi';
export { esportesService } from './esportesApi';
export { eventosService } from './eventosApi';
export { inscricoesService } from './inscricoesApi';
export { mensagensService } from './mensagensApi';
export { produtosService } from './produtosApi';
export { carrinhoService } from './carrinhoApi';
export { pedidosService } from './pedidosApi';

// Types - Firebase Config
export type { FirebaseConfig } from './firebaseConfigApi';

// Types - Auth
export type { 
  User,
  AuthResponse,
  RegisterData
} from './authApi';

// Types - Esportes
export type { 
  Esporte, 
  CreateEsporteData,
  UpdateEsporteData,
  CreateEsporteResponse
} from './esportesApi';

// Types - Eventos
export type { 
  Evento, 
  CreateEventoData, 
  UpdateEventoData 
} from './eventosApi';

// Types - Inscrições
export type { 
  Inscricao,
  CreateInscricaoResponse,
  UpdateStatusResponse as InscricaoUpdateStatusResponse
} from './inscricoesApi';

// Types - Mensagens
export type { 
  Mensagem,
  CreateMensagemData
} from './mensagensApi';

// Types - Produtos
export type { 
  Produto,
  CreateProdutoData,
  UpdateProdutoData,
  ProdutosResponse
} from './produtosApi';

// Types - Carrinho
export type { 
  ItemCarrinho,
  AddToCartData,
  UpdateCartData,
  FinalizarPedidoResponse
} from './carrinhoApi';

// Types - Pedidos
export type { 
  Pedido,
  UpdateStatusData,
  UpdateStatusResponse as PedidoUpdateStatusResponse
} from './pedidosApi';
