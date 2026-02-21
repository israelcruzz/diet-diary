import { Registry } from "@kernel/di/Registry"
import { Constructor } from "@main/adapters/lambdaHttpAdapter"

export const Injectable = (deps?: Constructor[]): ClassDecorator => {
    return (target: any) => {
        Registry.getInstance().register(target, deps)
    }
}