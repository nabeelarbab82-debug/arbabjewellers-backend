const EmailTemplate = require("../models/emailTemplateModel");

// @desc    Get all email templates (Admin)
// @route   GET /api/admin/email-templates
// @access  Private (Admin)
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find();

    res.status(200).json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve email templates",
      error: error.message,
    });
  }
};

// @desc    Get email template by type (Admin)
// @route   GET /api/admin/email-templates/:type
// @access  Private (Admin)
exports.getTemplateByType = async (req, res) => {
  try {
    const template = await EmailTemplate.findOne({ type: req.params.type });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Email template not found",
      });
    }

    res.status(200).json({
      success: true,
      template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve email template",
      error: error.message,
    });
  }
};

// @desc    Update email template (Admin)
// @route   PUT /api/admin/email-templates/:type
// @access  Private (Admin)
exports.updateTemplate = async (req, res) => {
  try {
    const { subject, htmlContent, variables, isActive } = req.body;

    let template = await EmailTemplate.findOne({ type: req.params.type });

    if (!template) {
      // Create new template if doesn't exist
      template = await EmailTemplate.create({
        type: req.params.type,
        subject,
        htmlContent,
        variables,
        isActive,
      });
    } else {
      if (subject !== undefined) template.subject = subject;
      if (htmlContent !== undefined) template.htmlContent = htmlContent;
      if (variables !== undefined) template.variables = variables;
      if (isActive !== undefined) template.isActive = isActive;
      await template.save();
    }

    res.status(200).json({
      success: true,
      message: "Email template updated successfully",
      template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update email template",
      error: error.message,
    });
  }
};

// @desc    Preview email template (Admin)
// @route   POST /api/admin/email-templates/preview
// @access  Private (Admin)
exports.previewTemplate = async (req, res) => {
  try {
    const { htmlContent, variables } = req.body;

    // Replace variables in template
    let preview = htmlContent;
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, "g");
        preview = preview.replace(regex, value);
      }
    }

    res.status(200).json({
      success: true,
      preview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to preview template",
      error: error.message,
    });
  }
};
