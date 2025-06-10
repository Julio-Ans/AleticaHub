// Script para testar mensagens no console do navegador
console.log('🔍 Testando Sistema de Mensagens - Debug Completo');

// Função auxiliar para logs formatados
function debugLog(titulo, dados, tipo = 'info') {
    const estilo = {
        'success': 'color: #0f0; font-weight: bold;',
        'error': 'color: #f00; font-weight: bold;',
        'warning': 'color: #ff0; font-weight: bold;',
        'info': 'color: #0ff; font-weight: bold;'
    };
    
    console.log(`%c${titulo}`, estilo[tipo]);
    if (dados) console.log(dados);
}

// 1. Verificar tokens salvos
function verificarTokens() {
    debugLog('1. 🔑 Verificando Tokens Salvos', null, 'info');
    
    const authToken = localStorage.getItem('authToken');
    const athleticaToken = localStorage.getItem('athletica_token');
    
    debugLog('   authToken:', authToken ? authToken.substring(0, 50) + '...' : 'Não encontrado');
    debugLog('   athletica_token:', athleticaToken ? athleticaToken.substring(0, 50) + '...' : 'Não encontrado');
    
    const token = authToken || athleticaToken;
    
    if (token) {
        debugLog('✅ Token encontrado para testes', null, 'success');
        return token;
    } else {
        debugLog('❌ Nenhum token encontrado! Faça login primeiro.', null, 'error');
        return null;
    }
}

