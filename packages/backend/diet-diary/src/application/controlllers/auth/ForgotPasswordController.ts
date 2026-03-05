import { BaseController, Controller, Response } from "@application/contracts/Controller";
import { ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@infra/clients/cognitoClient";
import { Injectable } from "@kernel/decorators/Injectable";
import { Schema } from "@kernel/decorators/Schema";
import { schema } from "@application/controlllers/auth/schemas/forgotPasswordSchema";

@Schema(schema)
@Injectable()
export class ForgotPasswordController extends BaseController<"public"> {
  protected override async handler(request: Controller.Request<"public">): Promise<Response> {
    try {
      const { email } = request.body;

      const command = new ForgotPasswordCommand({
        ClientId: process.env.USER_POOL_CLIENT_ID,
        Username: email as string
      })

      await cognitoClient.send(command)

      return {
        body: {
          message: `Email was sended to ${email}`
        },
        statusCode: 200
      }
    } catch (error) {
      throw error
    }
  }
}
