const { z } = require('zod');

const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters").max(30),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters")
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required")
    })
});

const verifyEmailSchema = z.object({
    body: z.object({
        email: z.string().email(),
        otp: z.string().length(6, "OTP must be 6 digits")
    })
});

const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format")
    })
});

const resetPasswordSchema = z.object({
    params: z.object({
        token: z.string()
    }),
    body: z.object({
        password: z.string().min(6, "Password must be at least 6 characters")
    })
});

module.exports = {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};
