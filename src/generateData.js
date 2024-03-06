// @ts-check

// https://arrowverse.info/

[
    "List_of_Arrow_episodes",
    "List_of_The_Flash_(The_CW)_episodes",
    "List_of_Constantine_episodes",
    "List_of_Vixen_episodes",
    "List_of_Supergirl_episodes",
    "List_of_DC's_Legends_of_Tomorrow_episodes",
    "List_of_Freedom_Fighters:_The_Ray_episodes",
    "List_of_Black_Lightning_episodes",
    "List_of_Batwoman_episodes",
    "List_of_Superman_%26_Lois_episodes",
].map((x) =>
    x
        .toLowerCase()
        .replace(/^list_of_/, "")
        .replace(/_episodes$/, "")
        .replace(/\(.*\)/, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/--+/g, "-")
        .replace(/^-|-$/g, ""),
);

/** @type { HTMLTableElement | null } */
const table = document.querySelector("#episode-list");
if (table == null) {
    throw new Error("No table found");
}
const columns = ["#", "Series", "Season/Episode", "Title", "Release", "Wiki"];
const rows = Array.from(table.querySelectorAll("tbody tr"));

const result = rows.map((row) => {
    const cells = Array.from(row.querySelectorAll("td"));
    /** @type { Record<string, string> } */
    const data = {};

    for (const [j, key] of columns.entries()) {
        /** @type { string | null } */
        let value = null;

        if (j === 4) {
            const date = cells[j].textContent;
            value = date == null ? null : new Date(Date.parse(date)).toISOString().slice(0, 10);
        } else if (j === 5) {
            /** @type { HTMLAnchorElement | null } */
            const anchor = cells[j].querySelector("a");
            value = anchor?.href ?? null;
        } else {
            value = cells[j].textContent;
        }

        if (value == null) continue;
        data[key] = value;
    }

    return data;
});

console.info(JSON.stringify(result));
