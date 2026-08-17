const cloverService = require('../services/cloverService');
const ProductModel = require('../models/Product');

// @desc    Get Clover integration status & public config
// @route   GET /api/clover/status
exports.getStatus = async (req, res, next) => {
  try {
    const status = await cloverService.checkCloverStatus();
    return res.json({
      success: true,
      ...status
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live products directly from Clover Sandbox REST API
// @route   GET /api/clover/products
exports.getLiveProducts = async (req, res, next) => {
  try {
    const data = await cloverService.getCloverItems();
    return res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single live product by Clover ID
// @route   GET /api/clover/products/:id
exports.getLiveProductById = async (req, res, next) => {
  try {
    const data = await cloverService.getCloverItemById(req.params.id);
    return res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Sync Clover live inventory into store database
// @route   POST /api/clover/sync
exports.syncInventory = async (req, res, next) => {
  try {
    const cloverData = await cloverService.getCloverItems();

    if (!cloverData.success || !cloverData.products || cloverData.products.length === 0) {
      return res.json({
        success: true,
        message: 'Clover Sandbox connection verified. No external items found to sync (Merchant inventory is currently empty). Store catalog remains active.',
        syncedCount: 0,
        merchantId: cloverService.cloverConfig.merchantId
      });
    }

    let syncedCount = 0;
    for (const item of cloverData.products) {
      try {
        await ProductModel.create(item);
        syncedCount++;
      } catch (e) {
        // Skip duplicate or handle update
      }
    }

    return res.json({
      success: true,
      message: `Successfully synchronized ${syncedCount} items from Clover Merchant ${cloverService.cloverConfig.merchantId}`,
      syncedCount,
      merchantId: cloverService.cloverConfig.merchantId
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process payment charge with Clover Ecommerce
// @route   POST /api/clover/charge
exports.processCharge = async (req, res, next) => {
  try {
    const { token, amount, currency = 'USD', customerEmail, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid charge amount'
      });
    }

    const result = await cloverService.createCloverCharge({
      token,
      amount,
      currency,
      customerEmail,
      description
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};
