(() => {
  "use strict";

  // Iratu's WhatsApp Business number, international digits only (no +, spaces or dashes).
  const WHATSAPP_NUMBER = "254725359390";
  const PRICE = "KSh 4,000";

  const MODELS = {
    muthuri: { name: "Mũthuri", description: "Woven leather loafer" },
    mugendi: { name: "Mũgendi", description: "Two tone leather loafer" }
  };
  const COLOURS = { brown: "Brown", black: "Black" };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* ---------- Search and filters ---------- */

  const cards = $$("#product-grid .product");
  const searchInput = $("#search");
  const resultCount = $("#result-count");
  const emptyState = $("#empty-state");
  const filterState = { query: "", model: "all", colour: "all" };

  // Lower case and strip accents so "muthuri" finds "Mũthuri".
  const fold = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const searchText = new Map(cards.map((card) => [card, fold(card.dataset.keywords || "")]));

  function applyFilters() {
    const terms = fold(filterState.query).split(/\s+/).filter(Boolean);
    let visible = 0;

    cards.forEach((card) => {
      const show =
        (filterState.model === "all" || card.dataset.model === filterState.model) &&
        (filterState.colour === "all" || card.dataset.colour === filterState.colour) &&
        terms.every((term) => searchText.get(card).includes(term));
      card.hidden = !show;
      if (show) visible += 1;
    });

    const noun = (n) => n + (n === 1 ? " pair" : " pairs");
    resultCount.textContent = visible === cards.length ? noun(cards.length) : visible + " of " + noun(cards.length);
    emptyState.hidden = visible > 0;
  }

  function setChip(group, value) {
    $$('[data-filter="' + group + '"]').forEach((chip) => {
      chip.setAttribute("aria-pressed", String(chip.dataset.value === value));
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      filterState.query = searchInput.value;
      applyFilters();
    });
  }

  $$("[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const group = chip.dataset.filter === "style" ? "model" : "colour";
      filterState[group] = chip.dataset.value;
      setChip(chip.dataset.filter, chip.dataset.value);
      applyFilters();
    });
  });

  function clearFilters() {
    filterState.query = "";
    filterState.model = "all";
    filterState.colour = "all";
    if (searchInput) searchInput.value = "";
    setChip("style", "all");
    setChip("colour", "all");
    applyFilters();
  }

  /* ---------- Order dialog ---------- */

  const dialog = $("#order-dialog");
  const form = $("#order-form");
  const modelSelect = $("#order-model");
  const colourSelect = $("#order-colour");
  const sizeSelect = $("#order-size");
  const formStatus = $("#form-status");
  const summaryName = $("#order-summary-name");
  const summaryMeta = $("#order-summary-meta");
  const thumb = $("#order-thumb");

  // Shows which pair is selected, using the photo already on the page.
  function syncSummary() {
    const model = MODELS[modelSelect.value];
    const colour = COLOURS[colourSelect.value];
    if (!model || !colour) return;

    summaryName.textContent = model.name + ", " + colour.toLowerCase();
    summaryMeta.textContent = model.description + " · " + PRICE;

    const card = cards.find((c) => c.dataset.model === modelSelect.value && c.dataset.colour === colourSelect.value);
    const img = card && $("img", card);
    if (img) thumb.src = img.currentSrc || img.src;
  }

  function openOrder(model, colour) {
    if (!dialog) return;
    const preselected = Boolean(MODELS[model] && COLOURS[colour]);
    if (preselected) {
      modelSelect.value = model;
      colourSelect.value = colour;
    }
    syncSummary();
    formStatus.textContent = "";

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("dialog-open");
    (preselected ? sizeSelect : modelSelect).focus();
  }

  function closeOrder() {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    document.body.classList.remove("dialog-open");
  }

  document.addEventListener("click", (event) => {
    const orderButton = event.target.closest("[data-order]");
    if (orderButton) {
      openOrder(orderButton.dataset.model, orderButton.dataset.colour);
      return;
    }
    if (event.target.closest("[data-close-order]")) {
      closeOrder();
      return;
    }
    if (event.target.closest("[data-clear]")) clearFilters();
  });

  if (dialog) {
    // The dialog has no padding of its own, so a click on the dialog element is a click on the backdrop.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeOrder();
    });
    dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
  }

  modelSelect.addEventListener("change", syncSummary);
  colourSelect.addEventListener("change", syncSummary);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      formStatus.textContent = "Ordering is not available right now. No order has been sent.";
      return;
    }

    const data = new FormData(form);
    const model = MODELS[data.get("model")];
    const colour = COLOURS[data.get("colour")];
    if (!model || !colour) {
      formStatus.textContent = "Please choose a style and colour, then try again.";
      return;
    }

    const field = (name) => String(data.get(name) || "").trim();
    const lines = [
      "Hello Iratu, I would like to request an order.",
      "",
      "Product: " + model.name + " (" + model.description.toLowerCase() + ")",
      "Colour: " + colour,
      "EU size: " + field("size"),
      "Price: " + PRICE,
      "",
      "Name: " + field("name"),
      "Phone / WhatsApp: " + field("phone"),
      "Delivery area: " + field("location"),
      "Notes: " + (field("notes") || "None"),
      "",
      "Please confirm making time, payment and delivery before the order is accepted."
    ];
    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));

    window.open(url, "_blank", "noopener,noreferrer");

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open WhatsApp";
    formStatus.replaceChildren(
      document.createTextNode("Opening WhatsApp. Your request is not confirmed until Iratu replies. If nothing opened, "),
      link,
      document.createTextNode(".")
    );
  });

  /* ---------- Mobile navigation ---------- */

  const navToggle = $(".nav-toggle");
  const nav = $("#primary-nav");
  const mobileQuery = window.matchMedia("(max-width: 719px)");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.textContent = open ? "Close" : "Menu";
  }

  navToggle.addEventListener("click", () => setNav(navToggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setNav(false);
      navToggle.focus();
    }
  });
  mobileQuery.addEventListener("change", () => setNav(false));

  /* ---------- Footer year ---------- */

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  syncSummary();
})();
