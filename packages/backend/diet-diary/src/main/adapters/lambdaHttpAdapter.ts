import { BaseController, Controller } from "@application/contracts/Controller"
import { lambdaBodyParser } from "@main/utils/lambdaBodyParser"
import { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda"

export type Event = APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer
export type Constructor<T = any> = new (...args: any) => T

export const lambdaHttpAdapter = (controller: Constructor) => {
    return async (event: Event) => {
        try {
            const httpController = new controller() as unknown as BaseController<any>

            const bodyParsed: Record<string, unknown> = lambdaBodyParser(event.body)
            const queryParams: Record<string, unknown> = event.queryStringParameters ?? {}
            const pathParameters: Record<string, unknown> = event.pathParameters ?? {}

            const request = {
                bodyParsed,
                queryParams,
                pathParameters
            }

            const httpResponse = await httpController.execute(request as unknown as Controller.Request<"public">)

            return JSON.stringify(httpResponse)
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error(error)
            }
            // TODO: error handler / log service
        }
    }
}