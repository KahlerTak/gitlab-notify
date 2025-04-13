export default class ObjectSanitizer {
    public static sanitizeObject<T = any>(data: any, schema: T): T {
        const result: any = {};

        if(Array.isArray(schema)){
            return data.map((item: any) => ObjectSanitizer.sanitizeObject(item, schema[0]));
        }

        for (const key in schema) {
            if (!(key in data)) continue;

            const rule = schema[key];
            const value = data[key];

            if (typeof rule === "object" && typeof value === "object") {
                result[key] = ObjectSanitizer.sanitizeObject(value, rule);
            } else {
                result[key] = value;
            }
        }

        return result;
    }
}
