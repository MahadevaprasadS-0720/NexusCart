const mongoose = require('mongoose');
const { initialProducts } = require('../data/mockData');

// Define Mongoose Schema for Product
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a product description']
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: 0
    },
    originalPrice: {
      type: Number
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true
    },
    brand: {
      type: String,
      default: 'Generic'
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    },
    images: [String],
    stock: {
      type: Number,
      required: [true, 'Please add stock count'],
      default: 10
    },
    rating: {
      type: Number,
      default: 4.5
    },
    reviewCount: {
      type: Number,
      default: 1
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isDealOfTheDay: {
      type: Boolean,
      default: false
    },
    specifications: {
      type: Map,
      of: String
    }
  },
  { timestamps: true }
);

let MongooseProductModel;
try {
  MongooseProductModel = mongoose.model('Product', productSchema);
} catch (e) {
  MongooseProductModel = mongoose.models.Product;
}

// In-Memory Fallback Storage
let productsStore = [...initialProducts];

class ProductModel {
  static async findAll({ category, search, brand, minPrice, maxPrice } = {}) {
    try {
      if (mongoose.connection.readyState === 1 && MongooseProductModel) {
        let query = {};
        if (category && category !== 'All') {
          query.category = new RegExp(category, 'i');
        }
        if (brand) {
          query.brand = new RegExp(brand, 'i');
        }
        if (search) {
          query.$or = [
            { name: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { category: new RegExp(search, 'i') }
          ];
        }
        if (minPrice || maxPrice) {
          query.price = {};
          if (minPrice) query.price.$gte = Number(minPrice);
          if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        return await MongooseProductModel.find(query).sort({ createdAt: -1 });
      }
    } catch (e) {}

    let result = productsStore.map(p => ({
      ...p,
      name: p.name || p.title,
      image: p.image || (p.images ? p.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80')
    }));

    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (brand) {
      result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    return result;
  }

  static async findById(id) {
    try {
      if (mongoose.connection.readyState === 1 && MongooseProductModel) {
        return await MongooseProductModel.findById(id);
      }
    } catch (e) {}

    const p = productsStore.find(prod => prod.id === id || prod._id === id || prod.slug === id);
    if (p) {
      return {
        ...p,
        _id: p.id || p._id,
        name: p.name || p.title,
        image: p.image || (p.images ? p.images[0] : '')
      };
    }
    return null;
  }

  static async create(data) {
    const productName = data.name || data.title;
    const prodImg = data.image || (Array.isArray(data.images) && data.images[0] ? data.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');

    try {
      if (mongoose.connection.readyState === 1 && MongooseProductModel) {
        return await MongooseProductModel.create({
          name: productName,
          description: data.description || '',
          price: Number(data.price),
          originalPrice: Number(data.originalPrice || data.price),
          category: data.category || 'Electronics',
          brand: data.brand || 'Generic',
          image: prodImg,
          images: [prodImg],
          stock: Number(data.stock || 10),
          rating: Number(data.rating || 4.5),
          isFeatured: Boolean(data.isFeatured),
          isDealOfTheDay: Boolean(data.isDealOfTheDay)
        });
      }
    } catch (e) {}

    const original = Number(data.originalPrice || data.price);
    const current = Number(data.price);
    const discount = original > current ? Math.round(((original - current) / original) * 100) : 0;

    const newProd = {
      id: `prod-${Date.now()}`,
      _id: `prod-${Date.now()}`,
      name: productName,
      title: productName,
      description: data.description || '',
      price: current,
      originalPrice: original,
      discountPercentage: discount,
      category: data.category || 'Electronics',
      brand: data.brand || 'Generic',
      image: prodImg,
      images: [prodImg],
      stock: Number(data.stock || 10),
      rating: Number(data.rating || 4.5),
      reviewCount: 1,
      isFeatured: Boolean(data.isFeatured),
      isDealOfTheDay: Boolean(data.isDealOfTheDay),
      specifications: data.specifications || {}
    };

    productsStore.unshift(newProd);
    return newProd;
  }

  static async update(id, updates) {
    const productName = updates.name || updates.title;

    try {
      if (mongoose.connection.readyState === 1 && MongooseProductModel) {
        return await MongooseProductModel.findByIdAndUpdate(
          id,
          { ...updates, name: productName },
          { new: true }
        );
      }
    } catch (e) {}

    const idx = productsStore.findIndex(p => p.id === id || p._id === id);
    if (idx === -1) return null;

    const existing = productsStore[idx];
    const updatedPrice = updates.price !== undefined ? Number(updates.price) : existing.price;
    const updatedOriginal = updates.originalPrice !== undefined ? Number(updates.originalPrice) : (existing.originalPrice || existing.price);
    const discount = updatedOriginal > updatedPrice ? Math.round(((updatedOriginal - updatedPrice) / updatedOriginal) * 100) : 0;

    productsStore[idx] = {
      ...existing,
      ...updates,
      name: productName || existing.name || existing.title,
      title: productName || existing.title || existing.name,
      price: updatedPrice,
      originalPrice: updatedOriginal,
      discountPercentage: discount
    };
    return productsStore[idx];
  }

  static async delete(id) {
    try {
      if (mongoose.connection.readyState === 1 && MongooseProductModel) {
        await MongooseProductModel.findByIdAndDelete(id);
        return true;
      }
    } catch (e) {}

    const idx = productsStore.findIndex(p => p.id === id || p._id === id);
    if (idx === -1) return false;
    productsStore.splice(idx, 1);
    return true;
  }
}

module.exports = ProductModel;
