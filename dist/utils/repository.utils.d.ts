export declare const PRISMA_ERROR: {
    readonly RECORD_NOT_FOUND: "P2025";
    readonly UNIQUE_CONSTRAINT_VIOLATION: "P2002";
    readonly FOREIGN_KEY_CONSTRAINT_VIOLATION: "P2003";
};
export declare function isPrismaError(error: unknown): error is {
    code: string;
    message: string;
};
export interface SuccessResult<T> {
    success: true;
    data: T;
}
export type ErrorType = "NOT_FOUND" | "DUPLICATE" | "IN_USE" | "FORBIDDEN" | "INVALID_REFERENCE" | "UNKNOWN";
export interface ErrorResult {
    success: false;
    error: ErrorType;
    statusCode: number;
    message: string;
}
export type RepositoryResult<T> = SuccessResult<T> | ErrorResult;
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}
export declare function createPaginationMeta(total: number, page: number, limit: number): PaginationMeta;
export declare function notFoundError(message: string): ErrorResult;
export declare function duplicateError(message: string): ErrorResult;
export declare function inUseError(message: string): ErrorResult;
export declare function unknownError(message: string, error: unknown): ErrorResult;
