import mongoose from 'mongoose';

const compatibilityMatchSchema = new mongoose.Schema({
  user1_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  interpretation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CompatibilityMatch', compatibilityMatchSchema);