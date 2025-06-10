# AtleticaHub API Testing Suite

Este diretório contém um conjunto completo de ferramentas para testar a API do AtleticaHub. As funções de teste foram desenvolvidas para verificar todos os endpoints da API, validar funcionalidades e garantir que o sistema funcione corretamente.

## 📁 Arquivos

- **`testApi.ts`** - Conjunto principal de funções de teste da API
- **`apiTestExample.ts`** - Exemplos de como usar as funções de teste
- **`README.md`** - Este arquivo de documentação

## 🚀 Como Usar

### 1. Testes Básicos (Sem Autenticação)

```typescript
import { testApiConnectivity, demoApiTesting } from './testApi';

// Teste de conectividade básica
await testApiConnectivity();

// Demo completa da API
await demoApiTesting();
```

### 2. Testes com Autenticação de Usuário

```typescript
import { testAuthenticatedEndpoints } from './testApi';

const userToken = 'seu-jwt-token-aqui';
await testAuthenticatedEndpoints(userToken);
```

### 3. Testes com Autenticação de Admin

```typescript
import { testAdminEndpoints, testAdminOperations } from './testApi';

const adminToken = 'seu-admin-jwt-token-aqui';
await testAdminEndpoints(adminToken);
await testAdminOperations(adminToken);
```

### 4. Suite Completa de Testes

```typescript
import { runComprehensiveTests } from './testApi';

const userToken = 'seu-user-token';
const adminToken = 'seu-admin-token';

await runComprehensiveTests(userToken, adminToken);
```

### 5. Usando o Test Runner

```typescript
import { createTestRunner } from './testApi';

const testRunner = createTestRunner(userToken, adminToken);

// Testes básicos
await testRunner.runBasicTests();

// Testes de usuário
await testRunner.runUserTests();

// Testes de admin
await testRunner.runAdminTests();

// Suite completa
await testRunner.runFullSuite();
```

### 6. Testes de Workflows Específicos

```typescript
import { apiTestSuite } from './testApi';

// Teste de workflow de inscrição
await apiTestSuite.workflows.inscription('id-do-esporte');

// Teste de workflow de compras
await apiTestSuite.workflows.shopping(1, 2); // produto ID 1, quantidade 2

// Teste de workflow de eventos
await apiTestSuite.workflows.eventInscription('id-do-evento');

// Teste de mensagens
await apiTestSuite.workflows.messaging('0', 'Mensagem de teste');
```

### 7. Testes de Debug Rápido

```typescript
import { quickDebugTest } from './testApi';

// Teste endpoint específico sem auth
await quickDebugTest('/api/produtos');

// Teste endpoint específico com auth
await quickDebugTest('/api/inscricoes/minhas', userToken);
```

## 🧪 Tipos de Teste Disponíveis

### 📡 Testes de Conectividade
- ✅ Verificação de saúde da API (`/health`)
- ✅ Configuração do Firebase (`/config/firebase`)
- ✅ Endpoints públicos (produtos, eventos)

### 🔐 Testes de Autenticação
- ✅ Verificação de token JWT (`/auth/verify`)
- ✅ Verificação de usuário (`/auth/verify-user`)
- ✅ Verificação de admin (`/auth/verify-admin`)
- ✅ Fluxo de registro/login

### 🏃‍♀️ Testes de Esportes
- ✅ Listar todos os esportes
- ✅ Buscar esporte por ID
- ✅ Criar esporte (admin)
- ✅ Atualizar esporte (admin)
- ✅ Excluir esporte (admin)

### 📝 Testes de Inscrições
- ✅ Inscrever-se em esporte
- ✅ Listar minhas inscrições
- ✅ Listar todas as inscrições (admin)
- ✅ Gerenciar status de inscrição (admin)

### 📅 Testes de Eventos
- ✅ Listar todos os eventos
- ✅ Listar eventos permitidos
- ✅ Buscar evento por ID
- ✅ Criar evento (admin)
- ✅ Inscrever-se em evento
- ✅ Cancelar inscrição em evento

### 💬 Testes de Mensagens
- ✅ Listar mensagens por esporte
- ✅ Enviar mensagem
- ✅ Excluir mensagem

