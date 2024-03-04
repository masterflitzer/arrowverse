import { fetchHtmlTemplate } from "../helpers.ts";

export async function build() {
    const htmlUrl = new URL("./index.html", import.meta.url);
    const template = await fetchHtmlTemplate(htmlUrl);

    return class ArrowverseColorOption extends HTMLElement {
        constructor() {
            super();

            if (template == null) {
                throw new Error(
                    `An error occured while fetching template\n${import.meta.url}`,
                );
            }

            const clone = template.content.cloneNode(true);
            this.appendChild(clone);
        }
    };
}
