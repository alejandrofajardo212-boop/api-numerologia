import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  birth_date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);