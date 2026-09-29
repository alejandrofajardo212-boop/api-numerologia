import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  reading_type: { type: String, enum: ['diaria', 'general', 'anual'], default: 'general' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Reading', readingSchema);