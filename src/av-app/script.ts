import Config from "../config.ts";
import { fetchHtmlTemplate } from "../helpers.ts";

const url = {
    html: new URL("./index.html", import.meta.url),
};

const template = await fetchHtmlTemplate(url.html);

export default class ArrowverseApp extends HTMLElement {
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

        const config = new Config();

        const avTable = this.#shadow.querySelector("av-table") as HTMLElement;
        const avColorOption = this.#shadow.querySelector("av-color-option") as HTMLElement;

        avTable.dataset.noColor = (!config.color).toString();

        // set initial state from config in constructor
        // then add event listeners to update config and table

        const configColor = () => {
            avTable.dataset.noColor = (!config.color).toString();
            avColorOption.dataset.checked = config.color.toString();
        };

        this.#shadow.addEventListener("av-color", ((e: CustomEvent<{ color: boolean }>) => {
            avTable.dataset.noColor = (!e.detail.color).toString();
        }) as EventListener);
    }
}
