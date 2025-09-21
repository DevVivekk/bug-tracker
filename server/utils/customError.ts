class customError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode || 500;

        // Ensure the stack trace is included
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, customError);
        }
    }
}

export default customError;
