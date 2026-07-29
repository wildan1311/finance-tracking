import { Response } from "@/modules/shared/Response";

class ResponseMaker {
    static makeResponse<T = unknown>(status: boolean, message: string, errors?: Record<string, any>, data?: T, values?: Record<string, any>): Response<T> {
        return {
            status,
            message,
            errors,
            data,
            values,
        };
    }

    static makeSuccessResponse<T = unknown>(message: string, data?: T): Response<T> {
        return this.makeResponse(true, message, undefined, data);
    }

    static makeErrorResponse<T = unknown>(message: string, errors?: Record<string, any>, data?: T): Response<T> {
        return this.makeResponse(false, message, errors, data);
    }

    static makeUnauthorizedResponse(message: string): Response {
        return this.makeResponse(false, message, undefined);
    }

    static makeNotFoundResponse(message: string): Response {
        return this.makeResponse(false, message, undefined);
    }

    static makeInternalServerErrorResponse(message: string, errors?: Record<string, any>): Response {
        return this.makeResponse(false, message, errors);
    }

    static makeValidationErrorResponse(message: string, errors?: Record<string, any>, values?: Record<string, any>): Response {
        return this.makeResponse(false, message, errors, undefined, values);
    }
}

export default ResponseMaker;