// Friday Finder — rendering: deal cards, the comparison strip, the detail
// page and the summary stats. No network calls; everything comes from data.js.

import { DEALS, SOURCES, COMPARISONS, CHECKED_LABEL, discountOf, savingOf, verdictLabel } from "./data.js";

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function verdictClass(v) {
  return v === "true" ? "verdict-true" : v === "good" ? "verdict-good" : "verdict-routine";
}

export function cardHtml(deal) {
  const pct = discountOf(deal);
  const save = savingOf(deal);
  const source = SOURCES[deal.source];
  return `
<article class="deal-card">
  <div class="deal-top">
    <span class="store-badge">${escapeHtml(deal.store)}</span>
    <span class="verdict ${verdictClass(deal.verdict)}">${verdictLabel(deal.verdict)}</span>
  </div>
  <h2><a href="#/deal/${deal.id}">${escapeHtml(deal.name)}</a></h2>
  <p class="deal-meta">${escapeHtml(deal.brand)} · ${escapeHtml(deal.category)}</p>
  <div class="price-row">
    <span class="price-now">${money(deal.sale)}</span>
    <span class="price-was">${money(deal.usual)}</span>
    <span class="price-off">−${pct}%</span>
  </div>
  <p class="price-save">You save ${money(save)}</p>
  <p class="deal-evidence"><b>Why it counts:</b> ${escapeHtml(deal.evidence)}</p>
  <p class="deal-foot">
    <span>${CHECKED_LABEL} · <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.name.split(" — ")[0])}</a></span>
    <a href="${escapeHtml(deal.url)}" target="_blank" rel="noopener">View at ${escapeHtml(deal.store)} ↗</a>
  </p>
</article>`;
}

export function gridHtml(deals) {
  if (!deals.length) {
    return `<div class="empty"><b>No deals match those filters.</b>Try clearing the search or widening the discount range — all 42 deals are still live on this page.</div>`;
  }
  return `<div class="deal-grid">${deals.map(cardHtml).join("")}</div>`;
}

export function detailHtml(deal) {
  const pct = discountOf(deal);
  const save = savingOf(deal);
  const source = SOURCES[deal.source];
  return `
<div class="detail">
  <a class="back" href="#/">← All deals</a>
  <div class="detail-card">
    <div class="deal-top">
      <span class="store-badge">${escapeHtml(deal.store)}</span>
      <span class="verdict ${verdictClass(deal.verdict)}">${verdictLabel(deal.verdict)}</span>
    </div>
    <h1>${escapeHtml(deal.name)}</h1>
    <p class="deal-meta">${escapeHtml(deal.brand)} · ${escapeHtml(deal.category)}</p>
    <div class="detail-price">
      <span class="price-now">${money(deal.sale)}</span>
      <span class="price-was">${money(deal.usual)}</span>
      <span class="price-off">−${pct}%</span>
    </div>
    <p class="price-save">You save ${money(save)} off the usual price.</p>
    <dl class="detail-rows">
      <div><dt>Store</dt><dd>${escapeHtml(deal.store)}</dd></div>
      <div><dt>Sale price</dt><dd>${money(deal.sale)}</dd></div>
      <div><dt>Usual price</dt><dd>${money(deal.usual)}</dd></div>
      <div><dt>Discount</dt><dd>${pct}% (${money(save)} off)</dd></div>
      <div><dt>Verdict</dt><dd>${verdictLabel(deal.verdict)}</dd></div>
      <div><dt>Price checked</dt><dd>${CHECKED_LABEL}</dd></div>
      <div><dt>Source</dt><dd><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.name)}</a></dd></div>
    </dl>
    <p class="deal-evidence"><b>Why it counts:</b> ${escapeHtml(deal.evidence)}</p>
    <a class="cta" href="${escapeHtml(deal.url)}" target="_blank" rel="noopener">View at ${escapeHtml(deal.store)} ↗</a>
  </div>
</div>`;
}

export function statsHtml() {
  const total = DEALS.length;
  const trueCount = DEALS.filter((d) => d.verdict === "true").length;
  const avg = Math.round(DEALS.reduce((a, d) => a + discountOf(d), 0) / total);
  const totalSave = Math.round(DEALS.reduce((a, d) => a + savingOf(d), 0));
  return `
    <div class="stat"><b>${total}</b><span>verified deals</span></div>
    <div class="stat"><b>${trueCount}</b><span>rated TRUE DEAL</span></div>
    <div class="stat"><b>${avg}%</b><span>average discount</span></div>
    <div class="stat"><b>$${totalSave.toLocaleString("en-US")}</b><span>total savings if you bought one of each</span></div>`;
}

export function compareHtml() {
  const cards = COMPARISONS.map((c) => {
    const best = Math.min(...c.rows.map((r) => r.sale));
    const rows = c.rows
      .map((r) => `<div class="compare-row"><span>${escapeHtml(r.store)}</span><span class="${r.sale === best ? "best" : ""}">${money(r.sale)}${r.sale === best ? " · lowest" : ""}</span></div>`)
      .join("");
    return `<div class="compare-card"><h3>${escapeHtml(c.name)}</h3>${rows}<p>${escapeHtml(c.note)}</p></div>`;
  }).join("");
  return `<h2>Same product, different stores</h2>
<p>Three products sold at more than one store — the cheapest listing wins.</p>
<div class="compare-grid">${cards}</div>`;
}

export function sourcesHtml() {
  return Object.values(SOURCES)
    .map((s) => `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.name)}</a></li>`)
    .join("");
}
