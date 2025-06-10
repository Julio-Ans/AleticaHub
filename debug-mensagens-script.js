// Script de debug para testar mensagens no console do browser
console.log('🚀 Script de Debug - Mensagens AtleticaHub');

// Teste 1: Verificar tokens
const token = localStorage.getItem('athletica_token') || localStorage.getItem('authToken');
console.log('🔑 Token encontrado:', !!token, token ? token.substring(0, 30) + '...' : 'NENHUM');

if (!token) {
    console.error('❌ Sem token! Faça login primeiro.');
} else {
    // Teste 2: Buscar mensagens do Chat Geral
    console.log('📥 Testando busca de mensagens do Chat Geral...');
    
    fetch('https://atleticahubapi.onrender.com/api/mensagens/0', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(`📡 Status da API: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            return response.json();
        } else {
            return response.text().then(text => {
                throw new Error(`${response.status}: ${text}`);
            });
        }
    })
    .then(mensagens => {
        console.log(`✅ ${mensagens.length} mensagem(ns) encontrada(s) no Chat Geral`);
        
        if (mensagens.length > 0) {
            mensagens.forEach((msg, index) => {
                console.log(`📨 Mensagem ${index + 1}:`);
                console.log('   ID:', msg.id);
                console.log('   EsporteID:', msg.esporteId);
                console.log('   Texto:', `"${msg.texto || 'VAZIO'}"`);
                console.log('   Remetente:', msg.remetente?.nome || 'SEM NOME');
                console.log('   Data:', msg.criadaEm);
                
                // Verificar se apareceria corretamente no frontend
                const textoFinal = msg.texto || 'Mensagem sem conteúdo';
                const nomeFinal = msg.remetente?.nome || 'Usuário';
                console.log(`   👁️ Apareceria como: "${nomeFinal}: ${textoFinal}"`);
                
                if (textoFinal === 'Mensagem sem conteúdo' || nomeFinal === 'Usuário') {
                    console.warn('   ⚠️ PROBLEMA: Dados incompletos!');
                } else {
                    console.log('   ✅ OK: Dados completos');
                }
            });
        } else {
            console.log('📝 Chat Geral vazio - isso é normal se ninguém enviou mensagens ainda');
        }
    })
    .catch(error => {
        console.error('❌ Erro ao buscar mensagens:', error.message);
        
        if (error.message.includes('404')) {
            console.log('💡 Erro 404: Chat Geral pode não ter sido criado ainda');
        } else if (error.message.includes('403')) {
            console.log('💡 Erro 403: Problema de permissão');
        }
    });
    
    // Teste 3: Enviar uma mensagem de teste
    console.log('📤 Enviando mensagem de teste...');
    
    const mensagemTeste = `🧪 Debug test - ${new Date().toLocaleTimeString()}`;
    
    fetch('https://atleticahubapi.onrender.com/api/mensagens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            esporteId: "0",
            texto: mensagemTeste
        })
    })
    .then(response => {
        console.log(`📡 Status envio: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            return response.json();
        } else {
            return response.text().then(text => {
                throw new Error(`${response.status}: ${text}`);
            });
        }
    })
    .then(novaMensagem => {
        console.log('✅ Mensagem enviada com sucesso!');
        console.log('📨 Nova mensagem:', novaMensagem);
        
        // Aguardar e buscar novamente
        setTimeout(() => {
            console.log('🔄 Verificando se mensagem aparece na lista...');
            location.reload(); // Recarregar para testar novamente
        }, 2000);
    })
    .catch(error => {
        console.error('❌ Erro ao enviar mensagem:', error.message);
    });
}

console.log('🏁 Script executado. Verifique os logs acima.');
console.log('💡 Se encontrar problemas, abra o modal de chat no AtleticaHub e teste.');
