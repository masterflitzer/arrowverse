import { fetchHtmlTemplate } from "../helpers.ts";

const url = {
    html: new URL("./index.html", import.meta.url),
};

const template = await fetchHtmlTemplate(url.html);

export default class ArrowverseSeriesFilter extends HTMLElement {
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

    connectedCallback() {
        customElements.upgrade(this);
    }
}
