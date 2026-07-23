const nodemailer = require("nodemailer");
const { Resend } = require("resend");
const logger = require("./logger");

/**
 * Get Email Transporter / Provider
 * 1. Primary: SMTP Transporter (Gmail / Custom SMTP) if SMTP_USER & SMTP_PASS exist.
 * 2. Secondary: Resend SDK if RESEND_API_KEY exists.
 * 3. Fallback: Console Dev Logger.
 */
const getEmailProvider = () => {
    // 1. Check Gmail / Custom SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const host = process.env.SMTP_HOST || "smtp.gmail.com";
        const port = Number(process.env.SMTP_PORT) || 587;
        return {
            type: "smtp",
            transporter: nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            })
        };
    }

    // 2. Check Resend SDK
    if (process.env.RESEND_API_KEY) {
        return {
            type: "resend",
            client: new Resend(process.env.RESEND_API_KEY)
        };
    }

    // 3. Fallback Dev Mode
    return { type: "dev" };
};

const getFromAddress = () => {
    if (process.env.EMAIL_FROM) {
        return process.env.EMAIL_FROM;
    }
    if (process.env.SMTP_USER) {
        return `"Empathezee" <${process.env.SMTP_USER}>`;
    }
    return '"Empathezee" <onboarding@resend.dev>';
};

/**
 * Core Mail Sender Engine
 */
const dispatchMail = async ({ to, subject, html }) => {
    const provider = getEmailProvider();
    const from = getFromAddress();

    if (provider.type === "smtp") {
        const info = await provider.transporter.sendMail({ from, to, subject, html });
        logger.info(`Email sent via SMTP (${process.env.SMTP_HOST || 'Gmail'}) to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId, provider: "smtp" };
    }

    if (provider.type === "resend") {
        const response = await provider.client.emails.send({ from, to, subject, html });
        logger.info(`Email sent via Resend to ${to}: ${JSON.stringify(response)}`);
        return { success: true, data: response, provider: "resend" };
    }

    // Dev Mode Fallback
    logger.info(`[Dev Mode - Email Unconfigured] Simulated email to ${to} | Subject: "${subject}"`);
    return { success: true, devMode: true };
};

/**
 * Send Welcome Email to newly registered user/doctor
 */
const sendWelcomeEmail = async ({ email, username }) => {
    try {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Empathezee</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333333; }
                    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
                    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center; color: #ffffff; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
                    .header p { margin-top: 8px; color: #94a3b8; font-size: 15px; }
                    .content { padding: 40px 30px; line-height: 1.6; }
                    .greeting { font-size: 20px; font-weight: 600; color: #0f172a; margin-bottom: 15px; }
                    .feature-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 18px 20px; border-radius: 8px; margin: 25px 0; }
                    .feature-item { margin-bottom: 10px; font-size: 15px; display: flex; align-items: center; }
                    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; margin-top: 20px; }
                    .footer { background: #f1f5f9; padding: 25px 30px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Empathezee</h1>
                        <p>Compassionate Health & Supportive Community</p>
                    </div>
                    <div class="content">
                        <div class="greeting">Welcome aboard, ${username || 'Friend'}! 👋</div>
                        <p>Thank you for joining <strong>Empathezee</strong>. We are thrilled to have you as part of our health and wellness community.</p>
                        
                        <div class="feature-box">
                            <div class="feature-item">🌟 <strong>Connect with Peer Communities:</strong> Share experiences and find support.</div>
                            <div class="feature-item">🩺 <strong>Consult Verified Doctors:</strong> Book appointments and seek medical advice.</div>
                            <div class="feature-item">💊 <strong>Explore Medicine Resources:</strong> Access essential health info easily.</div>
                        </div>

                        <p>If you have any questions or need support, our team is always here to assist you.</p>

                        <div style="text-align: center;">
                            <a href="${process.env.BASE_URL || 'http://localhost:3000'}/dashboard" class="btn">Explore Your Dashboard</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Empathezee. All rights reserved.</p>
                        <p>You received this email because you signed up for an account on Empathezee.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await dispatchMail({
            to: email,
            subject: "Welcome to Empathezee - Your Healthcare & Community Platform! 🎉",
            html
        });
    } catch (error) {
        logger.error(`Error sending welcome email to ${email}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Send Thank You Email for Newsletter Subscription
 */
const sendSubscriptionEmail = async ({ email }) => {
    try {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Subscription Confirmed</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333333; }
                    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
                    .header { background: linear-gradient(135deg, #0d9488 0%, #115e59 100%); padding: 40px 30px; text-align: center; color: #ffffff; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
                    .header p { margin-top: 8px; color: #ccfbf1; font-size: 15px; }
                    .content { padding: 40px 30px; line-height: 1.6; }
                    .greeting { font-size: 20px; font-weight: 600; color: #0f172a; margin-bottom: 15px; }
                    .card { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 12px; margin: 20px 0; color: #166534; }
                    .footer { background: #f1f5f9; padding: 25px 30px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Empathezee Updates</h1>
                        <p>You're on the list!</p>
                    </div>
                    <div class="content">
                        <div class="greeting">Thank You for Subscribing! 🙌</div>
                        <p>We're glad to have you in our loop. You will now receive periodic updates, wellness tips, and major announcements from the Empathezee platform.</p>

                        <div class="card">
                            💡 <strong>What to expect:</strong> We value your inbox and will only send meaningful, actionable health insights, community updates, and feature announcements.
                        </div>

                        <p>Have suggestions or need help? Feel free to reach out to us at any time.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Empathezee. All rights reserved.</p>
                        <p>Sent to ${email}. If you did not request this subscription, you can safely ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await dispatchMail({
            to: email,
            subject: "Thank You for Subscribing to Empathezee Updates! 📬",
            html
        });
    } catch (error) {
        logger.error(`Error sending subscription email to ${email}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Send Password Reset Email
 */
const sendPasswordResetEmail = async ({ email, resetToken }) => {
    try {
        const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset Request</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333333; }
                    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
                    .header { background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 40px 30px; text-align: center; color: #ffffff; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
                    .header p { margin-top: 8px; color: #fecdd3; font-size: 15px; }
                    .content { padding: 40px 30px; line-height: 1.6; }
                    .greeting { font-size: 20px; font-weight: 600; color: #0f172a; margin-bottom: 15px; }
                    .btn { display: inline-block; background: #e11d48; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; margin-top: 20px; }
                    .footer { background: #f1f5f9; padding: 25px 30px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                        <p>Empathezee Security</p>
                    </div>
                    <div class="content">
                        <div class="greeting">Hello,</div>
                        <p>You requested a password reset for your Empathezee account. Please click the button below to reset your password. This link is valid for 15 minutes.</p>

                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="btn">Reset Password</a>
                        </div>
                        <p style="margin-top: 25px; font-size: 14px; color: #64748b;">If you didn't request a password reset, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Empathezee. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await dispatchMail({
            to: email,
            subject: "Reset Your Empathezee Password 🔐",
            html
        });
    } catch (error) {
        logger.error(`Error sending password reset email to ${email}:`, error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendWelcomeEmail,
    sendSubscriptionEmail,
    sendPasswordResetEmail
};
