const levels = { info: 'INFO', warn: 'WARN', error: 'ERROR', debug: 'DEBUG' };

function log(level, ...args) {
  const prefix = levels[level] || 'LOG';
  console.log(new Date().toISOString(), `[${prefix}]`, ...args);
}

module.exports = {
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
  debug: (...args) => log('debug', ...args)
};
