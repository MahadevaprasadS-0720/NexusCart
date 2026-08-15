const ProductModel = require('../models/Product');
const CategoryModel = require('../models/Category');

// @desc    Get all products with category filter and search
// @route   GET /api/products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, brand, minPrice, maxPrice } = req.query;

    const products = await ProductModel.findAll({
      category,
      search,
      brand,
      minPrice,
      maxPrice
    });

    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }
    return res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product categories list
// @route   GET /api/products/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.findAll();
    return res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product (Admin Only)
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const { name, title, description, price, category, stock, image, rating } = req.body;

    if (!name && !title) {
      return res.status(400).json({ success: false, message: 'Product name/title is required.' });
    }
    if (!price) {
      return res.status(400).json({ success: false, message: 'Product price is required.' });
    }

    const newProduct = await ProductModel.create({
      name: name || title,
      title: title || name,
      description: description || '',
      price: Number(price),
      category: category || 'Electronics',
      stock: Number(stock || 10),
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      rating: Number(rating || 4.5),
      ...req.body
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin Only)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await ProductModel.update(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin Only)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const isDeleted = await ProductModel.delete(req.params.id);
    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
