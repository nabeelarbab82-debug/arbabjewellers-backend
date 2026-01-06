const Settings = require("../models/settingsModel");

// @desc    Get settings (Admin)
// @route   GET /api/admin/settings
// @access  Private (Admin)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      // Create default settings if doesn't exist
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve settings",
      error: error.message,
    });
  }
};

// @desc    Update settings (Admin)
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res) => {
  try {
    const {
      siteName,
      logo,
      favicon,
      currency,
      shippingFee,
      taxRate,
      emailConfig,
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      if (siteName !== undefined) settings.siteName = siteName;
      if (logo !== undefined) settings.logo = logo;
      if (favicon !== undefined) settings.favicon = favicon;
      if (currency !== undefined) settings.currency = currency;
      if (shippingFee !== undefined) settings.shippingFee = shippingFee;
      if (taxRate !== undefined) settings.taxRate = taxRate;
      if (emailConfig !== undefined) {
        settings.emailConfig = { ...settings.emailConfig, ...emailConfig };
      }
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};
