import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error en esa vuelta del login: ' + error.message });
  }
};