export type LambdaErrorResponseInput = {
    statusCode: number
    code: string
    message: string
    issues: unknown
}

export const lambdaErrorResponse = (input: LambdaErrorResponseInput) => {
    const {
        statusCode = 500,
        code = "INTERNAL_SERVER_ERROR",
        issues,
        message = "Internal Server Error"
    } = input

    return {
        statusCode,
        body: {
            code,
            issues,
            message
        }
    }
}