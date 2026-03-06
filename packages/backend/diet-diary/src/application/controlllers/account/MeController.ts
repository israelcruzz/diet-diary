import { BaseController, Controller } from "@application/contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { Response } from "@application/contracts/Controller";
import GetGoalAndProfileQuery from "@infra/database/dynamodb/queries/GetGoalAndProfileQuery";

@Injectable()
export class MeController extends BaseController<"private"> {
  override async handler(request: Controller.Request<"private">): Promise<Response> {
    const accountId = request.accountId;

    const goalAndProfile = await GetGoalAndProfileQuery.execute(accountId);

    console.log(JSON.stringify(goalAndProfile))

    return {
      statusCode: 200
    }
  }
}
