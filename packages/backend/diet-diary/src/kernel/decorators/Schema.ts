import "reflect-metadata"
import z from "zod";

export const SCHEMA_METADATA_KEY = "custom:schema"

export function Schema(schema: z.ZodSchema): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(SCHEMA_METADATA_KEY, schema, target)
    }
}

export function getMetadata(target: any): z.ZodSchema | undefined {
    return Reflect.getMetadata(SCHEMA_METADATA_KEY, target.constructor)
}