### 🛍️ Testes de E-commerce
- ✅ Listar produtos
- ✅ Buscar produto por ID
- ✅ Criar produto (admin)
- ✅ Atualizar produto (admin)
- ✅ Excluir produto (admin)

### 🛒 Testes de Carrinho
- ✅ Listar itens do carrinho
- ✅ Adicionar item ao carrinho
- ✅ Atualizar quantidade
- ✅ Remover item
- ✅ Finalizar pedido
- ✅ Limpar carrinho

### 📋 Testes de Pedidos
- ✅ Listar meus pedidos
- ✅ Listar todos os pedidos (admin)
- ✅ Buscar pedido por ID
- ✅ Atualizar status (admin)
- ✅ Estatísticas (admin)

### ⚡ Testes Avançados
- ✅ Performance e tempo de resposta
- ✅ Paginação e filtros
- ✅ Validação de dados
- ✅ Operações concorrentes
- ✅ Casos extremos
- ✅ Compliance com documentação

### 🚨 Testes de Erro
- ✅ Endpoints inexistentes (404)
- ✅ Acesso não autorizado (401)
- ✅ Token inválido
- ✅ Dados inválidos
- ✅ Conflitos de dados

## 📊 Exemplos de Uso Prático

### Para Desenvolvimento

```typescript
import { quickDebugTest, testApiConnectivity } from './testApi';

// Durante desenvolvimento, teste rapidamente
await testApiConnectivity();
await quickDebugTest('/api/esportes', userToken);
```

### Para QA/Testing

```typescript
import { runComprehensiveTests } from './testApi';

// Execute suite completa de testes
await runComprehensiveTests(userToken, adminToken);
```

### Para CI/CD

```typescript
import { apiTestExamples } from './apiTestExample';

// Testes automatizados para pipeline
const results = await apiTestExamples.automated({
  userToken: process.env.TEST_USER_TOKEN,
  adminToken: process.env.TEST_ADMIN_TOKEN,
  skipPerformanceTests: false,
  skipAdminTests: false
});

// Verificar se todos os testes passaram
const allPassed = Object.values(results).every(Boolean);
process.exit(allPassed ? 0 : 1);
```

### Para Demonstração

```typescript
import { demoApiTesting } from './testApi';

// Demo completa para apresentações
await demoApiTesting();
```

## 🔧 Configuração

### Variáveis de Ambiente

Certifique-se de que a variável `NEXT_PUBLIC_API_BASE_URL` esteja configurada:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://atleticahubapi.onrender.com
```

### Tokens de Autenticação

Para executar testes autenticados, você precisa de tokens JWT válidos:

1. **Token de Usuário**: Obtido através do login normal na aplicação
2. **Token de Admin**: Obtido através do login com conta de administrador

### Como Obter Tokens

1. Faça login na aplicação web
2. Abra as ferramentas de desenvolvedor (F12)
3. Vá para Application > Local Storage
4. Copie o valor do token salvo

## 📈 Relatórios de Teste

As funções de teste geram relatórios detalhados no console, incluindo:

- ✅ Status de resposta HTTP
- 📊 Dados retornados
- ⏱️ Tempo de resposta
- 📝 Detalhes de erro (quando aplicável)
- 📋 Resumo de testes executados

## 🛡️ Considerações de Segurança

- ⚠️ **Nunca commitar tokens reais** no código
- 🔒 Use tokens de teste em ambiente de desenvolvimento
- 🚫 Não execute testes destrutivos em produção
- 🧪 Use dados de teste apropriados

## 🤝 Contribuindo

Para adicionar novos testes:

1. Adicione a função de teste em `testApi.ts`
2. Crie exemplos de uso em `apiTestExample.ts`
3. Documente o novo teste neste README
4. Teste thoroughly antes de submeter

## 📞 Suporte

Se você encontrar problemas ou precisar de ajuda:

- 📧 Contate a equipe de desenvolvimento
- 📝 Abra uma issue no repositório
- 📚 Consulte a documentação da API

---

**Desenvolvido para AtleticaHub** 🏃‍♀️⚽🏀
