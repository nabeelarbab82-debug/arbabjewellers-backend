const Admin = require("../models/adminModel");

// @desc    Get all admins
// @route   GET /api/admin/admins
// @access  Private (Super Admin)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create new admin
// @route   POST /api/admin/admins
// @access  Private (Super Admin)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update admin
// @route   PUT /api/admin/admins/:id
// @access  Private (Super Admin)
exports.updateAdmin = async (req, res) => {
  try {
    const { name, email, role, isActive, avatar } = req.body;

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.role = role || admin.role;
    admin.avatar = avatar || admin.avatar;
    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/admins/:id
// @access  Private (Super Admin)
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Prevent deleting yourself
    if (admin._id.toString() === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
