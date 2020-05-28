class AppError {
    public message: string;

    public statusCode: number;

    constructor(message: string, statusError = 400) {
        this.message = message;
        this.statusCode = statusError;
    }
}

export default AppError;
