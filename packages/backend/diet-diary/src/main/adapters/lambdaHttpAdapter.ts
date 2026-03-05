import { BaseController, Controller } from "@application/contracts/Controller"
import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import { dynamoDbClient } from "@infra/clients/dynamoClient"
import { AccountItem } from "@infra/database/dynamodb/items/AccountItem"
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

      let accountId = null

      if ('authorizer' in event.requestContext) {
        const sub = event.requestContext.authorizer?.jwt?.claims?.sub

        const command = new QueryCommand({
          TableName: process.env.MAIN_TABLE_NAME,
          IndexName: "GSI2",
          KeyConditionExpression: "GSI2PK = :gsi2pk",
          ExpressionAttributeValues: {
            ":gsi2pk": `ACCOUNT#${sub}`
          }
        })

        const { Items, Count } = await dynamoDbClient.send(command)

        if (Count === 0 || !Items) {
          return lambdaErrorResponse({
            code: "UNAUTHORIZED",
            message: "User not exists",
            statusCode: 401,
            issues: {}
          })
        }

        const account = Items[0] as AccountItem.ItemType

        accountId = account.id as string
      }

      const request = {
        body: bodyParsed,
        queryParams,
        pathParameters,
        ...(accountId && {
          accountId
        })
      }

      const httpResponse = await httpController.execute(request as unknown as Controller.Request<"public">)

      return JSON.stringify(httpResponse)
    } catch (error) {
      // if (process.env.NODE_ENV === "development") {
      console.error(error)
      // }

      if (error instanceof ZodError) {
        console.log(error)
        return lambdaErrorResponse({
          statusCode: 400,
          code: "SCHEMA_VALIDATION_FAILED",
          issues: error.issues,
          message: error.message
        })
      }

      return JSON.stringify({
        statusCode: 500,
        data: {
          message: "Internal Server Error",
          errorCode: "INTERNAL_SERVER_ERROR",
          issues: error
        }
      })
    }
  }
}
