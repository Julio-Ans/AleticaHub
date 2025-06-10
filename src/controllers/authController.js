const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await authService.login(idToken);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Novo endpoint para verificar tokens
exports.verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        valid: false, 
        error: 'Token ausente ou inválido' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar se é um Firebase ID Token
    const admin = require('../utils/firebaseAdmin');
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Buscar informações do usuário no banco
    const prisma = require('../lib/prisma');
    const user = await prisma.usuario.findUnique({ 
      where: { id: decodedToken.uid } 
    });

    if (!user) {
      return res.status(404).json({ 
        valid: false, 
        error: 'Usuário não encontrado' 
      });
    }

    res.status(200).json({
      valid: true,
      user: {
        uid: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    res.status(403).json({ 
      valid: false, 
      error: 'Token inválido' 
    });
  }
};

exports.verifyUser = (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ error: 'Acesso negado' });
  res.status(200).json({ access: 'granted' });
};

exports.verifyAdmin = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  res.status(200).json({ access: 'granted' });
};