// 2. Testar API de mensagens
async function testarAPIMensagens(token, esporteId = '0') {
    debugLog('2. 📡 Testando API de Mensagens', null, 'info');
    
    const baseURL = 'https://atleticahubapi.onrender.com';
    
    try {
        // Buscar mensagens existentes
        debugLog('   📥 Buscando mensagens existentes...', null, 'warning');
        
        const response = await fetch(`${baseURL}/api/mensagens/${esporteId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const mensagens = await response.json();
            debugLog(`✅ ${mensagens.length} mensagem(ns) encontrada(s)`, null, 'success');
            
            if (mensagens.length > 0) {
                mensagens.forEach((msg, index) => {
                    debugLog(`📨 Mensagem ${index + 1}:`, {
                        id: msg.id,
                        texto: msg.texto,
                        conteudo: msg.conteudo,
                        remetente: msg.remetente,
                        esporteId: msg.esporteId,
                        criadaEm: msg.criadaEm
                    }, 'info');
                    
                    // Análise específica do conteúdo
                    const temTexto = msg.texto !== undefined && msg.texto !== '';
                    const temConteudo = msg.conteudo !== undefined && msg.conteudo !== '';
                    const temNomeRemetente = msg.remetente?.nome && msg.remetente.nome !== '';
                    
                    debugLog(`   🔍 Análise:`, {
                        'Campo texto': temTexto ? '✅ Presente' : '❌ Ausente/Vazio',
                        'Campo conteudo': temConteudo ? '✅ Presente' : '❌ Ausente/Vazio',
                        'Nome remetente': temNomeRemetente ? '✅ Presente' : '❌ Ausente/Vazio',
                        'Conteúdo final': msg.texto || msg.conteudo || 'SEM CONTEÚDO'
                    }, temTexto && temNomeRemetente ? 'success' : 'error');
                });
            }
            
            return mensagens;
        } else {
            const errorText = await response.text();
            debugLog('❌ Erro ao buscar mensagens:', errorText, 'error');
            return [];
        }
        
    } catch (error) {
        debugLog('❌ Erro de rede:', error.message, 'error');
        return [];
    }
}

// 3. Enviar mensagem de teste
async function enviarMensagemTeste(token, esporteId = '0') {
    debugLog('3. 📤 Enviando Mensagem de Teste', null, 'info');
    
    const baseURL = 'https://atleticahubapi.onrender.com';
    const mensagemTeste = `Teste de debug - ${new Date().toLocaleTimeString()}`;
    
    // Testar com campo 'texto' (padrão atual)
    try {
        debugLog('   🧪 Tentativa 1: Campo "texto"', null, 'warning');
        
        const response = await fetch(`${baseURL}/api/mensagens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                esporteId: esporteId,
                texto: mensagemTeste
            })
        });
        
        if (response.ok) {
            const novaMensagem = await response.json();
            debugLog('✅ Sucesso com campo "texto"!', novaMensagem, 'success');
            return novaMensagem;
        } else {
            const errorText = await response.text();
            debugLog('❌ Falhou com "texto":', errorText, 'error');
            
            // Tentar com campo 'conteudo'
            debugLog('   🧪 Tentativa 2: Campo "conteudo"', null, 'warning');
            
            const response2 = await fetch(`${baseURL}/api/mensagens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    esporteId: esporteId,
                    conteudo: mensagemTeste
                })
            });
            
            if (response2.ok) {
                const novaMensagem = await response2.json();
                debugLog('✅ Sucesso com campo "conteudo"!', novaMensagem, 'success');
                return novaMensagem;
            } else {
                const errorText2 = await response2.text();
                debugLog('❌ Falhou com "conteudo":', errorText2, 'error');
            }
        }
        
    } catch (error) {
        debugLog('❌ Erro de rede ao enviar:', error.message, 'error');
    }
    
    return null;
}

// 4. Simular comportamento do frontend
function simularFrontend(mensagens) {
    debugLog('4. 🖥️ Simulando Comportamento do Frontend', null, 'info');
    
    if (!mensagens || mensagens.length === 0) {
        debugLog('   ⚠️ Nenhuma mensagem para simular', null, 'warning');
        return;
    }
    
    mensagens.forEach((mensagem, index) => {
        // Simular como o ModalMensagens.tsx renderiza
        const nomeExibido = mensagem.remetente?.nome || 'Usuário';
        const textoExibido = mensagem.texto || 'Mensagem sem conteúdo';
        const dataExibida = new Date(mensagem.criadaEm).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        debugLog(`   💬 Mensagem ${index + 1} (como aparece no chat):`, {
            'Nome exibido': nomeExibido,
            'Texto exibido': textoExibido,
            'Data exibida': dataExibida,
            'Problema identificado': (nomeExibido === 'Usuário' && textoExibido === 'Mensagem sem conteúdo') ? '🐛 SIM - Apenas usuário e data!' : '✅ Renderização OK'
        }, (nomeExibido === 'Usuário' && textoExibido === 'Mensagem sem conteúdo') ? 'error' : 'success');
    });
}

// 5. Executar todos os testes
async function executarTestesCompletos() {
    debugLog('🚀 INICIANDO TESTES COMPLETOS DO SISTEMA DE MENSAGENS', null, 'info');
    
    const token = verificarTokens();
    if (!token) {
        debugLog('❌ Impossível continuar sem token. Faça login primeiro!', null, 'error');
        return;
    }
    
    const mensagensExistentes = await testarAPIMensagens(token);
    const novaMensagem = await enviarMensagemTeste(token);
    
    // Buscar mensagens novamente após envio
    if (novaMensagem) {
        const mensagensAtualizadas = await testarAPIMensagens(token);
        simularFrontend(mensagensAtualizadas);
    } else {
        simularFrontend(mensagensExistentes);
    }
    
    debugLog('🏁 TESTES CONCLUÍDOS', null, 'success');
    debugLog('💡 Para corrigir problemas encontrados:', {
        '1. Se mensagens aparecem sem conteúdo': 'Verificar se backend está salvando campo texto/conteudo',
        '2. Se nome aparece como "Usuário"': 'Verificar se backend está preenchendo dados do remetente',
        '3. Se erro 404/400': 'Verificar se endpoint e estrutura de dados estão corretos'
    }, 'info');
}

// Auto-executar os testes
executarTestesCompletos();
