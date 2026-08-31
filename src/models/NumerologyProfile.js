import mongoose from 'mongoose';

const numerologyProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  life_path_number: { type: Number, required: true },
  expression_number: { type: Number, required: true },
  soul_urge_number: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('NumerologyProfile', numerologyProfileSchema);