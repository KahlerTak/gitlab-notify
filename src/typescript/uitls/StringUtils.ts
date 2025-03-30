export default class StringUtils {
    public static isNullOrWhitespace(value: string | null | undefined) {
        return !value || value.trim() === "";
    }
}
