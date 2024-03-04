import type { JsonResult, JsonValue } from "./types.ts";

export async function fetchJson(url: URL): Promise<JsonResult> {
    try {
        const response = await fetch(url);
        const data: JsonValue = await response.json();
        if (!response.ok) {
            throw new Error("An unsuccessful response was received");
        }
        return { success: true, ok: data } as const;
    } catch (e) {
        const error =
            e instanceof Error
                ? e
                : new Error(
                      "An unexpected error occured while fetching json data",
                  );
        return { success: false, err: error } as const;
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

export function linkCssTemplate(
    template: HTMLTemplateElement | null,
    url: URL,
) {
    const link = template?.content.querySelector(
        'link[rel="stylesheet"][href=""]',
    ) as HTMLLinkElement;
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
