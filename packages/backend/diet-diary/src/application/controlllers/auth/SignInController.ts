import { BaseController, Controller, Response } from "@application/contracts/Controller";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@infra/clients/cognitoClient";
import { Injectable } from "@kernel/decorators/Injectable";
import { Schema } from "@kernel/decorators/Schema";
import { schema } from "@application/controlllers/auth/schemas/signInSchema";

@Schema(schema)
@Injectable()
export class SignInController extends BaseController<"public"> {
  protected override async handler(request: Controller.Request<"public">): Promise<Response> {
    try {
      const { email, password } = request.body;

      const command = new InitiateAuthCommand({
        ClientId: process.env.USER_POOL_CLIENT_ID,
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: email as string,
          PASSWORD: password as string
        }
      })

      const { AuthenticationResult } = await cognitoClient.send(command)

      return {
        body: {
          accessToken: AuthenticationResult?.AccessToken,
          refreshToken: AuthenticationResult?.RefreshToken,
          idToken: AuthenticationResult?.IdToken
        },
        statusCode: 200
      }
    } catch (error) {
      throw error
    }
  }
}
