(() => {
  "use strict";

  // Add Iratu's WhatsApp Business number before launch. Use international digits only,
  // for example "2547XXXXXXXX" (do not include +, spaces or dashes).
  const WHATSAPP_NUMBER = "";

  const PRODUCT_INFO = {
    muthuri: {
      name: "Mũthuri",
      description: "The woven leather loafer",
      images: {
        brown: "assets/muthuri-woven-brown.png",
        black: "assets/muthuri-woven-black.png"
      }
    },
    mugendi: {
      name: "Mũgendi",
      description: "The two tone leather loafer",
      images: {
        brown: "assets/mugendi-two-tone-brown.png",
        black: "assets/mugendi-two-tone-black.png"
      }
    }
  };

  const MUTHURI_BROWN_REFERENCE = "https://kioongozileather.com/cdn/shop/files/bfdf848a-4d2f-4869-9ddc-ba743b9d4e68.png?v=1789981226";
  const orderDialog = document.getElementById("order-dialog");
  const orderForm = document.getElementById("order-form");
  const modelSelect = document.getElementById("order-model");
  const colourSelect = document.getElementById("order-colour");
  const formStatus = document.getElementById("form-status");

  function setImage(img, model, colour) {
    const details = PRODUCT_INFO[model];
    if (!details || !details.images[colour]) return;

    img.dataset.fallbackUsed = "";
    img.dataset.fallback = model === "muthuri" && colour === "brown" ? MUTHURI_BROWN_REFERENCE : "";
    img.classList.remove("is-loaded");
    img.hidden = false;
    img.src = details.images[colour];
    img.alt = details.name + " " + colour + " " + details.description.toLowerCase();
  }

  document.querySelectorAll(".product-photo").forEach((img) => {
    img.addEventListener("load", () => {
      img.classList.add("is-loaded");
      img.hidden = false;
    });

    img.addEventListener("error", () => {
      const fallback = img.dataset.fallback;
      if (fallback && !img.dataset.fallbackUsed) {
        img.dataset.fallbackUsed = "true";
        img.src = fallback;
        return;
      }
      img.classList.remove("is-loaded");
      img.hidden = true;
    });

    // Ensure the first image can fall back to the reference photo while the original
    // Iratu product images are being added to the repository.
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("is-loaded");
    }
  });

  function openOrder(model, colour) {
    if (!orderDialog) return;
    if (model && PRODUCT_INFO[model]) modelSelect.value = model;
    if (colour) {
      colourSelect.value = colour.charAt(0).toUpperCase() + colour.slice(1).toLowerCase();
    }
    if (formStatus) formStatus.textContent = "";
    if (typeof orderDialog.showModal === "function") {
      orderDialog.showModal();
      document.body.classList.add("dialog-open");
    } else {
      orderDialog.setAttribute("open", "");
    }
  }

  function closeOrder() {
    if (!orderDialog) return;
    if (typeof orderDialog.close === "function") orderDialog.close();
    else orderDialog.removeAttribute("open");
    document.body.classList.remove("dialog-open");
  }

  document.querySelectorAll("[data-open-order]").forEach((button) => {
    button.addEventListener("click", () => openOrder());
  });

  document.querySelectorAll("[data-close-order]").forEach((button) => {
    button.addEventListener("click", closeOrder);
  });

  document.querySelectorAll("[data-order-product]").forEach((button) => {
    button.addEventListener("click", () => {
      openOrder(button.dataset.orderProduct, button.dataset.orderColour || "brown");
    });
  });

  document.querySelectorAll(".colour-choice").forEach((button) => {
    button.addEventListener("click", () => {
      const model = button.dataset.model;
      const colour = button.dataset.colour;
      const card = document.querySelector('[data-product-card="' + model + '"]');

      if (!card) return;
      card.querySelectorAll(".colour-choice").forEach((choice) => {
        const selected = choice === button;
        choice.classList.toggle("is-selected", selected);
        choice.setAttribute("aria-pressed", String(selected));
      });

      const img = card.querySelector(".product-photo");
      if (img) setImage(img, model, colour);

      const orderButton = card.querySelector(".product-order");
      if (orderButton) orderButton.dataset.orderColour = colour;
    });
  });

  if (orderDialog) {
    orderDialog.addEventListener("click", (event) => {
      if (event.target === orderDialog) closeOrder();
    });
    orderDialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
    });
  }

  if (orderForm) {
    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!formStatus) return;
      formStatus.textContent = "";

      if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
        formStatus.textContent = "The order form is ready, but Iratu's WhatsApp Business number still needs to be added in script.js before orders can be sent. No order has been placed.";
        return;
      }

      const formData = new FormData(orderForm);
      const modelKey = String(formData.get("model") || "muthuri");
      const product = PRODUCT_INFO[modelKey];
      if (!product) {
        formStatus.textContent = "Please choose a product and try again.";
        return;
      }

      const colour = String(formData.get("colour") || "Brown");
      const size = String(formData.get("size") || "");
      const customerName = String(formData.get("name") || "").trim();
      const customerPhone = String(formData.get("phone") || "").trim();
      const location = String(formData.get("location") || "").trim();
      const notes = String(formData.get("notes") || "").trim();

      const messageLines = [
        "Hello Iratu, I would like to request an order.",
        "",
        "Product: " + product.name + " — " + product.description,
        "Colour: " + colour,
        "EU size: " + size,
        "Price: KSh 4,000",
        "",
        "Name: " + customerName,
        "My phone / WhatsApp: " + customerPhone,
        "Delivery area: " + location,
        "Notes: " + (notes || "None"),
        "",
        "Please confirm fit, making time, payment and delivery details before accepting the order."
      ];
      const whatsappUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(messageLines.join("\n"));
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      formStatus.textContent = "Your order request is opening in WhatsApp. It is not confirmed until Iratu replies.";
    });
  }

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      navToggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Keep the order form's selected options aligned if the customer changes them.
  if (modelSelect && colourSelect) {
    modelSelect.addEventListener("change", () => {
      const product = PRODUCT_INFO[modelSelect.value];
      if (product && formStatus) formStatus.textContent = "";
    });
  }
})();