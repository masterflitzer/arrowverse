export type Result<T, E extends Error = Error> =
    | { success: true; ok: T }
    | { success: false; err: E };

export type JsonResult = Result<JsonValue>;

export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue =
    | JsonArray
    | JsonObject
    | string
    | number
    | boolean
    | null;
