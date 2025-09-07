const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const walletRoutes = require('./routes/wallets');
const vaRoutes = require('./routes/virtualAccounts');
const txRoutes = require('./routes/transactions');
const recipientRoutes = require('./routes/recipients');
const webhookRoutes = require('./routes/webhooks');
const adminRoutes = require('./routes/admin');
const { protect } = require('./middleware/auth');

const app = express();

app.use(helmet());
app.use(express.json());
// Expose raw body for webhook route
app.use((req, res, next) => {
  if (req.path === '/api/mastercard/webhook') {
    // use raw body parser
    express.raw({ type: '*/*' })(req, res, next);
  } else {
    next();
  }
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);

// CSRF protection for stateful endpoints (refresh/logout) - configure as needed
const csrfProtection = csurf({ cookie: { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true' } });
app.use((req, res, next) => {
  if (req.path === '/api/mastercard/webhook') return next();
  return csrfProtection(req, res, next);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/wallets', protect, walletRoutes);
app.use('/api/virtual-accounts', protect, vaRoutes);
app.use('/api/transactions', protect, txRoutes);
app.use('/api/recipients', protect, recipientRoutes);
app.use('/api/mastercard', webhookRoutes); // webhook not protected and skipped from CSRF
app.use('/api/admin', protect, adminRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 'EBADCSRFTOKEN') return res.status(403).json({ error: 'Invalid CSRF token' });
  res.status(500).json({ error: 'Server error' });
});

module.exports = app;
