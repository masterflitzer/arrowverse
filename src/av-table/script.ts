import { fetchHtmlTemplate, linkCssTemplate, normalizeString } from "../helpers.ts";
import type { JsonValue } from "../types.ts";

export async function build(data: JsonValue) {
    const htmlUrl = new URL("./index.html", import.meta.url);
    const cssUrl = new URL("./style.css", import.meta.url);

    const template = await fetchHtmlTemplate(htmlUrl);
    linkCssTemplate(template, cssUrl);

    return class ArrowverseTable extends HTMLElement {
        constructor() {
            super();

            if (template == null) {
                throw new Error(`An error occured while fetching template\n${import.meta.url}`);
            }

            const shadow = this.attachShadow({ mode: "open" });
            const clone = template.content.cloneNode(true);
            shadow.appendChild(clone);
        }

        connectedCallback() {
            this.renderData(data);
        }

        // TODO: use observed attributes to toggle color
        toggleColor(bool: boolean | null) {
            const trList = this.shadowRoot?.querySelectorAll("table > tbody > tr");
            if (trList == null) {
                throw new Error(`An unexpected error occured\n${import.meta.url}`);
            }

            const className = "no-color";

            for (const tr of trList) {
                if (bool === true) {
                    tr.classList.add(className);
                } else if (bool === false) {
                    tr.classList.remove(className);
                } else {
                    tr.classList.toggle(className);
                }
            }
        }

        renderData(data: JsonValue) {
            if (typeof data !== "object" || !Array.isArray(data)) {
                return;
            }

            const table = this.shadowRoot?.querySelector("table");
            if (table == null || table.tBodies.length === 0) {
                throw new Error(`An unexpected error occured\n${import.meta.url}`);
            }

            const tbody = table.tBodies[0];
            const template = tbody.querySelector("template");
            if (template == null) {
                throw new Error(`An unexpected error occured\n${import.meta.url}`);
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
    };
}
