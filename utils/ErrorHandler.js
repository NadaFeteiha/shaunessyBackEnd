export class ErrorHandler extends Error {
    constructor(message, statusCode, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleErrors = (err, req, res, next) => {
    // Log detailed error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('ERROR 💥', {
            message: err.message,
            stack: err.stack,
            statusCode: err.statusCode,
            errors: err.errors
        });
    }

    // Handle Joi validation errors
    if (err.details) {
        const errors = err.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return ResponseHandler.validationError(res, errors);
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
        return ResponseHandler.validationError(res, errors);
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return ResponseHandler.conflict(res, `${field} already exists`);
    }

    // Handle invalid ObjectId
    if (err.name === 'CastError') {
        return ResponseHandler.clientError(res, 'Invalid resource ID', 400);
    }

    // Handle operational errors
    if (err.isOperational) {
        return ResponseHandler.clientError(
            res,
            err.message,
            err.statusCode,
            err.errors
        );
    }

    // Unknown/generic errors
    c.serverError(res, 'Something went wrong', 500, err);
};