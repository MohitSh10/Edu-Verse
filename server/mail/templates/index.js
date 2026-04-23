// OTP Template
exports.otpTemplate = (otp) => `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #1a1a2e;">Verify Your Email</h2>
  <p>Use the OTP below to complete your registration. It expires in <strong>5 minutes</strong>.</p>
  <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; padding: 20px 0; text-align: center;">${otp}</div>
  <p style="color: #666;">If you didn't request this, ignore this email.</p>
</div>`;

// Password Reset Template
exports.passwordResetTemplate = (resetUrl, firstName) => `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #1a1a2e;">Reset Your Password</h2>
  <p>Hi ${firstName},</p>
  <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
  <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
  <p style="color: #666;">Or copy: <a href="${resetUrl}">${resetUrl}</a></p>
  <p style="color: #666;">If you didn't request this, ignore this email.</p>
</div>`;

// Enrollment Email Template
exports.enrollmentEmailTemplate = (firstName, courseNames) => `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #1a1a2e;">🎉 Enrollment Confirmed!</h2>
  <p>Hi ${firstName}, you're now enrolled in:</p>
  <ul>${courseNames.map((name) => `<li><strong>${name}</strong></li>`).join("")}</ul>
  <p>Head to your dashboard to start learning.</p>
</div>`;

// Contact Template
exports.contactTemplate = ({ firstName, lastName, email, message, phoneNumber }) => `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${firstName} ${lastName}</p>
  <p><strong>Email:</strong> ${email}</p>
  ${phoneNumber ? `<p><strong>Phone:</strong> ${phoneNumber}</p>` : ""}
  <p><strong>Message:</strong></p>
  <p style="background: #f5f5f5; padding: 12px; border-radius: 4px;">${message}</p>
</div>`;
