import type { JsonResult, JsonValue } from "./types.ts";

export function isValidJson(object: unknown) {
    if (
        typeof object === "string" ||
        typeof object === "number" ||
        typeof object === "boolean" ||
        object === null
    ) {
        return true;
    }

    if (Array.isArray(object) && object.every((x) => isValidJson(x))) {
        return true;
    }

    if (
        typeof object === "object" &&
        Object.keys(object).every((x) => typeof x === "string") &&
        Object.values(object).every((x) => isValidJson(x))
    ) {
        return true;
    }

    return false;
}

export function toJson(object: unknown) {
    return isValidJson(object)
        ? ({ success: true, ok: object as JsonValue } as const satisfies JsonResult)
        : ({ success: false, err: new Error("Invalid JSON") } as const satisfies JsonResult);
}

export async function fetchJson(url: URL) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("An unsuccessful response was received");
        }
        const data: unknown = await response.json();
        const json = toJson(data);
        if (!json.success) {
            throw json.err;
        }
        return { success: true, ok: json.ok } as const satisfies JsonResult;
    } catch (e) {
        const error =
            e instanceof Error
                ? e
                : new Error("An unexpected error occured while fetching json data");
        return { success: false, err: error } as const satisfies JsonResult;
    }
}

export async function fetchJsonLogError(url: URL) {
    const result = await fetchJson(url);
    if (result.success) {
        return result.ok;
    } else {
        console.error(result.err);
        return null;
    }
}

export async function fetchHtmlTemplate(templateUrl: URL) {
    const request = fetch(templateUrl);
    const parser = new DOMParser();
    const response = await request;
    const html = await response.text();
    const dom = parser.parseFromString(html, "text/html");
    const template = dom.querySelector("template");
    return template;
}

export function linkCssTemplate(template: HTMLTemplateElement | null, url: URL) {
    const link = template?.content.querySelector<HTMLLinkElement>(
        'link[rel="stylesheet"][href=""]',
    );
    if (link == null) {
        return;
    }
    link.href = url.pathname;
}

export function normalizeString(string: string) {
    return string
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/--+/g, "-")
        .replace(/^-|-$/g, "");
}
