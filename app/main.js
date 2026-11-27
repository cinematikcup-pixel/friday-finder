// Friday Finder — entry point. Wires the controls to the filters, renders
// the list or one deal's detail page from the hash route, and keeps the
// filter state in the URL so a view can be shared or screenshotted.
//
// Routes: #/ is the deal list, #/deal/<id> is one deal's detail page.
// The list state also reads ?q=, ?cat=, ?store=, ?min=, ?sort=, ?only=true
// from the page URL on first load.

import { DEALS, CATEGORIES, STORES } from "./data.js";
import { applyFilters, stateFromUrl, stateToQuery, resultLine, DISCOUNT_STEPS } from "./filters.js";
import { gridHtml, detailHtml, statsHtml, compareHtml, sourcesHtml } from "./render.js";

const state = stateFromUrl();
const view = document.getElementById("view");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const onlyTrueBox = document.getElementById("only-true");
const resultLineEl = document.getElementById("result-line");
const hero = document.getElementById("hero");
const compare = document.getElementById("compare");
const controls = document.querySelector(".controls");

document.getElementById("stats").innerHTML = statsHtml();
compare.innerHTML = compareHtml();
document.getElementById("source-list").innerHTML = sourcesHtml();

function chip(label, pressed, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.textContent = label;
  b.setAttribute("aria-pressed", pressed ? "true" : "false");
  b.addEventListener("click", onClick);
  return b;
}

function buildChips() {
  const catBox = document.getElementById("category-filters");
  catBox.replaceChildren(
    ...["All", ...CATEGORIES].map((c) =>
      chip(c === "All" ? "All categories" : c, state.category === c, () => {
        state.category = c;
        sync();
      }),
    ),
  );
  const storeBox = document.getElementById("store-filters");
  storeBox.replaceChildren(
    ...["All", ...STORES].map((s) =>
      chip(s === "All" ? "All stores" : s, state.store === s, () => {
        state.store = s;
        sync();
      }),
    ),
  );
  const discBox = document.getElementById("discount-filters");
  discBox.replaceChildren(
    ...DISCOUNT_STEPS.map((s) =>
      chip(s.label, state.minDiscount === s.value, () => {
        state.minDiscount = s.value;
        sync();
      }),
    ),
  );
}

function render() {
  const hash = location.hash;
  const detail = hash.match(/^#\/deal\/([\w-]+)$/);
  if (detail) {
    const deal = DEALS.find((d) => d.id === detail[1]);
    if (deal) {
      hero.style.display = "none";
      compare.style.display = "none";
      controls.style.display = "none";
      view.innerHTML = detailHtml(deal);
      document.title = `${deal.name} — ${deal.store} ${deal.sale ? "$" + deal.sale : ""} · Friday Finder`;
      window.scrollTo(0, 0);
      return;
    }
  }
  hero.style.display = "";
  compare.style.display = "";
  controls.style.display = "";
  const shown = applyFilters(state);
  view.innerHTML = gridHtml(shown);
  resultLineEl.innerHTML = resultLine(state, shown.length);
  document.title = "Friday Finder — Real Black Friday Deals, Checked Today";
}

function sync() {
  buildChips();
  const qs = stateToQuery(state);
  try {
    history.replaceState(null, "", location.pathname + qs + location.hash);
  } catch {
    // file:// and other non-HTTP origins may refuse replaceState; the
    // list still renders from state, only the shareable URL is skipped.
  }
  render();
}

searchInput.value = state.q;
sortSelect.value = state.sort;
onlyTrueBox.checked = state.onlyTrue;

searchInput.addEventListener("input", () => {
  state.q = searchInput.value;
  sync();
});
sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  sync();
});
onlyTrueBox.addEventListener("change", () => {
  state.onlyTrue = onlyTrueBox.checked;
  sync();
});

window.addEventListener("hashchange", render);
buildChips();
render();
