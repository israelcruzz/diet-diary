import z from "zod";
import { BaseController, Controller } from "@application/contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { Schema } from "@kernel/decorators/Schema";
import { Response } from "@application/contracts/Controller";

const schema = z.object({
  name: z.string()
})

@Schema(schema)
@Injectable()
export class HelloController extends BaseController<"public"> {
  override async handler(request: Controller.Request<"public">): Promise<Response> {
    return {
      statusCode: 200
    }
  }
}
