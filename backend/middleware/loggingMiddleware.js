import AuditLog from '../models/auditLogModel.js';

const loggingMiddleware = async (req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    res.body = body;
    originalJson.call(this, body);
  };

  res.on('finish', () => {
    const logEntry = new AuditLog({
      user: req.user ? req.user._id : null,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseBody: res.body
    });

    logEntry.save().catch(err => console.error('Error saving audit log:', err));
  });

  next();
};

export default loggingMiddleware;