import { GoogleGenAI } from '@google/genai';
import NumerologyProfile from '../models/NumerologyProfile.js';
import CompatibilityMatch from '../models/CompatibilityMatch.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const checkCompatibility = async (req, res) => {
  try {
    const { target_user_id } = req.body;

    const profile1 = await NumerologyProfile.findOne({ user_id: req.user.id }).populate('user_id', 'name');
    const profile2 = await NumerologyProfile.findOne({ user_id: target_user_id }).populate('user_id', 'name');

    if (!profile1 || !profile2) {
      return res.status(400).json({ error: 'Ambos usuarios deben tener sus perfiles numerológicos calculados.' });
    }

    // Cálculo arbitrario simple de compatibilidad para el score (base 100)
    const diff = Math.abs(profile1.life_path_number - profile2.life_path_number);
    const score = Math.max(50, 100 - (diff * 10));

    const prompt = `Analiza la compatibilidad numerológica de pareja/relación entre ${profile1.user_id.name} y ${profile2.user_id.name}.
Persona 1: Camino de Vida ${profile1.life_path_number}, Expresión ${profile1.expression_number}.
Persona 2: Camino de Vida ${profile2.life_path_number}, Expresión ${profile2.expression_number}.
Score estimado: ${score}/100.
Entrega un resumen de fortalezas y áreas de crecimiento en su relación.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const match = await CompatibilityMatch.create({
      user1_id: req.user.id,
      user2_id: target_user_id,
      score,
      interpretation: response.text
    });

    res.status(201).json({ message: 'Análisis de compatibilidad completado', match });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar esa vuelta de compatibilidad: ' + error.message });
  }
};