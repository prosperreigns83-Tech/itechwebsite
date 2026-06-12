const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key (set via environment variable)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'itechstore23334@gmail.com';
// Use the verified sender email (same as company email)
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'itechstore23334@gmail.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('⚠️  SENDGRID_API_KEY environment variable not set. Email sending will be disabled.');
}

/**
 * Send email via SendGrid
 */
async function sendEmail(to, subject, htmlContent, textContent = null, replyTo = null) {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn('⚠️  SENDGRID_API_KEY not set. Email not sent.');
      console.log(`Email would have been sent to: ${to}`);
      console.log(`Subject: ${subject}`);
      return { success: false, message: 'SendGrid API key not configured' };
    }

    const msg = {
      to,
      from: SENDER_EMAIL,  // Use verified sender email
      subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, ''),
      replyTo: replyTo || COMPANY_EMAIL  // Always set replyTo to company email for responses
    };

    const response = await sgMail.send(msg);
    console.log(`✓ Email sent to ${to}: ${subject}`);
    console.log('SendGrid Response:', response);
    return { success: true, response };
  } catch (err) {
    console.error(`✗ Email send failed to ${to}:`, err.message);
    console.error('Full Error Details:', err);
    if (err.response) {
      console.error('SendGrid Error Response:', err.response.body);
    }
    return { success: false, error: err.message };
  }
}

/**
 * Send order confirmation to company
 */
async function sendOrderNotificationToCompany(order, customerEmail) {
  const subject = `New Order #${order.orderId} - ${order.customerName}`;
  
  const items = (order.items || [])
    .map(item => `<li>${item.name} (Qty: ${item.qty}) - ₦${item.price}</li>`)
    .join('');

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; background: #f9f9f9; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; }
          h2 { color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 10px; }
          .order-details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          ul { list-style: none; padding: 0; }
          .total { font-weight: bold; font-size: 18px; color: #2563EB; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🎉 New Order Received!</h2>
          
          <div class="order-details">
            <div class="detail-row">
              <span><strong>Order ID:</strong></span>
              <span>#${order.orderId}</span>
            </div>
            <div class="detail-row">
              <span><strong>Customer Name:</strong></span>
              <span>${order.customerName}</span>
            </div>
            <div class="detail-row">
              <span><strong>Customer Email:</strong></span>
              <span>${customerEmail}</span>
            </div>
            <div class="detail-row">
              <span><strong>Phone:</strong></span>
              <span>${order.phone || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span><strong>Delivery Address:</strong></span>
              <span>${order.address || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span><strong>Payment Method:</strong></span>
              <span>${order.paymentMethod || 'N/A'}</span>
            </div>
          </div>

          <h3 style="color: #555;">Order Items:</h3>
          <ul>
            ${items}
          </ul>

          <div class="order-details" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
            <div class="detail-row">
              <span><strong>Subtotal:</strong></span>
              <span>₦${(order.subtotal || 0).toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span><strong>Delivery Fee:</strong></span>
              <span>₦${(order.deliveryFee || 0).toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span><strong>Discount:</strong></span>
              <span>-₦${(order.discount || 0).toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span><strong>Tax:</strong></span>
              <span>₦${(order.tax || 0).toLocaleString()}</span>
            </div>
            <div class="detail-row" style="border: none; margin-top: 10px;">
              <span style="font-weight: bold; font-size: 16px; color: #2563EB;">TOTAL:</span>
              <span class="total">₦${(order.total || 0).toLocaleString()}</span>
            </div>
          </div>

          <p style="color: #999; text-align: center; margin-top: 30px; font-size: 12px;">
            This is an automated notification from iTech Store ordering system.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail(COMPANY_EMAIL, subject, htmlContent);
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `http://localhost:5178/reset-password?token=${resetToken}`;
  
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; background: #f9f9f9; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; }
          h2 { color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 10px; }
          .button { display: inline-block; padding: 12px 24px; background: #2563EB; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .warning { color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🔐 Password Reset Request</h2>
          
          <p>Hi there,</p>
          
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">
            ${resetUrl}
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
          </p>
          
          <p style="color: #999; font-size: 12px;">
            —<br>
            iTech Store Support Team
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, 'Reset Your Password', htmlContent);
}

/**
 * Send contact form submission to company
 */
async function sendContactFormEmail(contactData) {
  const { email, subject, message } = contactData;
  
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; background: #f9f9f9; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; }
          h2 { color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 10px; }
          .info { background: #f0f9ff; padding: 12px; border-left: 4px solid #2563EB; border-radius: 4px; margin: 15px 0; }
          .message { background: #f9f9f9; padding: 15px; border-radius: 6px; border: 1px solid #eee; margin: 15px 0; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>📬 New Contact Form Submission</h2>
          
          <div class="info">
            <p><strong>From:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <h3>Message:</h3>
          <div class="message">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            You can reply to this email to respond to the user directly, or visit your contact messages dashboard.
          </p>
          
          <p style="color: #999; font-size: 12px;">
            —<br>
            iTech Store Contact System
          </p>
        </div>
      </body>
    </html>
  `;

  // Send email with replyTo set to customer's email
  return sendEmail(COMPANY_EMAIL, `Contact Form: ${subject}`, htmlContent, null, email);
}

module.exports = {
  sendEmail,
  sendOrderNotificationToCompany,
  sendPasswordResetEmail,
  sendContactFormEmail,
  COMPANY_EMAIL
};
