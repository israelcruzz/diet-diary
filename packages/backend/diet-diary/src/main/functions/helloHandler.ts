import "reflect-metadata"
import { HelloController } from "@application/controlllers/HelloController";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapter";
import { Registry } from "@kernel/di/Registry";

const controller = Registry.getInstance().resolve(HelloController)
export const handler = lambdaHttpAdapter(controller)