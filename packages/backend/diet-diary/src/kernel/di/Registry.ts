import "reflect-metadata"
import { Constructor } from "@main/adapters/lambdaHttpAdapter"

type Services = Map<string, { impl: Constructor; deps: Constructor[] }>

export class Registry {
    private static instance: Registry

    public static getInstance(): Registry {
        if (!Registry.instance) {
            Registry.instance = new Registry()
        }

        return Registry.instance
    }

    private services: Services = new Map()

    public register(impl: Constructor, deps?: Constructor[]) {
        const token = impl.name
        const existServiceWithSameToken = this.services.has(token)

        if (existServiceWithSameToken) {
            throw new Error(`Token ${token} already exists`)
        }

        // TODO: Get dependencies with Reflect
        // const paramtypes = Reflect.getMetadata("design:paramtypes", impl) ?? []
        // const deps: Constructor[] = paramtypes.filter(Boolean)

        this.services.set(token, {
            impl,
            deps: deps ?? []
        })
    }

    public resolve(impl: Constructor): any {
        const token = impl.name
        const service = this.services.get(token)

        if (!service) {
            throw new Error(`Not exists service for token: ${token}`)
        }


        const deps = service.deps.map((dep) => this.resolve(dep))
        const instance = new service.impl(...deps)

        return instance
    }
}