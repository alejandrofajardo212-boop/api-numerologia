import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  status_code: { type: Number, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', auditLogSchema);