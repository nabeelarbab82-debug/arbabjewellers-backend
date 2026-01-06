const Contact = require("../models/contactModel");
const { paginate } = require("../utils/helpers");
const { sendEmail } = require("../utils/emailService");

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message:
        "Your message has been submitted successfully. We will get back to you soon!",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form",
      error: error.message,
    });
  }
};

// @desc    Get all contacts (Admin)
// @route   GET /api/admin/contacts
// @access  Private (Admin)
exports.getAllContacts = async (req, res) => {
  try {
    const { page, limit, status } = req.query;

    const query = {};
    if (status) query.status = status;

    // Pagination
    const { skip, limit: limitNum } = paginate(page, limit);

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page: parseInt(page) || 1,
      pages: Math.ceil(total / limitNum),
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve contacts",
      error: error.message,
    });
  }
};

// @desc    Get contact by ID (Admin)
// @route   GET /api/admin/contacts/:id
// @access  Private (Admin)
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Mark as read if status is new
    if (contact.status === "new") {
      contact.status = "read";
      await contact.save();
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve contact",
      error: error.message,
    });
  }
};

// @desc    Update contact status (Admin)
// @route   PUT /api/admin/contacts/:id/status
// @access  Private (Admin)
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    contact.status = status;
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update contact status",
      error: error.message,
    });
  }
};

// @desc    Reply to contact inquiry (Admin)
// @route   POST /api/admin/contacts/:id/reply
// @access  Private (Admin)
exports.replyToContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Send reply email
    const subject = `Re: ${contact.subject}`;
    await sendEmail(contact.email, subject, replyMessage);

    // Update contact
    contact.adminReply = replyMessage;
    contact.status = "replied";
    contact.repliedAt = Date.now();
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
      error: error.message,
    });
  }
};

// @desc    Delete contact (Admin)
// @route   DELETE /api/admin/contacts/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error.message,
    });
  }
};
