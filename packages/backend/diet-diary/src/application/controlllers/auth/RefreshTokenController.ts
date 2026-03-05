import { BaseController, Controller, Response } from "@application/contracts/Controller";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@infra/clients/cognitoClient";
import { Schema } from "@kernel/decorators/Schema";
import { schema } from "@application/controlllers/auth/schemas/refreshTokenSchema";
import { Injectable } from "@kernel/decorators/Injectable";

@Schema(schema)
@Injectable()
export class RefreshTokenController extends BaseController<"public"> {
  protected override async handler(request: Controller.Request<"public">): Promise<Response> {
    try {
      const { refreshToken } = request.body;

      const command = new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: process.env.USER_POOL_CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken as string
        }
      })

      const { AuthenticationResult } = await cognitoClient.send(command);

      return {
        statusCode: 200,
        body: {
          accessToken: AuthenticationResult?.AccessToken,
          refreshToken: AuthenticationResult?.RefreshToken
        }
      }
    } catch (error) {
      throw error
    }
  }
}
