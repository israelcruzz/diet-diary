import "reflect-metadata"
import { Registry } from "@kernel/di/Registry";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapter";
import { ConfirmForgotPassword } from "@application/controlllers/auth/ConfirmForgotPasswordController";

const controller = Registry.getInstance().resolve(ConfirmForgotPassword);
export const handler = lambdaHttpAdapter(controller);
