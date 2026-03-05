import { AdminDeleteUserCommand, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@infra/clients/cognitoClient";

class AuthGateway {
  private CLIENT_ID = process.env.USER_POOL_CLIENT_ID
  private POOL_ID = process.env.USER_POOL_ID

  public async signUp (input: AuthGateway.SignUpInput): Promise<AuthGateway.SignUpOutput> {
    const {
      email,
      password
    } = input;

    const command = new SignUpCommand({
      ClientId: this.CLIENT_ID,
      Username: email,
      Password: password
    });

    const { UserSub } = await cognitoClient.send(command);

    return UserSub;
  }

  public async signIn (input: AuthGateway.SignUpInput): Promise<AuthGateway.SignInOutput> {
    const {
      email,
      password
    } = input;

    const command = new InitiateAuthCommand({
      ClientId: this.CLIENT_ID,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    })

    const { AuthenticationResult } = await cognitoClient.send(command);

    const result = {
      accessToken: AuthenticationResult?.AccessToken,
      refreshToken: AuthenticationResult?.RefreshToken
    }

    return result;
  }

  public async deleteUser (input: AuthGateway.DeleteUserInput): Promise<AuthGateway.DeleteUserOutput> {
    const {
      userId
    } = input;

    const command = new AdminDeleteUserCommand({
      UserPoolId: this.POOL_ID,
      Username: userId
    });

    await cognitoClient.send(command);
  }
}

export default new AuthGateway();

export namespace AuthGateway {
  export type SignUpInput = {
    email: string;
    password: string;
  }

  export type SignUpOutput = string | undefined

  export type SignInInput = {
    email: string;
    password: string;
  }

  export type SignInOutput = {
    accessToken: string | undefined;
    refreshToken: string | undefined;
  }

  export type DeleteUserInput = {
    userId: string;
  }

  export type DeleteUserOutput = void
}
