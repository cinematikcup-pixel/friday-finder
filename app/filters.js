// Friday Finder — filtering and sorting. Pure functions over the deals in
// data.js, so the list, the count line and the shareable URL all agree.

import { DEALS, CATEGORIES, STORES, discountOf, savingOf } from "./data.js";

export const DISCOUNT_STEPS = [
  { value: 0, label: "Any discount" },
  { value: 20, label: "20% off or more" },
  { value: 40, label: "40% off or more" },
  { value: 50, label: "50% off or more" },
];

export function defaultState() {
  return { q: "", category: "All", store: "All", minDiscount: 0, onlyTrue: false, sort: "discount" };
}

// Read a shareable state from the page URL (?q=, ?cat=, ?store=, ?min=,
// ?sort=, ?only=true) so a filtered view can be linked and screenshotted.
export function stateFromUrl() {
  const state = defaultState();
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  if (q) state.q = q;
  const cat = params.get("cat");
  if (cat && (cat === "All" || CATEGORIES.includes(cat))) state.category = cat;
  const store = params.get("store");
  if (store && (store === "All" || STORES.includes(store))) state.store = store;
  const min = Number(params.get("min"));
  if (Number.isFinite(min) && DISCOUNT_STEPS.some((s) => s.value === min)) state.minDiscount = min;
  const sort = params.get("sort");
  if (sort && ["discount", "saving", "price-asc", "price-desc", "verdict"].includes(sort)) state.sort = sort;
  if (params.get("only") === "true") state.onlyTrue = true;
  return state;
}

export function stateToQuery(state) {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.category !== "All") params.set("cat", state.category);
  if (state.store !== "All") params.set("store", state.store);
  if (state.minDiscount) params.set("min", String(state.minDiscount));
  if (state.sort !== "discount") params.set("sort", state.sort);
  if (state.onlyTrue) params.set("only", "true");
  const qs = params.toString();
  return qs ? "?" + qs : "";
}

const VERDICT_RANK = { true: 0, good: 1, routine: 2 };

export function applyFilters(state) {
  const q = state.q.trim().toLowerCase();
  const list = DEALS.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (discountOf(d) < state.minDiscount) return false;
    if (state.onlyTrue && d.verdict !== "true") return false;
    if (q && !(d.name + " " + d.brand + " " + d.store).toLowerCase().includes(q)) return false;
    return true;
  });
  const sorted = [...list];
  if (state.sort === "discount") sorted.sort((a, b) => discountOf(b) - discountOf(a) || savingOf(b) - savingOf(a));
  else if (state.sort === "saving") sorted.sort((a, b) => savingOf(b) - savingOf(a));
  else if (state.sort === "price-asc") sorted.sort((a, b) => a.sale - b.sale);
  else if (state.sort === "price-desc") sorted.sort((a, b) => b.sale - a.sale);
  else if (state.sort === "verdict") sorted.sort((a, b) => VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || discountOf(b) - discountOf(a));
  return sorted;
}

export function resultLine(state, shown) {
  const parts = [];
  if (state.q) parts.push(`matching “${state.q}”`);
  if (state.category !== "All") parts.push(`in ${state.category}`);
  if (state.store !== "All") parts.push(`at ${state.store}`);
  if (state.minDiscount) parts.push(`${state.minDiscount}% off or more`);
  if (state.onlyTrue) parts.push(`rated TRUE DEAL`);
  const where = parts.length ? " " + parts.join(", ") : "";
  return `<b>${shown} of ${DEALS.length} deals</b>${where} · sorted by ${{
    discount: "biggest discount",
    saving: "biggest saving",
    "price-asc": "lowest price",
    "price-desc": "highest price",
    verdict: "best verdict",
  }[state.sort]}.`;
}
