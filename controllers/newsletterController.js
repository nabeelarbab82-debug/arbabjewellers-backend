const Subscriber = require("../models/subscriberModel");
const { sendTemplateEmail, sendBulkEmails } = require("../utils/emailService");

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({
          success: false,
          message: "Email is already subscribed",
        });
      } else {
        // Reactivate subscription
        existing.isActive = true;
        existing.subscribedAt = Date.now();
        await existing.save();

        return res.status(200).json({
          success: true,
          message: "Subscription reactivated successfully",
        });
      }
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({ email });

    // Send welcome email
    const verificationLink = `${process.env.FRONTEND_URL}/newsletter/verify/${subscriber.verificationToken}`;

    await sendTemplateEmail("welcome-subscriber", email, {
      email,
      verificationLink,
    });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully! Please check your email to verify.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to subscribe",
      error: error.message,
    });
  }
};

// @desc    Verify email subscription
// @route   GET /api/newsletter/verify/:token
// @access  Public
exports.verifySubscription = async (req, res) => {
  try {
    const { token } = req.params;

    const subscriber = await Subscriber.findOne({ verificationToken: token });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    subscriber.isVerified = true;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
      error: error.message,
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { token } = req.body;

    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Invalid unsubscribe token",
      });
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to unsubscribe",
      error: error.message,
    });
  }
};

// @desc    Get all subscribers (Admin)
// @route   GET /api/admin/newsletter/subscribers
// @access  Private (Admin)
exports.getAllSubscribers = async (req, res) => {
  try {
    const { active, verified } = req.query;
    const query = {};

    if (active !== undefined) query.isActive = active === "true";
    if (verified !== undefined) query.isVerified = verified === "true";

    const subscribers = await Subscriber.find(query).sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve subscribers",
      error: error.message,
    });
  }
};

// @desc    Delete subscriber (Admin)
// @route   DELETE /api/admin/newsletter/subscribers/:id
// @access  Private (Admin)
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    await Subscriber.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete subscriber",
      error: error.message,
    });
  }
};

// @desc    Send promotional email to all subscribers (Admin)
// @route   POST /api/admin/newsletter/send
// @access  Private (Admin)
exports.sendPromotionalEmail = async (req, res) => {
  try {
    const { subject, htmlContent } = req.body;

    // Get all active and verified subscribers
    const subscribers = await Subscriber.find({
      isActive: true,
      isVerified: true,
    });

    if (subscribers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active subscribers found",
      });
    }

    // Get email addresses
    const emails = subscribers.map((sub) => sub.email);

    // Add unsubscribe link to each email
    const results = [];
    for (const subscriber of subscribers) {
      const unsubscribeLink = `${process.env.FRONTEND_URL}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;
      const customHtml = htmlContent.replace(
        "{{unsubscribeLink}}",
        unsubscribeLink
      );

      const { sendEmail } = require("../utils/emailService");
      const result = await sendEmail(subscriber.email, subject, customHtml);
      results.push({
        email: subscriber.email,
        success: result.success,
      });
    }

    const successCount = results.filter((r) => r.success).length;

    res.status(200).json({
      success: true,
      message: `Promotional email sent to ${successCount} out of ${subscribers.length} subscribers`,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send promotional email",
      error: error.message,
    });
  }
};

// @desc    Send test email (Admin)
// @route   POST /api/admin/newsletter/send-test
// @access  Private (Admin)
exports.sendTestEmail = async (req, res) => {
  try {
    const { email, subject, htmlContent } = req.body;

    const { sendEmail } = require("../utils/emailService");
    const result = await sendEmail(email, subject, htmlContent);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Test email sent successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send test email",
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    });
  }
};

// @desc    Get subscriber statistics (Admin)
// @route   GET /api/admin/newsletter/statistics
// @access  Private (Admin)
exports.getSubscriberStatistics = async (req, res) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments();
    const activeSubscribers = await Subscriber.countDocuments({
      isActive: true,
    });
    const verifiedSubscribers = await Subscriber.countDocuments({
      isVerified: true,
    });
    const unverifiedSubscribers = await Subscriber.countDocuments({
      isVerified: false,
    });

    res.status(200).json({
      success: true,
      statistics: {
        totalSubscribers,
        activeSubscribers,
        verifiedSubscribers,
        unverifiedSubscribers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve statistics",
      error: error.message,
    });
  }
};
