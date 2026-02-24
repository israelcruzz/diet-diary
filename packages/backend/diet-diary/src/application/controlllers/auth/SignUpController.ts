import { BaseController, Controller, Response } from "@application/contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { Schema } from "@kernel/decorators/Schema";
import { schema } from "@application/controlllers/auth/schemas/signUpSchema";
import { InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@infra/clients/cognitoClient";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import ksuid from "ksuid";
import { dynamoDbClient } from "@infra/clients/dynamoClient";

@Schema(schema)
@Injectable()
export class SignUpController extends BaseController<"public"> {
  override async handler(request: Controller.Request<"public">): Promise<Response> {
    try {
      const { email, password } = request.body;

      const getAccountCommand = new QueryCommand({
        TableName: process.env.MAIN_TABLE_NAME,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :email",
        ExpressionAttributeValues: {
          ":email": `ACCOUNT#${email}`
        }
      })

      const { Items } = await dynamoDbClient.send(getAccountCommand)

      if (Items && Items.length > 0) {
        return {
          statusCode: 400,
          body: {
            message: "Email already in use"
          }
        }
      }

      const cognitoSignUpCommand = new SignUpCommand({
        ClientId: process.env.USER_POOL_CLIENT_ID,
        Username: email as string,
        Password: password as string
      })

      const { UserSub } = await cognitoClient.send(cognitoSignUpCommand)

      const randomKsuid = await ksuid.random()
      const userId = randomKsuid.string

      // const createAccount = new PutCommand({
      //   TableName: process.env.MAIN_TABLE_NAME,
      //   ExpressionAttributeNames: {
      //     "#type": "type",
      //     "#id": "id",
      //     "#email": "email",
      //     "#externalId": "externalId"
      //   },
      //   ExpressionAttributeValues: {
      //       ":account": "account",
      //       ":userId": userId,
      //       ":email": email,
      //       ":externalId": UserSub
      //   },
      //   Item: {
      //     PK: `ACCOUNT#${UserSub}`,
      //     SK: `ACCOUNT#${UserSub}`,
      //     GSI1PK: `ACCOUNT#${email}`,
      //     GSI1SK: `ACCOUNT#${UserSub}`,

      //     "#type": ":account",
      //     "#id": ":userId",
      //     "#email": ":email",
      //     "#externalId": ":externalId"
      //   }
      // })

      const createAccount = new PutCommand({
        TableName: process.env.MAIN_TABLE_NAME,
        Item: {
          PK: `ACCOUNT#${UserSub}`,
          SK: `ACCOUNT#${UserSub}`,
          GSI1PK: `ACCOUNT#${email}`,
          GSI1SK: `ACCOUNT#${UserSub}`,
          type: "account",
          id: userId,
          email: email,
          externalId: UserSub
        }
      })

      await dynamoDbClient.send(createAccount)

      const cognitoSignInCommand = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.USER_POOL_CLIENT_ID,
        AuthParameters: {
          USERNAME: email as string,
          PASSWORD: password as string
        }
      })

      const { AuthenticationResult } = await cognitoClient.send(cognitoSignInCommand)

      return {
        statusCode: 201,
        body: {
          accessToken: AuthenticationResult?.AccessToken,
          refreshToken: AuthenticationResult?.RefreshToken
        }
      }
    } catch (error) {
      console.error("[SignUpController.handler]" + error)
      return {
        statusCode: 500,
        body: {
          message: "Internal server error"
        }
      }
    }
  }
}
