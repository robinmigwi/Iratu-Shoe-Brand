(() => {
  "use strict";

  // Iratu's WhatsApp Business number, international digits only (no +, spaces or dashes).
  const WHATSAPP_NUMBER = "254725359390";
  const PRICE = "KSh 4,000";

  // Single source of truth for the products. Keep image paths in step with the radio
  // buttons' data-src attributes in index.html.
  const MODELS = {
    muthuri: {
      name: "Mũthuri",
      description: "Woven leather loafer",
      images: {
        brown: "Irratu/optimized/muthuri-brown.webp",
        black: "Irratu/optimized/muthuri-black.webp"
      }
    },
    mugendi: {
      name: "Mũgendi",
      description: "Two tone leather loafer",
      images: {
        brown: "Irratu/a19f54c3-32ce-4f60-9190-836cd4781630_medium.png",
        black: "Irratu/8e389851-5322-4c0b-8ecb-5d7511afa1d9_1_medium.png"
      }
    }
  };
  const COLOURS = { brown: "Brown", black: "Black" };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* ---------- Colour selectors ---------- */

  function setColour(chapter, radio) {
    const model = MODELS[chapter.dataset.style];
    const colour = radio.value;
    if (!model || !COLOURS[colour]) return;

    const img = $("[data-chapter-image]", chapter);
    const webp = $("source", img.parentElement);
    if (webp && radio.dataset.webp) webp.srcset = radio.dataset.webp;
    img.src = radio.dataset.src;
    img.width = Number(radio.dataset.width) || img.width;
    img.height = Number(radio.dataset.height) || img.height;
    img.alt = model.name + " " + model.description.toLowerCase() + " in " + colour;

    $$("[data-colour-name]", chapter).forEach((el) => {
      el.textContent = el.closest("legend") ? COLOURS[colour] : colour;
    });

    const order = $("[data-order]", chapter);
    order.dataset.colour = colour;
    order.setAttribute("aria-label", "Order " + model.name + " in " + colour + " on WhatsApp");
  }

  $$(".chapter").forEach((chapter) => {
    $$('input[type="radio"]', chapter).forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) setColour(chapter, radio);
      });
    });
    // Browsers can restore a previously chosen radio on reload; sync the page to it.
    const checked = $('input[type="radio"]:checked', chapter);
    if (checked) setColour(chapter, checked);
  });

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

  // Shows which pair is selected, using the same photo as the product section.
  function syncSummary() {
    const model = MODELS[modelSelect.value];
    const colour = COLOURS[colourSelect.value];
    if (!model || !colour) return;

    summaryName.textContent = model.name + ", " + colour.toLowerCase();
    summaryMeta.textContent = model.description + " · " + PRICE;
    thumb.src = model.images[colourSelect.value];
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
    if (event.target.closest("[data-close-order]")) closeOrder();
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
      "Price: " + PRICE + " (delivery charged separately if applicable)",
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
