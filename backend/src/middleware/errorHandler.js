const ApiError = require('../errors/ApiError');
const logger = require('../lib/logger');

function errorHandler(err, req, res, next) {
  logger.error(err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message, details: err.details || null });
  }
  // Prisma/Mongo errors might include code
  return res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;
