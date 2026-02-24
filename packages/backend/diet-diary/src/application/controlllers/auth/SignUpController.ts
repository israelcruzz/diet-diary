import { BaseController, Controller, Response } from "@application/contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { Schema } from "@kernel/decorators/Schema";
import { schema } from "@application/controlllers/auth/schemas/signUpSchema";
import { InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@infra/clients/cognitoClient";

@Schema(schema)
@Injectable()
export class SignUpController extends BaseController<"public"> {
    override async handler(request: Controller.Request<"public">): Promise<Response> {
        const { email, password } = request.body;

        const cognitoSignUpCommand = new SignUpCommand({
            ClientId: process.env.USER_POOL_CLIENT_ID,
            Username: email as string,
            Password: password as string
        })

        await cognitoClient.send(cognitoSignUpCommand)

        // TODO: Save in DynamoDB this account

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
    }
}