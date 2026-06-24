const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    console.error("Error occurred:", err);

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    if (err.status) {
        statusCode = err.status;
    }
    
    let message = err.message || "Internal Server Error";

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(", ");
    }

    // Mongoose CastError (e.g. invalid ObjectId format)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid field path: ${err.path}`;
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
    }

    res.status(statusCode);

    if (req.accepts("html")) {
        return res.render("error", {
            title: `Error ${statusCode}`,
            statusCode,
            message,
            user: req.session?.user || null
        });
    }

    return res.json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

module.exports = {
    notFound,
    errorHandler
};
