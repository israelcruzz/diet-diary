import { BaseController, Controller } from "@application/contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { Schema } from "@kernel/decorators/Schema";
import { Registry } from "@kernel/di/Registry";
import { APIGatewayProxyResultV2 } from "aws-lambda";
import z from "zod";

const schema = z.object({
    name: z.string()
})

@Schema(schema)
@Injectable()
export class HelloController extends BaseController<"public"> {
    override async handler(request: Controller.Request<"public">): Promise<APIGatewayProxyResultV2> {
        return {
            statusCode: 200
        }
    }
}