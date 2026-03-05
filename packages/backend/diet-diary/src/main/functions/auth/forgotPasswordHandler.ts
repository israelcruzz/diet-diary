import "reflect-metadata"
import { Registry } from "@kernel/di/Registry";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapter";
import { ForgotPasswordController } from "@application/controlllers/auth/ForgotPasswordController";

const controller = Registry.getInstance().resolve(ForgotPasswordController);
export const handler = lambdaHttpAdapter(controller);
