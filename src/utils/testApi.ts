// Test API connectivity and endpoints
export async function testApiConnectivity() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing API connectivity...');
  console.log('Base URL:', baseURL);
  
  try {
    // Test simple endpoint
    const response = await fetch(`${baseURL}/health`);
    console.log('Health check status:', response.status);
    
    if (response.ok) {
      const data = await response.text();
      console.log('Health check response:', data);
    } else {
      console.log('Health check failed');
    }
  } catch (error) {
    console.error('API connectivity test failed:', error);
  }
  
  try {
    // Test esportes endpoint without auth
    const esportesResponse = await fetch(`${baseURL}/esportes`);
    console.log('Esportes endpoint status:', esportesResponse.status);
    
    if (esportesResponse.ok) {
      const esportesData = await esportesResponse.json();
      console.log('Esportes data:', esportesData);
    } else {
      const errorData = await esportesResponse.json();
      console.log('Esportes error:', errorData);
    }
  } catch (error) {
    console.error('Esportes endpoint test failed:', error);
  }

  try {
    // Test atletas endpoint without auth
    const atletasResponse = await fetch(`${baseURL}/api/atletas`);
    console.log('Atletas endpoint status:', atletasResponse.status);
    
    if (atletasResponse.ok) {
      const atletasData = await atletasResponse.json();
      console.log('Atletas data:', atletasData);
    } else {
      const errorData = await atletasResponse.text();
      console.log('Atletas error:', errorData);
    }
  } catch (error) {
    console.error('Atletas endpoint test failed:', error);
  }

  try {
    // Test eventos endpoint (public)
    const eventosResponse = await fetch(`${baseURL}/api/eventos`);
    console.log('Eventos endpoint status:', eventosResponse.status);
    
    if (eventosResponse.ok) {
      const eventosData = await eventosResponse.json();
      console.log('Eventos data:', eventosData);
    } else {
      const errorData = await eventosResponse.text();
      console.log('Eventos error:', errorData);
    }
  } catch (error) {
    console.error('Eventos endpoint test failed:', error);
  }

  try {
    // Test produtos endpoint (public)
    const produtosResponse = await fetch(`${baseURL}/api/produtos`);
    console.log('Produtos endpoint status:', produtosResponse.status);
    
    if (produtosResponse.ok) {
      const produtosData = await produtosResponse.json();
      console.log('Produtos data:', produtosData);
    } else {
      const errorData = await produtosResponse.text();
      console.log('Produtos error:', errorData);
    }
  } catch (error) {
    console.error('Produtos endpoint test failed:', error);
  }

  try {
    // Test Firebase config endpoint
    const configResponse = await fetch(`${baseURL}/config/firebase`);
    console.log('Firebase config status:', configResponse.status);
    
    if (configResponse.ok) {
      const configData = await configResponse.json();
      console.log('Firebase config:', configData);
    } else {
      const errorData = await configResponse.text();
      console.log('Firebase config error:', errorData);
    }
  } catch (error) {
    console.error('Firebase config test failed:', error);
  }
}

