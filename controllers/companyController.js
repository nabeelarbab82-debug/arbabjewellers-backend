const Company = require("../models/companyModel");

// @desc    Get all company information (Admin)
// @route   GET /api/admin/company
// @access  Private (Admin)
exports.getCompanyInfoAdmin = async (req, res) => {
  try {
    let company = await Company.findOne();

    if (!company) {
      // Create default company info if doesn't exist
      company = await Company.create({});
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve company information",
      error: error.message,
    });
  }
};

// @desc    Get company information
// @route   GET /api/company/:section (about/contact/testimonials)
// @access  Public
exports.getCompanyInfo = async (req, res) => {
  try {
    const { section } = req.params;

    let company = await Company.findOne();

    if (!company) {
      // Create default company info if doesn't exist
      company = await Company.create({});
    }

    let data = {};

    switch (section) {
      case "about":
        data = { about: company.about };
        break;
      case "contact":
        data = {
          email: company.email,
          phone: company.phone,
          address: company.address,
          whatsapp: company.whatsapp,
          socialLinks: company.socialLinks,
          workingHours: company.workingHours,
        };
        break;
      case "testimonials":
        data = {
          testimonials: company.testimonials.filter((t) => t.isActive),
        };
        break;
      default:
        data = company;
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve company information",
      error: error.message,
    });
  }
};

// @desc    Create or Update company information (Admin)
// @route   PUT /api/admin/company
// @access  Private (Admin)
exports.updateCompany = async (req, res) => {
  try {
    let company = await Company.findOne();

    if (!company) {
      // Create new company with all provided data
      company = await Company.create(req.body);
      return res.status(201).json({
        success: true,
        message: "Company information created successfully",
        data: company,
      });
    } else {
      // Update existing company with provided fields
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          company[key] = req.body[key];
        }
      });
      await company.save();

      return res.status(200).json({
        success: true,
        message: "Company information updated successfully",
        data: company,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save company information",
      error: error.message,
    });
  }
};

// @desc    Update about section (Admin)
// @route   PUT /api/admin/company/about
// @access  Private (Admin)
exports.updateAbout = async (req, res) => {
  try {
    const { about } = req.body;

    let company = await Company.findOne();

    if (!company) {
      company = await Company.create({ about });
    } else {
      company.about = about;
      await company.save();
    }

    res.status(200).json({
      success: true,
      message: "About section updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update about section",
      error: error.message,
    });
  }
};

// @desc    Update contact information (Admin)
// @route   PUT /api/admin/company/contact
// @access  Private (Admin)
exports.updateContact = async (req, res) => {
  try {
    const { email, phone, address, whatsapp, socialLinks, workingHours } =
      req.body;

    let company = await Company.findOne();

    if (!company) {
      company = await Company.create({
        email,
        phone,
        address,
        whatsapp,
        socialLinks,
        workingHours,
      });
    } else {
      if (email !== undefined) company.email = email;
      if (phone !== undefined) company.phone = phone;
      if (address !== undefined) company.address = address;
      if (whatsapp !== undefined) company.whatsapp = whatsapp;
      if (socialLinks !== undefined) company.socialLinks = socialLinks;
      if (workingHours !== undefined) company.workingHours = workingHours;
      await company.save();
    }

    res.status(200).json({
      success: true,
      message: "Contact information updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update contact information",
      error: error.message,
    });
  }
};

// @desc    Add testimonial (Admin)
// @route   POST /api/admin/company/testimonials
// @access  Private (Admin)
exports.addTestimonial = async (req, res) => {
  try {
    const { name, text, rating, image } = req.body;

    let company = await Company.findOne();

    if (!company) {
      company = await Company.create({
        testimonials: [{ name, text, rating, image }],
      });
    } else {
      company.testimonials.push({ name, text, rating, image });
      await company.save();
    }

    res.status(201).json({
      success: true,
      message: "Testimonial added successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add testimonial",
      error: error.message,
    });
  }
};

// @desc    Update testimonial (Admin)
// @route   PUT /api/admin/company/testimonials/:id
// @access  Private (Admin)
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, text, rating, image, isActive } = req.body;

    const company = await Company.findOne();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company information not found",
      });
    }

    const testimonial = company.testimonials.id(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    if (name !== undefined) testimonial.name = name;
    if (text !== undefined) testimonial.text = text;
    if (rating !== undefined) testimonial.rating = rating;
    if (image !== undefined) testimonial.image = image;
    if (isActive !== undefined) testimonial.isActive = isActive;

    await company.save();

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
      error: error.message,
    });
  }
};

// @desc    Delete testimonial (Admin)
// @route   DELETE /api/admin/company/testimonials/:id
// @access  Private (Admin)
exports.deleteTestimonial = async (req, res) => {
  try {
    const company = await Company.findOne();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company information not found",
      });
    }

    company.testimonials.id(req.params.id).remove();
    await company.save();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
      error: error.message,
    });
  }
};
