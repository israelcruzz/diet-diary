import "reflect-metadata"
import { Registry } from "@kernel/di/Registry";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapter";
import { SignInController } from "@application/controlllers/auth/SignInController";

const controller = Registry.getInstance().resolve(SignInController);
export const handler = lambdaHttpAdapter(controller);
