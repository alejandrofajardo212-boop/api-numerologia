import User from '../models/User.js';
import NumerologyProfile from '../models/NumerologyProfile.js';
import { calculateLifePath, calculateExpression, calculateSoulUrge } from '../utils/numerology.js';

export const calculateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const life_path = calculateLifePath(user.birth_date);
    const expression = calculateExpression(user.name);
    const soul_urge = calculateSoulUrge(user.name);

    const profile = await NumerologyProfile.findOneAndUpdate(
      { user_id: user._id },
      {
        life_path_number: life_path,
        expression_number: expression,
        soul_urge_number: soul_urge,
        updatedAt: Date.now()
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Perfil numerológico calculado con éxito', profile });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular números: ' + error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await NumerologyProfile.findOne({ user_id: req.user.id }).populate('user_id', 'name email birth_date');
    if (!profile) return res.status(404).json({ error: 'Perfil no encontrado. Debe ejecutar /calculate primero.' });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil: ' + error.message });
  }
};