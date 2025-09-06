const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);

// CSRF protection for stateful endpoints (refresh/logout) - configure as needed
app.use(csurf({ cookie: { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true' } }));

// Routes
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 'EBADCSRFTOKEN') return res.status(403).json({ error: 'Invalid CSRF token' });
  res.status(500).json({ error: 'Server error' });
});

module.exports = app;
