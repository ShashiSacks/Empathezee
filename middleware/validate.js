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
        const issues = err.issues || err.errors || [];
        if (issues.length > 0) {
            const errorMessages = issues
                .map((e) => {
                    const field = e.path.filter((p) => p !== 'body' && p !== 'query' && p !== 'params').join('.');
                    return field ? `${field}: ${e.message}` : e.message;
                })
                .join(', ');
            return next(new AppError(errorMessages, 400));
        }
        return next(err);
    }
};

module.exports = validate;
