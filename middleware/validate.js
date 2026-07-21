const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (err) {
        // Map zod errors to a readable string
        const errorMessages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return next(new AppError(errorMessages, 400));
    }
};

module.exports = validate;
