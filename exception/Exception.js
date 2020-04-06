/**
 * Exception
 */

class Exception extends Error {

    /**
     * @param status {int} - from http-status-codes
     * @param message {string} - what was wrong
     * @param cause {Error|null} - error that cause this Exception (if none, cause will be null)
     */
    constructor(status, message, cause = null) {
        super();
        this.status = status;
        this.message = message;
        this.cause = cause;
    }

    getStatus() {
        return this.status;
    }

    getMessage() {
        return this.message;
    }

    getCause() {
        return this.cause;
    }
}

module.exports = Exception;