// Test authenticated endpoints
export async function testAuthenticatedEndpoints(token: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing authenticated endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Test auth verification
    const verifyResponse = await fetch(`${baseURL}/auth/verify`, { headers });
    console.log('Auth verify status:', verifyResponse.status);
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('Auth verify data:', verifyData);
    } else {
      const errorData = await verifyResponse.text();
      console.log('Auth verify error:', errorData);
    }
  } catch (error) {
    console.error('Auth verify test failed:', error);
  }

  try {
    // Test esportes with auth
    const esportesResponse = await fetch(`${baseURL}/api/esportes`, { headers });
    console.log('Esportes (auth) status:', esportesResponse.status);
    
    if (esportesResponse.ok) {
      const esportesData = await esportesResponse.json();
      console.log('Esportes (auth) data:', esportesData);
    } else {
      const errorData = await esportesResponse.text();
      console.log('Esportes (auth) error:', errorData);
    }
  } catch (error) {
    console.error('Esportes (auth) test failed:', error);
  }

  try {
    // Test my inscricoes
    const inscricoesResponse = await fetch(`${baseURL}/api/inscricoes/minhas`, { headers });
    console.log('My inscricoes status:', inscricoesResponse.status);
    
    if (inscricoesResponse.ok) {
      const inscricoesData = await inscricoesResponse.json();
      console.log('My inscricoes data:', inscricoesData);
    } else {
      const errorData = await inscricoesResponse.text();
      console.log('My inscricoes error:', errorData);
    }
  } catch (error) {
    console.error('My inscricoes test failed:', error);
  }

  try {
    // Test eventos permitidos
    const eventosPermitidosResponse = await fetch(`${baseURL}/api/eventos/permitidos`, { headers });
    console.log('Eventos permitidos status:', eventosPermitidosResponse.status);
    
    if (eventosPermitidosResponse.ok) {
      const eventosData = await eventosPermitidosResponse.json();
      console.log('Eventos permitidos data:', eventosData);
    } else {
      const errorData = await eventosPermitidosResponse.text();
      console.log('Eventos permitidos error:', errorData);
    }
  } catch (error) {
    console.error('Eventos permitidos test failed:', error);
  }

  try {
    // Test carrinho
    const carrinhoResponse = await fetch(`${baseURL}/api/cart`, { headers });
    console.log('Carrinho status:', carrinhoResponse.status);
    
    if (carrinhoResponse.ok) {
      const carrinhoData = await carrinhoResponse.json();
      console.log('Carrinho data:', carrinhoData);
    } else {
      const errorData = await carrinhoResponse.text();
      console.log('Carrinho error:', errorData);
    }
  } catch (error) {
    console.error('Carrinho test failed:', error);
  }

  try {
    // Test meus pedidos
    const pedidosResponse = await fetch(`${baseURL}/api/pedidos/usuario`, { headers });
    console.log('Meus pedidos status:', pedidosResponse.status);
    
    if (pedidosResponse.ok) {
      const pedidosData = await pedidosResponse.json();
      console.log('Meus pedidos data:', pedidosData);
    } else {
      const errorData = await pedidosResponse.text();
      console.log('Meus pedidos error:', errorData);
    }
  } catch (error) {
    console.error('Meus pedidos test failed:', error);
  }
}

// Test admin endpoints
export async function testAdminEndpoints(adminToken: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing admin endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };

  try {
    // Test admin verification
    const verifyAdminResponse = await fetch(`${baseURL}/auth/verify-admin`, { headers });
    console.log('Admin verify status:', verifyAdminResponse.status);
    
    if (verifyAdminResponse.ok) {
      const verifyData = await verifyAdminResponse.json();
      console.log('Admin verify data:', verifyData);
    } else {
      const errorData = await verifyAdminResponse.text();
      console.log('Admin verify error:', errorData);
    }
  } catch (error) {
    console.error('Admin verify test failed:', error);
  }

  try {
    // Test all inscricoes (admin)
    const inscricoesResponse = await fetch(`${baseURL}/api/inscricoes`, { headers });
    console.log('All inscricoes status:', inscricoesResponse.status);
    
    if (inscricoesResponse.ok) {
      const inscricoesData = await inscricoesResponse.json();
      console.log('All inscricoes data:', inscricoesData);
    } else {
      const errorData = await inscricoesResponse.text();
      console.log('All inscricoes error:', errorData);
    }
  } catch (error) {
    console.error('All inscricoes test failed:', error);
  }

  try {
    // Test all pedidos (admin)
    const pedidosResponse = await fetch(`${baseURL}/api/pedidos`, { headers });
    console.log('All pedidos status:', pedidosResponse.status);
    
    if (pedidosResponse.ok) {
      const pedidosData = await pedidosResponse.json();
      console.log('All pedidos data:', pedidosData);
    } else {
      const errorData = await pedidosResponse.text();
      console.log('All pedidos error:', errorData);
    }
  } catch (error) {
    console.error('All pedidos test failed:', error);
  }

  try {
    // Test estatisticas (admin)
    const estatisticasResponse = await fetch(`${baseURL}/api/pedidos/admin/estatisticas`, { headers });
    console.log('Estatisticas status:', estatisticasResponse.status);
    
    if (estatisticasResponse.ok) {
      const estatisticasData = await estatisticasResponse.json();
      console.log('Estatisticas data:', estatisticasData);
    } else {
      const errorData = await estatisticasResponse.text();
      console.log('Estatisticas error:', errorData);
    }
  } catch (error) {
    console.error('Estatisticas test failed:', error);
  }
}

