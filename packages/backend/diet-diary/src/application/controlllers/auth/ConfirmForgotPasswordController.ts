import { BaseController, Controller, Response } from "@application/contracts/Controller";
import { Schema } from "@kernel/decorators/Schema";
import { schema } from "@application/controlllers/auth/schemas/confirmForgotPasswordSchema";
import { Injectable } from "@kernel/decorators/Injectable";
import { ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@infra/clients/cognitoClient";

@Schema(schema)
@Injectable()
export class ConfirmForgotPassword extends BaseController<"public"> {
  protected override async handler(request: Controller.Request<"public">): Promise<Response> {
    try {
      const { email, password, confirmationCode } = request.body;

      const command = new ConfirmForgotPasswordCommand({
        ClientId: process.env.USER_POOL_CLIENT_ID,
        ConfirmationCode: confirmationCode as string,
        Password: password as string,
        Username: email as string
      });

      await cognitoClient.send(command);

      return {
        statusCode: 200,
        body: {
          message: "Your password was changed"
        }
      }
    } catch (error) {
      throw error
    }
  }
}
