export const lambdaBodyParser = (body: string | undefined) => {
    try {
        if (!body) {
            return {}
        }

        const bodyParsed = JSON.parse(body) as Record<string, unknown>

        return bodyParsed
    } catch (error) {
        throw new Error("Malformed body")
    }
}