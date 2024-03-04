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

const table = document.querySelector("#episode-list") as HTMLTableElement;
const columns = ["#", "Series", "Season/Episode", "Title", "Release", "Wiki"];
const rows = Array.from(
    table.querySelectorAll("tbody tr") as NodeListOf<HTMLTableRowElement>,
);

const result = rows.map((row) => {
    const cells = Array.from(
        row.querySelectorAll("td") as NodeListOf<HTMLTableCellElement>,
    );
    const data: { [index: string]: string } = {};

    for (const [j, key] of columns.entries()) {
        let value: string | null = null;

        if (j === 4) {
            const someDate = cells[j].textContent;
            if (someDate == null) continue;
            const isoDate = new Date(Date.parse(someDate))
                .toISOString()
                .slice(0, 10);
            if (isoDate == null) continue;
            value = isoDate;
        } else if (j === 5) {
            const anchor = cells[j].querySelector("a") as HTMLAnchorElement;
            const url = anchor.href;
            if (url == null) continue;
            value = url;
        } else {
            const text = cells[j].textContent;
            if (text == null) continue;
            value = text;
        }

        if (value == null) continue;
        data[key] = value;
    }

    return data;
});

console.info(JSON.stringify(result));
