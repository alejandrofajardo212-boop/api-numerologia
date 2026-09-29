import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado: Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'secreto_super_seguro_numerologia_2026';
    const decoded = jwt.verify(token, secret);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Exportamos alias para los archivos que lo importan como verifyToken
export const verifyToken = authMiddleware;

// Exportamos por defecto para los que lo importan sin llaves
export default authMiddleware;