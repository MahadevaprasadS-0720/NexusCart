const verifyAdmin = (req, res, next) => {
  // Allow request if user has admin role or if admin mode header is passed for seamless demo
  const isAdminHeader = req.headers['x-admin-demo'] === 'true';

  if ((req.user && req.user.role === 'admin') || isAdminHeader) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: Admin privileges required.'
  });
};

module.exports = verifyAdmin;
