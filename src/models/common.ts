export type ISO8601String = string & { readonly __brand: unique symbol };

// ISO8601String type guard
export function isISO8601(val: unknown): val is ISO8601String {
    if (typeof val !== "string") return false

    const isoRegex = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/;

    if (!isoRegex.test(val)) {
        return false
    }

    if (Number.isNaN(Date.parse(val))) {
        return false
    }

    return true
}
 // String digits check
export function checkDigits(str: unknown): boolean {
    console.log(str)
    console.log(typeof str)

    if (typeof str !== "string") {
        return false;
    }

    return /^\d+$/.test(str);
}
