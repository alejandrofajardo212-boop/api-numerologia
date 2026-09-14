import { GoogleGenAI } from '@google/genai';
import NumerologyProfile from '../models/NumerologyProfile.js';
import Reading from '../models/Reading.js';

export const generateReading = async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const { reading_type = 'general' } = req.body;
    const profile = await NumerologyProfile.findOne({ user_id: req.user.id }).populate('user_id', 'name');

    if (!profile) {
      return res.status(404).json({ error: 'Primero debes calcular tu perfil numerológico' });
    }

    const prompt = `Eres un experto numerólogo. Genera una lectura interpretativa de tipo "${reading_type}" para ${profile.user_id.name}.
Sus números centrales son:
- Camino de Vida: ${profile.life_path_number}
- Expresión: ${profile.expression_number}
- Alma: ${profile.soul_urge_number}

Brinda una interpretación clara e inspiradora.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const newReading = await Reading.create({
      user_id: req.user.id,
      prompt,
      response: response.text,
      reading_type
    });

    res.status(201).json({ message: 'Lectura generada con éxito', reading: newReading });
  } catch (error) {
    // Imprimimos el error real en la terminal para depurar, pero no se lo mostramos al cliente
    console.error('Error en generateReading:', error);
    res.status(500).json({ error: 'Error interno al generar la lectura con la IA de Gemini' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const readings = await Reading.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.json(readings);
  } catch (error) {
    console.error('Error en getHistory:', error);
    res.status(500).json({ error: 'Error al recuperar el historial' });
  }
};

export const getReadingById = async (req, res) => {
  try {
    const { id } = req.params;
    const reading = await Reading.findOne({ _id: id, user_id: req.user.id });
    
    if (!reading) {
      return res.status(404).json({ error: 'Lectura no encontrada' });
    }

    res.json(reading);
  } catch (error) {
    console.error('Error en getReadingById:', error);
    res.status(500).json({ error: 'Error al consultar la lectura' });
  }
};

export const deleteReading = async (req, res) => {
  try {
    const { id } = req.params;
    const reading = await Reading.findOneAndDelete({ _id: id, user_id: req.user.id });

    if (!reading) {
      return res.status(404).json({ error: 'Lectura no encontrada' });
    }

    res.json({ message: 'Lectura eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteReading:', error);
    res.status(500).json({ error: 'Error al eliminar la lectura' });
  }
};