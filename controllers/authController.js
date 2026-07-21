const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';

const signAccessToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = async (user, ipAddress) => {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
        token,
        user: user._id,
        expiresAt,
        createdByIp: ipAddress
    });

    return token;
};

const sendTokenResponse = async (user, statusCode, req, res) => {
    const accessToken = signAccessToken(user._id, user.role);
    const refreshToken = await generateRefreshToken(user, req.ip);

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    user.password = undefined; // Don't send password in output

    res.status(statusCode).json({
        success: true,
        accessToken,
        user
    });
};

const register = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
        return next(new AppError('Email already in use', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        otp,
        otpExpire,
        isVerified: false
    });

    // TODO: Use nodemailer to send OTP via email here

    res.status(201).json({ success: true, message: "User registered. Please verify your email with the OTP sent.", userId: user._id });
});

const verifyEmail = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return next(new AppError('User not found', 404));
    if (user.isVerified) return next(new AppError('Already verified', 400));
    if (user.otp !== otp || user.otpExpire < Date.now()) return next(new AppError('Invalid or expired OTP', 400));

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    await sendTokenResponse(user, 200, req, res);
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Invalid email or password', 401));
    }

    if (!user.isVerified) {
        return next(new AppError('Please verify your email first', 403));
    }

    await sendTokenResponse(user, 200, req, res);
});

const refreshToken = catchAsync(async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) return next(new AppError('No refresh token provided', 401));

    const activeToken = await RefreshToken.findOne({ token }).populate('user');
    
    if (!activeToken || !activeToken.user) {
        return next(new AppError('Invalid refresh token', 401));
    }

    if (activeToken.revoked || activeToken.expiresAt < Date.now()) {
        return next(new AppError('Expired or revoked token', 401));
    }

    // Revoke current token
    activeToken.revoked = true;
    await activeToken.save();

    // Issue new tokens
    await sendTokenResponse(activeToken.user, 200, req, res);
});

const logout = catchAsync(async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (token) {
        await RefreshToken.findOneAndUpdate({ token }, { revoked: true });
    }
    res.cookie('refreshToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

const forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return next(new AppError('No user found with that email', 404));

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // TODO: nodemailer send resetToken to user's email

    res.status(200).json({ success: true, message: "Token sent to email" });
});

const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) return next(new AppError('Token is invalid or has expired', 400));

    user.password = await bcrypt.hash(req.body.password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await sendTokenResponse(user, 200, req, res);
});

module.exports = { register, verifyEmail, login, refreshToken, logout, forgotPassword, resetPassword };
