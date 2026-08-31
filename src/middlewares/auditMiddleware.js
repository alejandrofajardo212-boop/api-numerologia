import AuditLog from '../models/AuditLog.js';

export const auditLogger = (req, res, next) => {
  res.on('finish', async () => {
    try {
      await AuditLog.create({
        endpoint: req.originalUrl,
        method: req.method,
        status_code: res.statusCode,
        user_id: req.user ? req.user.id : null
      });
    } catch (err) {
      console.error('Error guardando AuditLog:', err.message);
    }
  });
  next();
};