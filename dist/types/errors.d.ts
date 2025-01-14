export declare const APIErrorCodes: Record<string, {
    name: string;
    retryable: boolean;
}>;
export declare type APIError = Error & {
    code: number;
    isWSFailure?: boolean;
};
export declare function isAPIError(error: Error): error is APIError;
export declare function isErrorRetryable(error: APIError): boolean;
export declare function isConnectionIDError(error: APIError): boolean;
export declare function isWSFailure(err: APIError): boolean;
//# sourceMappingURL=errors.d.ts.map