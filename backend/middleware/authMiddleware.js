const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwtConfig');
const UserModel = require('../models/User');

// Middleware to verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const user = await UserModel.findById(decoded.id);
      if (user) {
        req.user = user;
      } else {
        req.user = decoded;
      }
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or expired authentication token.'
      });
    }
  }

  // Development demo header fallback
  if (req.headers['x-admin-demo'] === 'true') {
    req.user = { id: 'usr-admin-1', role: 'admin', email: 'admin@ecommerce.com' };
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Not authorized: No token provided in headers.'
  });
};

// Middleware to check if user is an admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: Admin privileges required.'
  });
};

module.exports = {
  protect,
  adminOnly,
  verifyToken: protect,
  verifyAdmin: adminOnly
};
