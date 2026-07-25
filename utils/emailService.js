const { Resend } = require("resend");
const mongoose = require("mongoose");
const logger = require("./logger");
const User = require("../models/User");
const Subscriber = require("../models/Subscriber");

/**
 * Universal Centralized Frontend URL
 */
const getFrontendUrl = () => {
    let url = process.env.FRONTEND_URL || process.env.APP_URL || 'https://empathezee.vercel.app';
    return url.replace(/\/$/, '');
};

/**
 * Universal Resend API Client
 */
const getResendClient = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
        return new Resend(apiKey);
    }
    return null;
};

const getFromAddress = () => {
    return process.env.EMAIL_FROM || '"Empathezee" <onboarding@resend.dev>';
};

/**
 * Core Universal Mail Dispatch Engine
 */
const dispatchMail = async ({ to, subject, html, text }) => {
    const resend = getResendClient();
    const from = getFromAddress();
    const frontendUrl = getFrontendUrl();

    // Standard Universal Headers
    const headers = {
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        'Auto-Submitted': 'auto-generated',
        'List-Unsubscribe': `<${frontendUrl}/unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
    };

    if (!resend) {
        logger.warn(`[Resend Unconfigured] Simulated dispatch to ${to} | Subject: "${subject}"`);
        return { success: true, devMode: true };
    }

    try {
        const response = await resend.emails.send({
            from,
            to,
            subject,
            html,
            text,
            headers
        });

        if (response.error) {
            logger.error(`❌ Resend API Error for ${to}: ${JSON.stringify(response.error)}`);
            return { success: false, error: response.error };
        }

        logger.info(`✅ Email dispatched via Resend API to ${to}: ${JSON.stringify(response)}`);
        return { success: true, data: response, provider: "resend" };
    } catch (err) {
        logger.error(`❌ Resend SDK Exception for ${to}:`, err);
        return { success: false, error: err.message };
    }
};

/**
 * EMAIL 1: Universal First-Time Registration Welcome Email
 * Sent universally to any user signing up for the first time.
 */
const sendWelcomeEmail = async ({ user, email, username }) => {
    try {
        const targetEmail = user?.email || email;
        const targetUsername = user?.username || username || 'Friend';

        if (!targetEmail) return { success: false, reason: 'No email provided' };

        // Check if welcome email was already sent (Idempotent for all users)
        let dbUser = user;
        if ((!dbUser || typeof dbUser.save !== 'function') && mongoose.connection.readyState === 1) {
            dbUser = await User.findOne({ email: targetEmail.toLowerCase() });
        }

        if (dbUser) {
            if (dbUser.welcomeEmailSent) {
                logger.info(`[Welcome Email Skipped] Already sent to ${targetEmail}`);
                return { success: true, skipped: true, reason: 'Already sent' };
            }
            if (dbUser.emailNotifications === false) {
                logger.info(`[Welcome Email Skipped] Notifications disabled for ${targetEmail}`);
                return { success: true, skipped: true, reason: 'Notifications disabled' };
            }
        }

        const frontendUrl = getFrontendUrl(); // https://empathezee.vercel.app
        const dashboardUrl = `${frontendUrl}/dashboard`; // https://empathezee.vercel.app/dashboard

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="light">
                <title>Welcome to Empathezee</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
                    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
                    .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
                    .header p { margin-top: 8px; color: #94a3b8; font-size: 14px; margin-bottom: 0; }
                    .content { padding: 36px 30px; line-height: 1.6; }
                    .greeting { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
                    .feature-box { background: #f1f5f9; border-left: 4px solid #2563eb; padding: 18px; border-radius: 8px; margin: 24px 0; }
                    .feature-item { margin-bottom: 10px; font-size: 14px; color: #334155; }
                    .feature-item:last-child { margin-bottom: 0; }
                    .btn-wrapper { text-align: center; margin-top: 28px; margin-bottom: 10px; }
                    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600; font-size: 15px; }
                    .footer { background: #f8fafc; padding: 24px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Empathezee</h1>
                        <p>Compassionate Healthcare & Supportive Peer Community</p>
                    </div>
                    <div class="content">
                        <div class="greeting">Welcome aboard, ${targetUsername}! 👋</div>
                        <p>Thank you for joining <strong>Empathezee</strong>. We are thrilled to have you as part of our health and wellness community.</p>
                        
                        <div class="feature-box">
                            <div class="feature-item">🌟 <strong>Connect with Peer Communities:</strong> Share experiences and find support with verified members.</div>
                            <div class="feature-item">🩺 <strong>Consult Verified Doctors:</strong> Schedule appointments and seek professional medical guidance.</div>
                            <div class="feature-item">💊 <strong>Explore Medicine Resources:</strong> Access essential health information with ease.</div>
                        </div>

                        <p>If you ever have any questions or feedback, our support team is always here for you.</p>

                        <div class="btn-wrapper">
                            <a href="${dashboardUrl}" class="btn">Explore Your Dashboard</a>
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

        const text = `
Welcome to Empathezee, ${targetUsername}!

Thank you for joining Empathezee. We are thrilled to have you as part of our health and wellness community.

What you can do on Empathezee:
- Connect with Peer Communities
- Consult Verified Doctors
- Explore Medicine Resources

Access your dashboard here: ${dashboardUrl}

© ${new Date().getFullYear()} Empathezee. All rights reserved.
        `.trim();

        const result = await dispatchMail({
            to: targetEmail,
            subject: "Welcome to Empathezee - Healthcare & Support Community! 🎉",
            html,
            text
        });

        if (result.success) {
            if (dbUser && typeof dbUser.save === 'function') {
                dbUser.welcomeEmailSent = true;
                await dbUser.save();
            } else if (mongoose.connection.readyState === 1) {
                await User.updateOne({ email: targetEmail.toLowerCase() }, { welcomeEmailSent: true });
            }
        }

        return result;
    } catch (error) {
        logger.error(`Error sending welcome email to ${email}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * EMAIL 2: Universal Newsletter / Subscriber Updates Email
 * Sent universally to any user subscribing to updates.
 */
const sendSubscriptionEmail = async ({ email }) => {
    try {
        const cleanEmail = email.toLowerCase().trim();

        if (mongoose.connection.readyState === 1) {
            const subscriber = await Subscriber.findOne({ email: cleanEmail });
            if (subscriber && subscriber.status === 'unsubscribed') {
                logger.info(`[Subscription Email Skipped] Subscriber ${cleanEmail} is unsubscribed.`);
                return { success: true, skipped: true, reason: 'Unsubscribed' };
            }
        }

        const frontendUrl = getFrontendUrl(); // https://empathezee.vercel.app

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="light">
                <title>Subscription Confirmed</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
                    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                    .header { background: linear-gradient(135deg, #0d9488 0%, #115e59 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
                    .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
                    .header p { margin-top: 8px; color: #ccfbf1; font-size: 14px; margin-bottom: 0; }
                    .content { padding: 36px 30px; line-height: 1.6; }
                    .greeting { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
                    .card { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 18px; border-radius: 10px; margin: 20px 0; color: #166534; font-size: 14px; }
                    .btn-wrapper { text-align: center; margin-top: 24px; margin-bottom: 10px; }
                    .btn { display: inline-block; background: #0d9488; color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600; font-size: 15px; }
                    .footer { background: #f8fafc; padding: 24px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Empathezee Updates</h1>
                        <p>Subscription Confirmed</p>
                    </div>
                    <div class="content">
                        <div class="greeting">Thank You for Subscribing! 🙌</div>
                        <p>We are glad to have you in our community loop. You will now receive meaningful healthcare insights, wellness tips, and major updates from Empathezee.</p>

                        <div class="card">
                            💡 <strong>What to expect:</strong> We value your inbox. We only send relevant, actionable health guidance and community news.
                        </div>

                        <div class="btn-wrapper">
                            <a href="${frontendUrl}" class="btn">Visit Empathezee</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Empathezee. All rights reserved.</p>
                        <p>Sent to ${cleanEmail}. Unsubscribe: ${frontendUrl}/unsubscribe</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const text = `
Thank You for Subscribing to Empathezee Updates!

We are glad to have you in our loop. You will now receive periodic updates, wellness tips, and major announcements from the Empathezee platform.

What to expect: We value your inbox and will only send meaningful, actionable health insights and community updates.

Visit Empathezee: ${frontendUrl}

© ${new Date().getFullYear()} Empathezee. All rights reserved.
Sent to ${cleanEmail}. Unsubscribe: ${frontendUrl}/unsubscribe
        `.trim();

        return await dispatchMail({
            to: cleanEmail,
            subject: "Thank You for Subscribing to Empathezee Updates! 📬",
            html,
            text
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
        const frontendUrl = getFrontendUrl();
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="light">
                <title>Password Reset Request</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
                    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                    .header { background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
                    .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
                    .header p { margin-top: 8px; color: #fecdd3; font-size: 14px; margin-bottom: 0; }
                    .content { padding: 36px 30px; line-height: 1.6; }
                    .greeting { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
                    .btn-wrapper { text-align: center; margin-top: 28px; margin-bottom: 10px; }
                    .btn { display: inline-block; background: #e11d48; color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600; font-size: 15px; }
                    .footer { background: #f8fafc; padding: 24px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                        <p>Empathezee Account Security</p>
                    </div>
                    <div class="content">
                        <div class="greeting">Hello,</div>
                        <p>You requested a password reset for your Empathezee account. Please click the button below to reset your password. This link is valid for 15 minutes.</p>

                        <div class="btn-wrapper">
                            <a href="${resetUrl}" class="btn">Reset Password</a>
                        </div>
                        <p style="margin-top: 24px; font-size: 13px; color: #64748b;">If you didn't request a password reset, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Empathezee. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const text = `
Password Reset Request - Empathezee

You requested a password reset for your Empathezee account. Please use the link below to reset your password (valid for 15 minutes):

${resetUrl}

If you did not request a password reset, you can safely ignore this message.

© ${new Date().getFullYear()} Empathezee. All rights reserved.
        `.trim();

        return await dispatchMail({
            to: email,
            subject: "Reset Your Empathezee Password 🔐",
            html,
            text
        });
    } catch (error) {
        logger.error(`Error sending password reset email to ${email}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Send Generic Notification Email to User or Subscriber
 */
const sendNotificationEmail = async ({ to, subject, title, message, actionUrl, actionText }) => {
    try {
        const frontendUrl = getFrontendUrl();
        const targetUrl = actionUrl || `${frontendUrl}/dashboard`;
        const btnText = actionText || 'View Notification';

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="light">
                <title>${title || 'Notification from Empathezee'}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
                    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
                    .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
                    .header p { margin-top: 8px; color: #bfdbfe; font-size: 14px; margin-bottom: 0; }
                    .content { padding: 36px 30px; line-height: 1.6; }
                    .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
                    .btn-wrapper { text-align: center; margin-top: 28px; margin-bottom: 10px; }
                    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600; font-size: 15px; }
                    .footer { background: #f8fafc; padding: 24px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Empathezee Notification</h1>
                        <p>Stay Connected & Informed</p>
                    </div>
                    <div class="content">
                        <div class="title">${title || 'Notification'}</div>
                        <p>${message}</p>

                        <div class="btn-wrapper">
                            <a href="${targetUrl}" class="btn">${btnText}</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Empathezee. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const text = `
Empathezee Notification: ${title || 'Update'}

${message}

View details: ${targetUrl}

© ${new Date().getFullYear()} Empathezee. All rights reserved.
        `.trim();

        return await dispatchMail({
            to,
            subject: subject || title || "Empathezee Notification 🔔",
            html,
            text
        });
    } catch (error) {
        logger.error(`Error sending notification email to ${to}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Broadcast Notification to All Active Subscribers and Users with Notifications Turned ON
 */
const notifyAllSubscribersAndUsers = async ({ subject, title, message, actionUrl, actionText }) => {
    try {
        let activeSubscribers = [];
        let activeUsers = [];

        if (mongoose.connection.readyState === 1) {
            activeSubscribers = await Subscriber.find({ status: "active" }).select("email");
            activeUsers = await User.find({ emailNotifications: { $ne: false } }).select("email");
        }

        const emailSet = new Set();
        activeSubscribers.forEach(s => s.email && emailSet.add(s.email.toLowerCase()));
        activeUsers.forEach(u => u.email && emailSet.add(u.email.toLowerCase()));

        const recipientList = Array.from(emailSet);
        logger.info(`Broadcasting notification to ${recipientList.length} active recipients...`);

        const results = [];
        for (const recipient of recipientList) {
            const res = await sendNotificationEmail({
                to: recipient,
                subject,
                title,
                message,
                actionUrl,
                actionText
            });
            results.push({ recipient, ...res });
        }

        return { success: true, count: recipientList.length, results };
    } catch (error) {
        logger.error("Error broadcasting notifications:", error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getFrontendUrl,
    dispatchMail,
    sendWelcomeEmail,
    sendSubscriptionEmail,
    sendPasswordResetEmail,
    sendNotificationEmail,
    notifyAllSubscribersAndUsers
};
