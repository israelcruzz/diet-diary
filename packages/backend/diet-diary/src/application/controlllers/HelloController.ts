import { BaseController, Controller } from "@application/contracts/Controller";
import { APIGatewayProxyResultV2 } from "aws-lambda";

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