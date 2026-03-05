import z from "zod";
import AuthGateway from "@infra/gateways/AuthGateway";
import AccountRepository from "@infra/repositories/AccountRepository";
import { BaseController, Controller, Response } from "@application/contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { Schema } from "@kernel/decorators/Schema";
import { accountSchema, profileSchema, schema } from "@application/controlllers/auth/schemas/signUpSchema";
import { Account } from "@application/entities/Account";
import { ulid } from "ulid";
import { Profile } from "@application/entities/Profile";
import { GoalCalculator } from "@application/services/GoalCalculator";
import { Goal } from "@application/entities/Goal";
import { Saga } from "@shared/saga/Saga";
import { SignUpUow } from "@shared/uow/SignUpUow";

@Schema(schema)
@Injectable()
export class SignUpController extends BaseController<"public"> {
  private readonly saga: Saga = new Saga();

  override async handler(request: Controller.Request<"public">): Promise<Response> {
    return await this.saga.run<Response>(async () => {
      const body = request.body as z.infer<typeof schema>;

      const { email, password } = body.account as unknown as z.infer<typeof accountSchema>;
      const { goal: profileGoal } = body.account as unknown as z.infer<typeof profileSchema>;

      const { Items } = await AccountRepository.findByEmail(email);

      if (Items && Items.length > 0) {
        return {
          statusCode: 400,
          body: {
            message: "Email already in use"
          }
        }
      }
      const userSub = await AuthGateway.signUp({
        email,
        password
      })

      if (!userSub) {
        return {
          statusCode: 500,
          body: {
            message: "Internal Server Error"
          }
        }
      }

      this.saga.addCompensate(() => AuthGateway.deleteUser({ userId: userSub }))

      const userId = ulid()

      const account = new Account({
        email: email as string,
        externalId: userSub as string,
        id: userId
      })

      const profile = new Profile({
        accountId: userId,
        ...body.profile
      })

      const goalCalculator = GoalCalculator.calculate(profile)

      const goal = new Goal({
        accountId: userId,
        goal: profileGoal,
        callories: goalCalculator.calories,
        carbohydrates: goalCalculator.carbohydrates,
        fats: goalCalculator.fats,
        proteins: goalCalculator.proteins
      })

      const signUpUow = new SignUpUow({
        account,
        goal,
        profile
      })

      await signUpUow.run()

      const { accessToken, refreshToken } = await AuthGateway.signIn({
        email,
        password
      })

      return {
        statusCode: 201,
        body: {
          accessToken,
          refreshToken
        }
      }
    })
  }
}
