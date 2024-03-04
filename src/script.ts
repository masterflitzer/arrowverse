import * as ArrowverseApp from "./av-app/script.ts";
import * as ArrowverseColorOption from "./av-color-option/script.ts";
import * as ArrowverseDateFilter from "./av-date-filter/script.ts";
import * as ArrowverseSeriesFilter from "./av-series-filter/script.ts";
import * as ArrowverseTable from "./av-table/script.ts";
import { fetchJsonLogError } from "./helpers.ts";

const data = await fetchJsonLogError(
    new URL("/api/data.json", import.meta.url),
);

customElements.define("av-app", await ArrowverseApp.build());
customElements.define("av-color-option", await ArrowverseColorOption.build());
customElements.define("av-date-filter", await ArrowverseDateFilter.build());
customElements.define("av-series-filter", await ArrowverseSeriesFilter.build());
customElements.define("av-table", await ArrowverseTable.build(data));
