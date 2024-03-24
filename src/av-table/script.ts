import {
    fetchHtmlTemplate,
    fetchJsonLogError,
    linkCssTemplate,
    normalizeString,
    toBooleanOrNull,
} from "../helpers.ts";
import type { JsonValue } from "../types.ts";

const url = {
    html: new URL("./index.html", import.meta.url),
    css: new URL("./style.css", import.meta.url),
    data: new URL("/api/data.json", import.meta.url),
};

const template = await fetchHtmlTemplate(url.html);
linkCssTemplate(template, url.css);
const data = await fetchJsonLogError(url.data);

export default class ArrowverseTable extends HTMLElement {
    static observedAttributes = ["data-no-color"];

    #shadow: ShadowRoot;
    constructor() {
        super();

        if (template == null) {
            throw new Error(`Failed to fetch template\n${import.meta.url}`);
        }

        const clone = template.content.cloneNode(true);
        this.attachShadow({ mode: "open" }).appendChild(clone);

        if (this.shadowRoot == null) {
            throw new Error(`The shadow root was null\n${import.meta.url}`);
        }
        this.#shadow = this.shadowRoot;
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        const attribute: Record<string, (() => void) | null> = {
            "data-no-color": () => {
                const value = toBooleanOrNull(newValue);
                if (value == null) {
                    throw new Error(`An unexpected error occured\n${import.meta.url}`);
                }
                this.#toggleColor(value);
            },
        };
        attribute[name]?.();
    }

    connectedCallback() {
        customElements.upgrade(this);

        const table = this.#shadow.querySelector("table");
        this.#renderData(table, data);
    }

    #renderData(table: HTMLTableElement | null, data: JsonValue | null) {
        if (table == null || table.tBodies.length === 0) {
            throw new Error(`The table was null or empty\n${import.meta.url}`);
        }

        if (typeof data !== "object" || !Array.isArray(data)) {
            throw new Error(`The data was not an array\n${import.meta.url}`);
        }

        const tbody = table.tBodies[0];
        const template = tbody.querySelector("template");
        if (template == null) {
            throw new Error(`The template was null\n${import.meta.url}`);
        }

        for (const episode of data) {
            if (typeof episode !== "object" || Array.isArray(episode) || episode == null) {
                continue;
            }

            const arrowverseIndex = episode["#"]?.toString() ?? "";
            const arrowverseSeries = episode["Series"]?.toString() ?? "";
            const arrowverseSeasonEpisode = episode["Season/Episode"]?.toString() ?? "";
            const arrowverseTitle = episode["Title"]?.toString() ?? "";
            const arrowverseRelease = episode["Release"]?.toString() ?? "";
            const arrowverseWiki = episode["Wiki"]?.toString() ?? "";

            const clone = template.content.cloneNode(true) as DocumentFragment | null;
            if (clone == null) {
                continue;
            }

            const tr = clone.querySelector("tr");
            if (tr == null) {
                continue;
            }

            tr.classList.add(normalizeString(arrowverseSeries));

            const tdList = tr.querySelectorAll("td");
            tdList[0].textContent = arrowverseIndex;
            tdList[1].textContent = arrowverseSeries;
            tdList[2].textContent = arrowverseSeasonEpisode;
            tdList[3].textContent = arrowverseTitle;
            tdList[4].textContent = arrowverseRelease;

            const a = tdList[5].querySelector("a");
            if (a == null) {
                continue;
            }
            a.href = arrowverseWiki;

            tbody.appendChild(clone);
        }
    }

    #toggleColor(bool: boolean) {
        const trList = this.#shadow.querySelectorAll("table > tbody > tr");
        const className = "no-color";
        for (const tr of trList) {
            bool ? tr.classList.add(className) : tr.classList.remove(className);
        }
    }
}
