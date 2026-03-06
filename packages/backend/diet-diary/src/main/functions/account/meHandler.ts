import "reflect-metadata";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapter";
import { Registry } from "@kernel/di/Registry";
import { MeController } from "@application/controlllers/account/MeController";

const controller = Registry.getInstance().resolve(MeController)
export const handler = lambdaHttpAdapter(controller)
