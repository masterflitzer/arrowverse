import ArrowverseApp from "./av-app/script.ts";
import ArrowverseColorOption from "./av-color-option/script.ts";
import ArrowverseDateFilter from "./av-date-filter/script.ts";
import ArrowverseSeriesFilter from "./av-series-filter/script.ts";
import ArrowverseTable from "./av-table/script.ts";

customElements.define("av-app", ArrowverseApp);
customElements.define("av-table", ArrowverseTable);
customElements.define("av-color-option", ArrowverseColorOption);
customElements.define("av-series-filter", ArrowverseSeriesFilter);
customElements.define("av-date-filter", ArrowverseDateFilter);
customElements.upgrade(document.body);
