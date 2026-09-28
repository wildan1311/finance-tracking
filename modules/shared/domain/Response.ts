interface Response<T = unknown> {
    status: boolean;
    message: string;
    data?: T;
    errors?: Record<string, any>;
    values?: Record<string, any>;
}

export type { Response }