const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load Environment Variables
dotenv.config();

// Initialize Express App
const app = express();

// Enable Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to Database Store
connectDB();

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Amazon & Flipkart E-Commerce REST API Engine',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Serve Frontend Static Files for Single Unified Link (http://localhost:5000)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Catch-all Route for SPA Client Routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send(`
          <div style="font-family: sans-serif; padding: 3rem; text-align: center; line-height: 1.6;">
            <h2>⚡ MegaStore E-Commerce Unified Server Live!</h2>
            <p>Backend REST API endpoints are active under <code>/api/*</code>.</p>
            <p>To run Frontend and Backend together on this single link (<strong>http://localhost:5000</strong>):</p>
            <ol style="display: inline-block; text-align: left;">
              <li>Run <code>cd frontend && npm run build</code> to generate frontend static dist files.</li>
              <li>Or run <code>cd frontend && npm run dev</code> for hot-reloading dev mode on port 3000.</li>
            </ol>
          </div>
        `);
      }
    });
  }
});

// Global Error Handler
app.use(errorHandler);

// Define Server Port & Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 E-Commerce Unified App live on http://localhost:${PORT}`);
  console.log(`📡 Both Frontend & Backend API running on single link!`);
  console.log(`===================================================`);
});
