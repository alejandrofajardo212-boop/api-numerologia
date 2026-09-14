import User from '../models/User.js';
import Reading from '../models/Reading.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Registrar / Crear usuario
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// 2. Iniciar sesión / Crear sesión (Login)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Firma del Token JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'secreto_super_seguro',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// 3. Obtener lista de usuarios (sin retornar contraseñas)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error en getUsers:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// 4. Eliminar usuario (bloquea el borrado si tiene lecturas activas)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const countReadings = await Reading.countDocuments({ user_id: id });
    if (countReadings > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar el usuario porque tiene lecturas activas asociadas'
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};