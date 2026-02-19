import { HelloController } from "@application/controlllers/HelloController";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(HelloController)