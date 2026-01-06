const nodemailer = require("nodemailer");
const Settings = require("../models/settingsModel");
const EmailTemplate = require("../models/emailTemplateModel");

// Create transporter
const createTransporter = async () => {
  try {
    const settings = await Settings.findOne();

    if (!settings || !settings.emailConfig.user) {
      console.error("Email configuration not found in settings");
      return null;
    }

    const transporter = nodemailer.createTransport({
      service: settings.emailConfig.service,
      host: settings.emailConfig.host,
      port: settings.emailConfig.port,
      secure: settings.emailConfig.secure,
      auth: {
        user: settings.emailConfig.user,
        pass: settings.emailConfig.pass,
      },
    });

    return transporter;
  } catch (error) {
    console.error("Error creating email transporter:", error);
    return null;
  }
};

// Replace template variables
const replaceVariables = (template, variables) => {
  let content = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    content = content.replace(regex, value);
  }
  return content;
};

// Send email using template
exports.sendTemplateEmail = async (templateType, to, variables = {}) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      throw new Error("Email transporter not configured");
    }

    const settings = await Settings.findOne();
    const template = await EmailTemplate.findOne({
      type: templateType,
      isActive: true,
    });

    if (!template) {
      throw new Error(`Email template '${templateType}' not found`);
    }

    const subject = replaceVariables(template.subject, variables);
    const htmlContent = replaceVariables(template.htmlContent, variables);

    const mailOptions = {
      from: `${settings.siteName} <${
        settings.emailConfig.from || settings.emailConfig.user
      }>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// Send custom email
exports.sendEmail = async (to, subject, html, text = "") => {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      throw new Error("Email transporter not configured");
    }

    const settings = await Settings.findOne();

    const mailOptions = {
      from: `${settings.siteName} <${
        settings.emailConfig.from || settings.emailConfig.user
      }>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails (for newsletter)
exports.sendBulkEmails = async (recipients, subject, html) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      throw new Error("Email transporter not configured");
    }

    const settings = await Settings.findOne();
    const results = [];

    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: `${settings.siteName} <${
            settings.emailConfig.from || settings.emailConfig.user
          }>`,
          to: recipient,
          subject,
          html,
        };

        const info = await transporter.sendMail(mailOptions);
        results.push({
          email: recipient,
          success: true,
          messageId: info.messageId,
        });
      } catch (error) {
        results.push({
          email: recipient,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    throw error;
  }
};
