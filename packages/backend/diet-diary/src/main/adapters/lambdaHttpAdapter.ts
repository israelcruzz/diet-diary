import { BaseController, Controller } from "@application/contracts/Controller"
import { lambdaBodyParser } from "@main/utils/lambdaBodyParser"
import { lambdaErrorResponse } from "@main/utils/lambdaErrorResponse"
import { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda"
import { ZodError } from "zod"

export type Event = APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer
export type Constructor<T = any> = new (...args: any) => T

export const lambdaHttpAdapter = (controller: Constructor) => {
    return async (event: Event) => {
        try {
            const httpController = controller as unknown as BaseController<any>

            const bodyParsed: Record<string, unknown> = lambdaBodyParser(event.body)
            const queryParams: Record<string, unknown> = event.queryStringParameters ?? {}
            const pathParameters: Record<string, unknown> = event.pathParameters ?? {}

            const request = {
                body: bodyParsed,
                queryParams,
                pathParameters
            }

            const httpResponse = await httpController.execute(request as unknown as Controller.Request<"public">)

            return JSON.stringify(httpResponse)
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error(error)
            }

            if (error instanceof ZodError) {
                console.log(error)
                return lambdaErrorResponse({
                    statusCode: 400,
                    code: "SCHEMA_VALIDATION_FAILED",
                    issues: error.issues,
                    message: error.message
                })
            }
            // TODO: error handler / log service
        }
    }
}