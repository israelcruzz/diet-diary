import { getMetadata } from "@kernel/decorators/Schema"
import { APIGatewayProxyResultV2 } from "aws-lambda"
import { ZodError } from "zod"

export type TRouteType = "private" | "public"

export namespace Controller {
    type BaseRequest<
        TBody = Record<string, unknown>,
        TParams = Record<string, unknown>,
        TQueryParams = Record<string, unknown>>
        = {
            body: TBody
            params: TParams
            queryParams: TQueryParams
        }

    type PublicRequest<
        TBody = Record<string, unknown>,
        TParams = Record<string, unknown>,
        TQueryParams = Record<string, unknown>>
        = BaseRequest<TBody, TParams, TQueryParams> & {
            accountId: null
        }

    type PrivateRequest<
        TBody = Record<string, unknown>,
        TParams = Record<string, unknown>,
        TQueryParams = Record<string, unknown>>
        = BaseRequest<TBody, TParams, TQueryParams> & {
            accountId: string
        }

    export type Request<
        TType extends TRouteType,
        TBody = Record<string, unknown>,
        TParams = Record<string, unknown>,
        TQueryParams = Record<string, unknown>
    > = TType extends "public" ? PublicRequest<TBody, TParams, TQueryParams> : PrivateRequest<TBody, TParams, TQueryParams>
}

export abstract class BaseController<TType extends TRouteType> {
    public async execute(request: Controller.Request<TType>) {
        const body = this.validateBody(request.body)

        return this.handler({
            ...request,
            body
        })
    }

    private validateBody(body: Controller.Request<"public">["body"]) {
        const schema = getMetadata(this)

        if (!schema) {
            return body
        }

        const validateBody = schema.safeParse(body)

        if (!validateBody.success) {
            throw new ZodError(validateBody.error.issues)
        }

        return validateBody.data
    }

    protected abstract handler(request: Controller.Request<TType>): Promise<APIGatewayProxyResultV2>
}