// Test mensagens endpoints
export async function testMensagensEndpoints(token: string, esporteId: string = "0") {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing mensagens endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Test get mensagens
    const mensagensResponse = await fetch(`${baseURL}/api/mensagens/${esporteId}`, { headers });
    console.log('Mensagens status:', mensagensResponse.status);
    
    if (mensagensResponse.ok) {
      const mensagensData = await mensagensResponse.json();
      console.log('Mensagens data:', mensagensData);
    } else {
      const errorData = await mensagensResponse.text();
      console.log('Mensagens error:', errorData);
    }
  } catch (error) {
    console.error('Mensagens test failed:', error);
  }
}

// Test specific endpoints with IDs
export async function testSpecificEndpoints(token: string, ids: {
  esporteId?: string;
  eventoId?: string;
  produtoId?: number;
  pedidoId?: number;
}) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing specific endpoints with IDs...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  if (ids.esporteId) {
    try {
      // Test specific esporte
      const esporteResponse = await fetch(`${baseURL}/api/esportes/${ids.esporteId}`, { headers });
      console.log(`Esporte ${ids.esporteId} status:`, esporteResponse.status);
      
      if (esporteResponse.ok) {
        const esporteData = await esporteResponse.json();
        console.log(`Esporte ${ids.esporteId} data:`, esporteData);
      } else {
        const errorData = await esporteResponse.text();
        console.log(`Esporte ${ids.esporteId} error:`, errorData);
      }
    } catch (error) {
      console.error(`Esporte ${ids.esporteId} test failed:`, error);
    }

    try {
      // Test eventos by esporte
      const eventosEsporteResponse = await fetch(`${baseURL}/api/eventos/esporte/${ids.esporteId}`);
      console.log(`Eventos esporte ${ids.esporteId} status:`, eventosEsporteResponse.status);
      
      if (eventosEsporteResponse.ok) {
        const eventosData = await eventosEsporteResponse.json();
        console.log(`Eventos esporte ${ids.esporteId} data:`, eventosData);
      } else {
        const errorData = await eventosEsporteResponse.text();
        console.log(`Eventos esporte ${ids.esporteId} error:`, errorData);
      }
    } catch (error) {
      console.error(`Eventos esporte ${ids.esporteId} test failed:`, error);
    }
  }

  if (ids.eventoId) {
    try {
      // Test specific evento
      const eventoResponse = await fetch(`${baseURL}/api/eventos/${ids.eventoId}`);
      console.log(`Evento ${ids.eventoId} status:`, eventoResponse.status);
      
      if (eventoResponse.ok) {
        const eventoData = await eventoResponse.json();
        console.log(`Evento ${ids.eventoId} data:`, eventoData);
      } else {
        const errorData = await eventoResponse.text();
        console.log(`Evento ${ids.eventoId} error:`, errorData);
      }
    } catch (error) {
      console.error(`Evento ${ids.eventoId} test failed:`, error);
    }
  }

  if (ids.produtoId) {
    try {
      // Test specific produto
      const produtoResponse = await fetch(`${baseURL}/api/produtos/${ids.produtoId}`);
      console.log(`Produto ${ids.produtoId} status:`, produtoResponse.status);
      
      if (produtoResponse.ok) {
        const produtoData = await produtoResponse.json();
        console.log(`Produto ${ids.produtoId} data:`, produtoData);
      } else {
        const errorData = await produtoResponse.text();
        console.log(`Produto ${ids.produtoId} error:`, errorData);
      }
    } catch (error) {
      console.error(`Produto ${ids.produtoId} test failed:`, error);
    }
  }

  if (ids.pedidoId) {
    try {
      // Test specific pedido
      const pedidoResponse = await fetch(`${baseURL}/api/pedidos/${ids.pedidoId}`, { headers });
      console.log(`Pedido ${ids.pedidoId} status:`, pedidoResponse.status);
      
      if (pedidoResponse.ok) {
        const pedidoData = await pedidoResponse.json();
        console.log(`Pedido ${ids.pedidoId} data:`, pedidoData);
      } else {
        const errorData = await pedidoResponse.text();
        console.log(`Pedido ${ids.pedidoId} error:`, errorData);
      }
    } catch (error) {
      console.error(`Pedido ${ids.pedidoId} test failed:`, error);
    }
  }
}

