(function () {
  "use strict";

  const ACTIVE_KEY = "checkout_journey_active";
  const PROGRESS_KEY = "checkout_journey_progress";
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const steps = {
    "checkout-info.html": { progress: 18, label: "Empacando tu pedido" },
    "checkout-envio.html": {
      progress: 39,
      label: "Pedido listo para el envio",
    },
    "checkout-pago.html": { progress: 60, label: "Esperando el pago" },
    "pago-pse.html": { progress: 72, label: "Procesando el pago" },
    "confirmacion-compra.html": {
      progress: 77,
      label: "Pago aprobado: despachando",
    },
  };

  function currentPage() {
    return window.location.pathname.split("/").pop().toLowerCase();
  }

  function createTruckMarkup() {
    return `<div class="checkout-journey__truck"><div class="checkout-journey__truck-cargo"></div><div class="checkout-journey__truck-cab"></div><div class="checkout-journey__wheel checkout-journey__wheel--back"></div><div class="checkout-journey__wheel checkout-journey__wheel--front"></div></div>`;
  }

  function createJourney(options) {
    const config = options || {};
    const existing = document.querySelector(".checkout-journey");
    if (existing) return existing;
    const journey = document.createElement("div");
    journey.className = "checkout-journey";
    journey.setAttribute("aria-hidden", "true");
    journey.style.setProperty(
      "--journey-progress",
      `${config.initialProgress || 8}%`,
    );
    journey.innerHTML = `<div class="checkout-journey__sky"></div><div class="checkout-journey__label">${config.label || "Preparando tu pedido"}</div><div class="checkout-journey__belt"></div><div class="checkout-journey__package${config.open ? " is-open" : ""}"><div class="checkout-journey__flap checkout-journey__flap--left"></div><div class="checkout-journey__flap checkout-journey__flap--right"></div><div class="checkout-journey__box-body"></div></div>${config.truck ? createTruckMarkup() : ""}`;
    document.body.appendChild(journey);
    document.body.classList.add("checkout-journey-visible");
    return journey;
  }

  function setLabel(journey, text) {
    const label = journey.querySelector(".checkout-journey__label");
    if (label) label.textContent = text;
  }

  function animateProductsIntoBox(journey) {
    const box = journey.querySelector(".checkout-journey__package");
    const productImages = Array.from(
      document.querySelectorAll(
        ".cart-items-list .cart-item-card .cart-item-img",
      ),
    ).slice(0, 8);
    if (!productImages.length || reducedMotion) return Promise.resolve();

    const boxRect = box.getBoundingClientRect();
    const targetX = boxRect.left + boxRect.width / 2 - 26;
    const targetY = boxRect.top + 3;
    const animations = productImages.map(function (image, index) {
      const rect = image.getBoundingClientRect();
      const clone = image.cloneNode(true);
      clone.removeAttribute("onerror");
      clone.src =
        image.complete && image.naturalWidth
          ? image.currentSrc || image.src
          : "../img/mochila_wayuu.png";
      clone.className = "checkout-journey__product";
      clone.style.left = `${rect.left + rect.width / 2 - 26}px`;
      clone.style.top = `${rect.top + rect.height / 2 - 26}px`;
      document.body.appendChild(clone);
      const deltaX = targetX - (rect.left + rect.width / 2 - 26);
      const deltaY = targetY - (rect.top + rect.height / 2 - 26);
      const animation = clone.animate(
        [
          { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${deltaX * 0.58}px, ${deltaY * 0.3 - 70}px) scale(.82) rotate(${index % 2 ? 12 : -12}deg)`,
            opacity: 1,
            offset: 0.55,
          },
          {
            transform: `translate(${deltaX}px, ${deltaY}px) scale(.28) rotate(${index % 2 ? 22 : -22}deg)`,
            opacity: 0.25,
          },
        ],
        {
          duration: 760,
          delay: index * 115,
          easing: "cubic-bezier(.2,.75,.25,1)",
          fill: "forwards",
        },
      );
      animation.finished.finally(function () {
        clone.remove();
        box.classList.remove("is-bouncing");
        void box.offsetWidth;
        box.classList.add("is-bouncing");
      });
      return animation.finished;
    });
    return Promise.allSettled(animations);
  }

  async function startFromCart(destination) {
    if (document.querySelector(".checkout-journey")) return;
    const button = document.querySelector('button[onclick*="goToCheckout"]');
    if (button) {
      button.disabled = true;
      button.textContent = "Empacando...";
    }
    sessionStorage.setItem(ACTIVE_KEY, "1");
    sessionStorage.setItem(PROGRESS_KEY, "8");
    const journey = createJourney({
      initialProgress: 8,
      label: "Reuniendo tus productos",
      open: true,
    });
    await wait(50);
    await animateProductsIntoBox(journey);
    const box = journey.querySelector(".checkout-journey__package");
    box.classList.remove("is-open");
    setLabel(journey, "Pedido empacado");
    await wait(reducedMotion ? 50 : 520);
    window.location.href = destination || "checkout-info.html";
  }

  function renderCheckoutStep() {
    const page = currentPage();
    const step = steps[page];
    if (!step || sessionStorage.getItem(ACTIVE_KEY) !== "1") return;
    const previous = Number(
      sessionStorage.getItem(PROGRESS_KEY) || Math.max(8, step.progress - 20),
    );
    const isFinal = page === "confirmacion-compra.html";
    const journey = createJourney({
      initialProgress: previous,
      label: step.label,
      truck: isFinal,
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        journey.style.setProperty("--journey-progress", `${step.progress}%`);
        sessionStorage.setItem(PROGRESS_KEY, String(step.progress));
      });
    });
    if (isFinal) finishJourney(journey);
  }

  async function finishJourney(journey) {
    const box = journey.querySelector(".checkout-journey__package");
    const truck = journey.querySelector(".checkout-journey__truck");
    await wait(reducedMotion ? 80 : 1250);
    setLabel(journey, "Cargando el pedido al camion");
    journey.style.setProperty("--journey-progress", "87%");
    box.style.transform = "translateX(-50%) scale(.58) translateY(-8px)";
    await wait(reducedMotion ? 80 : 850);
    box.style.opacity = "0";
    setLabel(journey, "Tu pedido va en camino");
    truck.classList.add("is-driving");
    journey.classList.add("is-finished");
    sessionStorage.removeItem(ACTIVE_KEY);
    sessionStorage.removeItem(PROGRESS_KEY);
    await wait(reducedMotion ? 100 : 2700);
    document.body.classList.remove("checkout-journey-visible");
    journey.remove();
  }

  function wait(milliseconds) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, milliseconds);
    });
  }

  window.CheckoutJourney = {
    startFromCart: startFromCart,
    renderCheckoutStep: renderCheckoutStep,
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCheckoutStep);
  } else {
    renderCheckoutStep();
  }
})();
