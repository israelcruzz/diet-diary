import { BaseController, Controller } from "@application/contracts/Controller";
import { Schema } from "@kernel/decorators/Schema";
import { APIGatewayProxyResultV2 } from "aws-lambda";
import z from "zod";

const schema = z.object({
    name: z.string()
})

@Schema(schema)
export class HelloController extends BaseController<"public"> {
    override async handler(request: Controller.Request<"public">): Promise<APIGatewayProxyResultV2> {
        try {
            return {
                statusCode: 200
            }
        } catch (error) {
            throw new Error("")
        }
    }
}