// Complete API test suite
export async function runCompleteApiTests(userToken?: string, adminToken?: string) {
  console.log('=== Starting Complete API Test Suite ===');
  
  // Test public endpoints
  await testApiConnectivity();
  
  if (userToken) {
    console.log('\n=== Testing User Endpoints ===');
    await testAuthenticatedEndpoints(userToken);
    await testMensagensEndpoints(userToken);
  }
  
  if (adminToken) {
    console.log('\n=== Testing Admin Endpoints ===');
    await testAdminEndpoints(adminToken);
  }
  
  console.log('\n=== API Test Suite Complete ===');
}

// Test error handling
export async function testErrorHandling() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing error handling...');

  try {
    // Test 404 endpoint
    const notFoundResponse = await fetch(`${baseURL}/api/nonexistent`);
    console.log('404 test status:', notFoundResponse.status);
  } catch (error) {
    console.log('404 test error:', error);
  }

  try {
    // Test unauthorized access
    const unauthorizedResponse = await fetch(`${baseURL}/api/esportes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Test Sport' })
    });
    console.log('Unauthorized test status:', unauthorizedResponse.status);
  } catch (error) {
    console.log('Unauthorized test error:', error);
  }

  try {
    // Test invalid token
    const invalidTokenResponse = await fetch(`${baseURL}/api/esportes`, {
      headers: { 'Authorization': 'Bearer invalid-token' }
    });
    console.log('Invalid token test status:', invalidTokenResponse.status);
  } catch (error) {
    console.log('Invalid token test error:', error);
  }
}

// Test user registration flow
export async function testUserRegistrationFlow(idToken: string, email: string, displayName: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing user registration flow...');

  try {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idToken,
        email,
        displayName
      })
    });

    console.log('User registration status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('User registration data:', data);
      return data.token;
    } else {
      const errorData = await response.text();
      console.log('User registration error:', errorData);
    }
  } catch (error) {
    console.error('User registration test failed:', error);
  }
  
  return null;
}

// Test inscription workflow
export async function testInscriptionWorkflow(token: string, esporteId: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing inscription workflow...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Step 1: Inscrever-se no esporte
    const inscricaoResponse = await fetch(`${baseURL}/api/inscricoes/${esporteId}`, {
      method: 'POST',
      headers
    });
    
    console.log('Inscription request status:', inscricaoResponse.status);
    
    if (inscricaoResponse.ok) {
      const inscricaoData = await inscricaoResponse.json();
      console.log('Inscription data:', inscricaoData);
      
      // Step 2: Verificar status da inscrição
      const minhasInscricoesResponse = await fetch(`${baseURL}/api/inscricoes/minhas`, { headers });
      
      if (minhasInscricoesResponse.ok) {
        const minhasInscricoes = await minhasInscricoesResponse.json();
        console.log('My inscriptions:', minhasInscricoes);
      }
      
      return inscricaoData.inscricao?.id;
    } else {
      const errorData = await inscricaoResponse.text();
      console.log('Inscription error:', errorData);
    }
  } catch (error) {
    console.error('Inscription workflow test failed:', error);
  }
  
  return null;
}

// Test shopping cart workflow
export async function testShoppingCartWorkflow(token: string, produtoId: number, quantidade: number = 1) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing shopping cart workflow...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Step 1: Add item to cart
    const addItemResponse = await fetch(`${baseURL}/api/cart`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        produtoId,
        quantidade
      })
    });
    
    console.log('Add to cart status:', addItemResponse.status);
    
    if (addItemResponse.ok) {
      const addItemData = await addItemResponse.json();
      console.log('Add to cart data:', addItemData);
      
      // Step 2: View cart
      const cartResponse = await fetch(`${baseURL}/api/cart`, { headers });
      
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        console.log('Cart contents:', cartData);
        
        // Step 3: Finalize purchase (optional)
        // const finalizeResponse = await fetch(`${baseURL}/api/cart/finalizar`, {
        //   method: 'POST',
        //   headers
        // });
        
        return cartData;
      }
    } else {
      const errorData = await addItemResponse.text();
      console.log('Add to cart error:', errorData);
    }
  } catch (error) {
    console.error('Shopping cart workflow test failed:', error);
  }
  
  return null;
}

// Test event inscription workflow
export async function testEventInscriptionWorkflow(token: string, eventoId: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing event inscription workflow...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Step 1: Get event details
    const eventResponse = await fetch(`${baseURL}/api/eventos/${eventoId}`, { headers });
    
    if (eventResponse.ok) {
      const eventData = await eventResponse.json();
      console.log('Event data:', eventData);
      
      // Step 2: Try to inscribe
      const inscribeResponse = await fetch(`${baseURL}/api/eventos/${eventoId}/inscrever`, {
        method: 'POST',
        headers
      });
      
      console.log('Event inscription status:', inscribeResponse.status);
      
      if (inscribeResponse.ok) {
        const inscribeData = await inscribeResponse.json();
        console.log('Event inscription data:', inscribeData);
        
        // Step 3: Check my events
        const myEventsResponse = await fetch(`${baseURL}/api/eventos/minhas/inscricoes`, { headers });
        
        if (myEventsResponse.ok) {
          const myEvents = await myEventsResponse.json();
          console.log('My events:', myEvents);
        }
        
        return true;
      } else {
        const errorData = await inscribeResponse.text();
        console.log('Event inscription error:', errorData);
      }
    }
  } catch (error) {
    console.error('Event inscription workflow test failed:', error);
  }
  
  return false;
}

// Test message sending
export async function testMessageSending(token: string, esporteId: string, texto: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing message sending...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(`${baseURL}/api/mensagens`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        texto,
        esporteId
      })
    });
    
    console.log('Message sending status:', response.status);
    
    if (response.ok) {
      const messageData = await response.json();
      console.log('Message data:', messageData);
      return messageData;
    } else {
      const errorData = await response.text();
      console.log('Message sending error:', errorData);
    }
  } catch (error) {
    console.error('Message sending test failed:', error);
  }
  
  return null;
}

// Test admin operations
export async function testAdminOperations(adminToken: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing admin operations...');
  
  const headers = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };

  try {
    // Test creating a sport
    const createSportFormData = new FormData();
    createSportFormData.append('nome', 'Teste API Sport');
    
    const createSportResponse = await fetch(`${baseURL}/api/esportes`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: createSportFormData
    });
    
    console.log('Create sport status:', createSportResponse.status);
    
    if (createSportResponse.ok) {
      const sportData = await createSportResponse.json();
      console.log('Created sport:', sportData);
      
      // Test updating sport
      const updateFormData = new FormData();
      updateFormData.append('nome', 'Teste API Sport Updated');
      
      const updateResponse = await fetch(`${baseURL}/api/esportes/${sportData.esporte.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` },
        body: updateFormData
      });
      
      console.log('Update sport status:', updateResponse.status);
      
      // Test deleting sport (cleanup)
      const deleteResponse = await fetch(`${baseURL}/api/esportes/${sportData.esporte.id}`, {
        method: 'DELETE',
        headers
      });
      
      console.log('Delete sport status:', deleteResponse.status);
    }
    
    // Test creating an event
    const createEventFormData = new FormData();
    createEventFormData.append('titulo', 'Evento Teste API');
    createEventFormData.append('descricao', 'Evento criado via API de teste');
    createEventFormData.append('tipo', 'festa');
    createEventFormData.append('data', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
    createEventFormData.append('local', 'Local de Teste');
    createEventFormData.append('esporteId', '0');
    
    const createEventResponse = await fetch(`${baseURL}/api/eventos`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: createEventFormData
    });
    
    console.log('Create event status:', createEventResponse.status);
    
    if (createEventResponse.ok) {
      const eventData = await createEventResponse.json();
      console.log('Created event:', eventData);
      
      // Cleanup - delete the event
      const deleteEventResponse = await fetch(`${baseURL}/api/eventos/${eventData._id}`, {
        method: 'DELETE',
        headers
      });
      
      console.log('Delete event status:', deleteEventResponse.status);
    }
    
  } catch (error) {
    console.error('Admin operations test failed:', error);
  }
}

// Full integration test
export async function runFullIntegrationTest(userToken?: string, adminToken?: string) {
  console.log('=== Starting Full Integration Test ===');
  
  // Test 1: Public endpoints
  console.log('\n--- Testing Public Endpoints ---');
  await testApiConnectivity();
  
  if (userToken) {
    console.log('\n--- Testing User Workflows ---');
    
    // Test user authentication
    await testAuthenticatedEndpoints(userToken);
    
    // Test inscription workflow (example sport ID)
    // await testInscriptionWorkflow(userToken, 'some-sport-id');
    
    // Test shopping workflow (example product ID)
    // await testShoppingCartWorkflow(userToken, 1, 2);
    
    // Test messaging
    await testMessageSending(userToken, '0', 'Mensagem de teste da API');
  }
  
  if (adminToken) {
    console.log('\n--- Testing Admin Workflows ---');
    
    // Test admin verification
    await testAdminEndpoints(adminToken);
    
    // Test admin operations
    await testAdminOperations(adminToken);
  }
  
  // Test error scenarios
  console.log('\n--- Testing Error Scenarios ---');
  await testErrorHandling();
  
  console.log('\n=== Full Integration Test Complete ===');
}

// Test API performance and response times
export async function testApiPerformance() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing API performance...');

  const testEndpoints = [
    { name: 'Health Check', url: `${baseURL}/health` },
    { name: 'Firebase Config', url: `${baseURL}/config/firebase` },
    { name: 'Public Products', url: `${baseURL}/api/produtos` },
    { name: 'Public Events', url: `${baseURL}/api/eventos` }
  ];

  for (const endpoint of testEndpoints) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(endpoint.url);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`${endpoint.name}: ${response.status} - ${responseTime}ms`);
      
      if (response.ok) {
        const data = await response.json();
        const dataSize = new TextEncoder().encode(JSON.stringify(data)).length;
        console.log(`  Data size: ${dataSize} bytes`);
      }
    } catch (error) {
      console.error(`${endpoint.name} failed:`, error);
    }
  }
}

// Test pagination and filtering
export async function testPaginationAndFiltering(token?: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing pagination and filtering...');
  
  const fetchOptions = token ? {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  } : {};

  try {
    // Test produtos pagination
    const produtosPaginated = await fetch(`${baseURL}/api/produtos?page=1&limit=5`, fetchOptions);
    console.log('Produtos pagination status:', produtosPaginated.status);
    
    if (produtosPaginated.ok) {
      const data = await produtosPaginated.json();
      console.log('Produtos pagination data:', {
        totalProducts: data.total,
        currentPage: data.page,
        totalPages: data.totalPages,
        productsInPage: data.produtos?.length
      });
    }

    // Test search functionality
    const searchResponse = await fetch(`${baseURL}/api/produtos?search=camiseta`, fetchOptions);
    console.log('Search produtos status:', searchResponse.status);
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log('Search results:', searchData.produtos?.map((p: { nome: string }) => p.nome));
    }

  } catch (error) {
    console.error('Pagination test failed:', error);
  }
}

// Test data validation scenarios
export async function testDataValidation(token: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing data validation...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Test invalid message data
  try {
    const invalidMessageResponse = await fetch(`${baseURL}/api/mensagens`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        texto: '', // Empty text should fail
        esporteId: '0'
      })
    });
    
    console.log('Invalid message test status:', invalidMessageResponse.status);
    
    if (!invalidMessageResponse.ok) {
      const errorData = await invalidMessageResponse.json();
      console.log('Expected validation error:', errorData);
    }
  } catch (error) {
    console.error('Invalid message test failed:', error);
  }

  // Test invalid cart data
  try {
    const invalidCartResponse = await fetch(`${baseURL}/api/cart`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        produtoId: 999999, // Non-existent product
        quantidade: -1     // Invalid quantity
      })
    });
    
    console.log('Invalid cart test status:', invalidCartResponse.status);
    
    if (!invalidCartResponse.ok) {
      const errorData = await invalidCartResponse.json();
      console.log('Expected cart validation error:', errorData);
    }
  } catch (error) {
    console.error('Invalid cart test failed:', error);
  }
}

// Test concurrent operations
export async function testConcurrentOperations(token: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing concurrent operations...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Test multiple simultaneous requests
    const concurrentPromises = [
      fetch(`${baseURL}/api/esportes`, { headers }),
      fetch(`${baseURL}/api/eventos/permitidos`, { headers }),
      fetch(`${baseURL}/api/produtos`, { headers }),
      fetch(`${baseURL}/api/cart`, { headers }),
      fetch(`${baseURL}/api/inscricoes/minhas`, { headers })
    ];

    const startTime = Date.now();
    const results = await Promise.allSettled(concurrentPromises);
    const endTime = Date.now();
    
    console.log(`Concurrent requests completed in ${endTime - startTime}ms`);
    
    results.forEach((result, index) => {
      const endpoints = ['esportes', 'eventos', 'produtos', 'cart', 'inscricoes'];
      if (result.status === 'fulfilled') {
        console.log(`${endpoints[index]}: ${result.value.status}`);
      } else {
        console.log(`${endpoints[index]}: FAILED - ${result.reason}`);
      }
    });
    
  } catch (error) {
    console.error('Concurrent operations test failed:', error);
  }
}

// Test edge cases and boundary conditions
export async function testEdgeCases(token: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing edge cases...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Test very long message
  try {
    const longMessage = 'A'.repeat(1000); // 1000 characters
    const longMessageResponse = await fetch(`${baseURL}/api/mensagens`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        texto: longMessage,
        esporteId: '0'
      })
    });
    
    console.log('Long message test status:', longMessageResponse.status);
  } catch (error) {
    console.error('Long message test failed:', error);
  }

  // Test special characters in search
  try {
    const specialCharsResponse = await fetch(`${baseURL}/api/produtos?search=${encodeURIComponent('!@#$%^&*()')}`);
    console.log('Special chars search status:', specialCharsResponse.status);
  } catch (error) {
    console.error('Special chars test failed:', error);
  }

  // Test extreme pagination values
  try {
    const extremePaginationResponse = await fetch(`${baseURL}/api/produtos?page=99999&limit=1000`);
    console.log('Extreme pagination status:', extremePaginationResponse.status);
  } catch (error) {
    console.error('Extreme pagination test failed:', error);
  }
}

// Test API documentation and schema compliance
export async function testApiDocumentationCompliance() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log('Testing API documentation compliance...');

  try {
    // Test if responses match expected schema
    const produtosResponse = await fetch(`${baseURL}/api/produtos`);
    
    if (produtosResponse.ok) {
      const data = await produtosResponse.json();
      
      // Validate produtos response structure
      const hasExpectedFields = (
        data.produtos && 
        Array.isArray(data.produtos) &&
        typeof data.total === 'number' &&
        typeof data.page === 'number' &&
        typeof data.totalPages === 'number'
      );
      
      console.log('Produtos schema compliance:', hasExpectedFields ? 'PASSED' : 'FAILED');
      
      if (data.produtos.length > 0) {
        const produto = data.produtos[0];
        const produtoHasRequiredFields = (
          typeof produto.id === 'number' &&
          typeof produto.nome === 'string' &&
          typeof produto.preco === 'number' &&
          typeof produto.estoque === 'number'
        );
        
        console.log('Produto object schema:', produtoHasRequiredFields ? 'PASSED' : 'FAILED');
      }
    }
    
  } catch (error) {
    console.error('Documentation compliance test failed:', error);
  }
}

// Comprehensive test runner
export async function runComprehensiveTests(userToken?: string, adminToken?: string) {
  console.log('🚀 Starting Comprehensive API Test Suite');
  console.log('==========================================\n');
  
  // Basic connectivity
  console.log('📡 Testing Basic Connectivity...');
  await testApiConnectivity();
  
  // Performance tests
  console.log('\n⚡ Testing API Performance...');
  await testApiPerformance();
  
  // Documentation compliance
  console.log('\n📚 Testing Documentation Compliance...');
  await testApiDocumentationCompliance();
  
  if (userToken) {
    console.log('\n👤 Testing User Operations...');
    await testAuthenticatedEndpoints(userToken);
    
    console.log('\n🔍 Testing Pagination and Filtering...');
    await testPaginationAndFiltering(userToken);
    
    console.log('\n✅ Testing Data Validation...');
    await testDataValidation(userToken);
    
    console.log('\n⚙️ Testing Concurrent Operations...');
    await testConcurrentOperations(userToken);
    
    console.log('\n🎯 Testing Edge Cases...');
    await testEdgeCases(userToken);
    
    console.log('\n💬 Testing Messaging System...');
    await testMensagensEndpoints(userToken);
  }
  
  if (adminToken) {
    console.log('\n🔐 Testing Admin Operations...');
    await testAdminEndpoints(adminToken);
    await testAdminOperations(adminToken);
  }
  
  // Error handling
  console.log('\n🚨 Testing Error Scenarios...');
  await testErrorHandling();
  
  console.log('\n✨ Comprehensive Test Suite Complete!');
  console.log('Check the console output above for detailed results.');
}

// Example usage and demo function
export async function demoApiTesting() {
  console.log('🎯 AtleticaHub API Testing Demo');
  console.log('================================\n');
  
  console.log('⚡ Quick Test (No Authentication Required)');
  await testApiConnectivity();
  
  console.log('\n📊 Performance Test');
  await testApiPerformance();
  
  // Uncomment these lines when you have real tokens:
  /*
  const exampleUserToken = 'your-user-jwt-token-here';
  const exampleAdminToken = 'your-admin-jwt-token-here';
  
  console.log('\n👤 User Tests (Requires Authentication)');
  await testAuthenticatedEndpoints(exampleUserToken);
  
  console.log('\n🔐 Admin Tests (Requires Admin Token)');
  await testAdminEndpoints(exampleAdminToken);
  
  console.log('\n🛍️ Shopping Workflow Test');
  await testShoppingCartWorkflow(exampleUserToken, 1, 2);
  
  console.log('\n💬 Messaging Test');
  await testMessageSending(exampleUserToken, '0', 'Test message from API');
  */
  
  console.log('\n🚨 Error Handling Test');
  await testErrorHandling();
  
  console.log('\n✅ Demo Complete!');
  console.log('To run authenticated tests, replace the example tokens with real JWT tokens.');
}

// Utility function to help with token testing
export function createTestRunner(userToken?: string, adminToken?: string) {
  return {
    runBasicTests: () => testApiConnectivity(),
    runUserTests: userToken ? () => testAuthenticatedEndpoints(userToken) : null,
    runAdminTests: adminToken ? () => testAdminEndpoints(adminToken) : null,
    runFullSuite: () => runComprehensiveTests(userToken, adminToken),
    runPerformanceTest: () => testApiPerformance(),
    runErrorTests: () => testErrorHandling(),
    testSpecificEndpoints: (ids: { esporteId?: string; eventoId?: string; produtoId?: number; pedidoId?: number }) => 
      userToken ? testSpecificEndpoints(userToken, ids) : null,
    testWorkflows: {
      inscription: (esporteId: string) => userToken ? testInscriptionWorkflow(userToken, esporteId) : null,
      shopping: (produtoId: number, quantidade: number = 1) => userToken ? testShoppingCartWorkflow(userToken, produtoId, quantidade) : null,
      eventInscription: (eventoId: string) => userToken ? testEventInscriptionWorkflow(userToken, eventoId) : null,
      messaging: (esporteId: string, texto: string) => userToken ? testMessageSending(userToken, esporteId, texto) : null,
    },
    testValidation: userToken ? () => testDataValidation(userToken) : null,
    testConcurrency: userToken ? () => testConcurrentOperations(userToken) : null,
    testEdgeCases: userToken ? () => testEdgeCases(userToken) : null,
  };
}

// Helper for quick debugging
export async function quickDebugTest(endpoint: string, token?: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  
  console.log(`🔍 Quick Debug Test: ${endpoint}`);
  
  const fetchOptions = token ? {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  } : {};

  try {
    const response = await fetch(`${baseURL}${endpoint}`, fetchOptions);
    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
    } else {
      const errorData = await response.text();
      console.log('Error response:', errorData);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Export all test functions for easy importing
export const apiTestSuite = {
  connectivity: testApiConnectivity,
  authenticated: testAuthenticatedEndpoints,
  adminEndpoints: testAdminEndpoints,
  messaging: testMensagensEndpoints,
  specific: testSpecificEndpoints,
  complete: runCompleteApiTests,
  errorHandling: testErrorHandling,
  registration: testUserRegistrationFlow,
  workflows: {
    inscription: testInscriptionWorkflow,
    shopping: testShoppingCartWorkflow,
    eventInscription: testEventInscriptionWorkflow,
    messaging: testMessageSending,
  },
  admin: {
    operations: testAdminOperations,
    verification: testAdminEndpoints,
  },
  advanced: {
    performance: testApiPerformance,
    pagination: testPaginationAndFiltering,
    validation: testDataValidation,
    concurrency: testConcurrentOperations,
    edgeCases: testEdgeCases,
    compliance: testApiDocumentationCompliance,
    comprehensive: runComprehensiveTests,
  },
  utilities: {
    createRunner: createTestRunner,
    quickDebug: quickDebugTest,
    demo: demoApiTesting,
  }
};

// Default export for convenience
export default apiTestSuite;
