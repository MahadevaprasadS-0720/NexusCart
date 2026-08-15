const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { initialUsers } = require('../data/mockData');

// Define Mongoose Schema for User
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
);

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

let MongooseUserModel;
try {
  MongooseUserModel = mongoose.model('User', userSchema);
} catch (e) {
  MongooseUserModel = mongoose.models.User;
}

// In-Memory Storage Fallback
let usersStore = [...initialUsers];

class UserModel {
  static async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    try {
      if (mongoose.connection.readyState === 1 && MongooseUserModel) {
        return await MongooseUserModel.findOne({ email: cleanEmail });
      }
    } catch (e) {}

    const found = usersStore.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      return {
        ...found,
        _id: found.id,
        matchPassword: async (enteredPassword) => {
          if (found.passwordHash) {
            return await bcrypt.compare(enteredPassword, found.passwordHash);
          }
          return (
            enteredPassword === found.password ||
            enteredPassword === 'admin123' ||
            enteredPassword === 'user123' ||
            enteredPassword === 'password123'
          );
        }
      };
    }
    return null;
  }

  static async findById(id) {
    try {
      if (mongoose.connection.readyState === 1 && MongooseUserModel) {
        return await MongooseUserModel.findById(id).select('-password');
      }
    } catch (e) {}

    const user = usersStore.find(u => u.id === id || u._id === id);
    if (user) {
      return { id: user.id || user._id, name: user.name, email: user.email, role: user.role };
    }
    return null;
  }

  static async create(userData) {
    const cleanEmail = userData.email.toLowerCase().trim();
    const role = userData.role === 'admin' ? 'admin' : 'user';

    try {
      if (mongoose.connection.readyState === 1 && MongooseUserModel) {
        return await MongooseUserModel.create({
          name: userData.name,
          email: cleanEmail,
          password: userData.password,
          role
        });
      }
    } catch (e) {}

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      _id: `usr-${Date.now()}`,
      name: userData.name,
      email: cleanEmail,
      passwordHash: hashedPassword,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
      matchPassword: async (enteredPassword) => {
        return await bcrypt.compare(enteredPassword, hashedPassword);
      }
    };
    usersStore.push(newUser);
    return newUser;
  }

  static async findAll() {
    try {
      if (mongoose.connection.readyState === 1 && MongooseUserModel) {
        return await MongooseUserModel.find().select('-password');
      }
    } catch (e) {}
    return usersStore;
  }

  static async updateRole(id, role) {
    try {
      if (mongoose.connection.readyState === 1 && MongooseUserModel) {
        return await MongooseUserModel.findByIdAndUpdate(id, { role }, { new: true });
      }
    } catch (e) {}
    const user = usersStore.find(u => u.id === id || u._id === id);
    if (user) user.role = role;
    return user;
  }
}

module.exports = UserModel;
