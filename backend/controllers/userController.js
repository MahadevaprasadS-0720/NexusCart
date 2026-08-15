const UserModel = require('../models/User');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findAll();
    // Return users without sensitive password hash
    const safeUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }));
    return res.json({ success: true, count: safeUsers.length, users: safeUsers });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const updated = await UserModel.updateRole(req.params.id, role);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({
      success: true,
      message: 'User role updated successfully',
      user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role }
    });
  } catch (error) {
    next(error);
  }
};
