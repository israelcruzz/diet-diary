import "reflect-metadata"
import { Registry } from "@kernel/di/Registry";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapter";
import { RefreshTokenController } from "@application/controlllers/auth/RefreshTokenController";

const controller = Registry.getInstance().resolve(RefreshTokenController);
export const handler = lambdaHttpAdapter(controller);
