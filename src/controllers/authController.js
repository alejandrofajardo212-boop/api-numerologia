import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Registrar usuario
export const register = async (req, res) => {
  try {
    const { name, email, password, birth_date } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'El correo ya está registrado' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password_hash, birth_date });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: user._id, name: user.name, email: user.email, birth_date: user.birth_date }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en esa vuelta del registro: ' + error.message });
  }
};

// 2. Iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

    const secret = process.env.JWT_SECRET || 'secreto_super_seguro_numerologia_2026';

    const accessToken = jwt.sign(
      { id: user._id, name: user.name },
      secret,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en esa vuelta del login: ' + error.message });
  }
};

// 3. Refrescar token
export const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(401).json({ error: 'Refresh token requerido' });

  try {
    const secret = process.env.JWT_SECRET || 'secreto_super_seguro_numerologia_2026';
    const decoded = jwt.verify(refresh_token, secret);
    
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      secret,
      { expiresIn: '1h' }
    );

    res.json({ access_token: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: 'Refresh token inválido o expirado' });
  }
};