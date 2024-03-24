import { fetchHtmlTemplate, toBooleanOrNull } from "../helpers.ts";

const url = {
    html: new URL("./index.html", import.meta.url),
};

const template = await fetchHtmlTemplate(url.html);

export default class ArrowverseColorOption extends HTMLElement {
    static observedAttributes = ["data-checked"];

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
            "data-checked": () => {
                const value = toBooleanOrNull(newValue);
                if (value == null) {
                    throw new Error(`An unexpected error occured\n${import.meta.url}`);
                }
                this.#toggle(value);
            },
        };
        attribute[name]?.();
    }

    connectedCallback() {
        customElements.upgrade(this);

        const input = this.#shadow.querySelector("input");
        if (input == null) {
            throw new Error(`An unexpected error occured\n${import.meta.url}`);
        }

        input.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLInputElement;
            const event = new CustomEvent("av-color", {
                bubbles: true,
                detail: { color: target.checked },
            });
            this.dispatchEvent(event);
        });
    }

    #toggle(bool: boolean) {
        const input = this.#shadow.querySelector("input");
        if (input == null) {
            throw new Error(`An unexpected error occured\n${import.meta.url}`);
        }
        input.checked = bool;
    }
}
