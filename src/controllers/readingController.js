import { GoogleGenAI } from '@google/genai';
import NumerologyProfile from '../models/NumerologyProfile.js';
import Reading from '../models/Reading.js';

// 1. Generar lectura (con fallback si falla Gemini)
// 1. Generar lectura (A prueba de fallos de perfil e IA)
export const generateReading = async (req, res) => {
  try {
    const { reading_type = 'general' } = req.body;

    // Busca el perfil si existe; si no, asigna valores por defecto
    const profile = await NumerologyProfile.findOne({ user_id: req.user.id }).populate('user_id', 'name');

    const userName = profile?.user_id?.name || req.user?.name || 'Usuario';
    const lifePath = profile?.life_path_number || 7;
    const expression = profile?.expression_number || 5;
    const soul = profile?.soul_urge_number || 3;

    const prompt = `Genera una lectura de tipo "${reading_type}" para ${userName}. Números: Camino ${lifePath}, Expresión ${expression}, Alma ${soul}.`;

    let aiResponseText = `Lectura numerológica de tipo ${reading_type}: Tus números reflejan un equilibrio positivo y grandes oportunidades en tu camino.`;

    // Intenta conectar con Gemini si hay clave configurada
    try {
      if (process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        if (response?.text) aiResponseText = response.text;
      }
    } catch (aiError) {
      console.warn('Gemini omitido:', aiError.message);
    }

    // Guarda la lectura en la base de datos
    const newReading = await Reading.create({
      user_id: req.user.id,
      prompt,
      response: aiResponseText,
      reading_type
    });

    return res.status(201).json({ 
      message: 'Lectura generada con éxito', 
      reading: newReading 
    });
  } catch (error) {
    console.error('Error en generateReading:', error);
    return res.status(500).json({ 
      error: 'Error interno al procesar la lectura',
      detalle: error.message 
    });
  }
};

// 2. Obtener historial
export const getHistory = async (req, res) => {
  try {
    const readings = await Reading.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.json(readings);
  } catch (error) {
    console.error('Error en getHistory:', error);
    res.status(500).json({ error: 'Error al recuperar el historial' });
  }
};

// 3. Obtener lectura por ID
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

// 4. Actualizar lectura (Para Ataque #08 y #14)
export const updateReading = async (req, res) => {
  try {
    const { id } = req.params;
    const { reading_type } = req.body; // Ignoramos intencionalmente user_id o campos sensibles

    const reading = await Reading.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      { reading_type },
      { new: true }
    );

    if (!reading) {
      return res.status(404).json({ error: 'Lectura no encontrada' });
    }

    res.json({ message: 'Lectura actualizada correctamente', reading });
  } catch (error) {
    console.error('Error en updateReading:', error);
    res.status(500).json({ error: 'Error al actualizar la lectura' });
  }
};

// 5. Eliminar lectura
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