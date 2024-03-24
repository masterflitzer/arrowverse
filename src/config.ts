// export default class Config {
//     static #instance: Config | null = null;
//     #data: Map<string, string | null> | null = null;

import { toBooleanOrNull } from "./helpers";

//     constructor() {
//         if (Config.#instance != null) {
//             return Config.#instance;
//         }
//         Config.#instance = this;

//         const storage = globalThis.localStorage;
//         const query = new URLSearchParams(globalThis.location.search);
//         this.#data = new Map(
//             Object.entries(defaults).map((entry) => {
//                 const key = entry[0];
//                 const value = entry[1];
//                 if (value == null) {
//                     return [key, null];
//                 } else if (typeof value === "string") {
//                     return [key, value];
//                 } else {
//                     return [key, String(value)];
//                 }
//             }),
//         );

//         const keys = this.#data.keys();
//         for (const key of keys) {
//             for (const value of [storage.getItem(key), query.get(key)]) {
//                 if (value != null && ![String(), String(null)].includes(value)) {
//                     this.set(key, value);
//                 }
//             }
//         }
//     }

//     get(key: string) {
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//         return this.#data!.get(key)!;
//     }

//     set(key: string, value: string) {
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//         this.#data!.set(key, value);
//     }
// }

const defaults = {
    color: true,
};

export default class Config {
    static #instance: Config | null = null;
    #storage: Storage = globalThis.localStorage;

    constructor() {
        if (Config.#instance != null) {
            return Config.#instance;
        }
        Config.#instance = this;
    }

    static clear() {
        globalThis.localStorage.clear();
        globalThis.sessionStorage.clear();
    }

    get color() {
        const key = "color";
        const value = this.#storage.getItem(key);
        return toBooleanOrNull(value) ?? defaults.color;
    }

    set color(value) {
        const key = "color";
        this.#storage.setItem(key, value.toString());
    }
}
