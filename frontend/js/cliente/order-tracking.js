// ==========================================================================
// ORDER TRACKING: calcula en qué etapa va un pedido (bodega -> tránsito ->
// reparto -> entregado) según el tiempo transcurrido desde que se creó, y
// dibuja la mini escena (bodega - carretera - casa) con el camión o el carro
// en la posición correspondiente.
//
// Es una simulación 100% en frontend (no hay backend de logística real),
// pensada para que el estado avance solo mientras el usuario espera/observa
// la página de rastreo, sin necesidad de recargar.
// ==========================================================================

(function () {
  "use strict";

  // Duración de cada etapa (en milisegundos). Se pueden ajustar sin tocar
  // el resto del código.
  const STAGE_DURATIONS = {
    warehouse: 45 * 1000, // en preparación / en bodega
    transit: 70 * 1000, // en camino hacia la ciudad de destino
    delivering: 55 * 1000, // en reparto, llegando a la dirección
    // después de esto: "delivered"
  };

  const STAGE_INFO = {
    warehouse: {
      statusText: "En preparación",
      caption: "Tu pedido está en la bodega de Artesanías Chigorodó",
    },
    transit: {
      statusText: "En tránsito",
      caption: "Tu pedido va en camino hacia tu ciudad",
    },
    delivering: {
      statusText: "En reparto",
      caption: "¡Tu pedido está muy cerca! Llegando a tu dirección",
    },
    delivered: {
      statusText: "Entregado",
      caption: "Tu pedido fue entregado en tu dirección",
    },
  };

  /**
   * Dado un pedido (con campo createdAt en ms, o status ya fijo para
   * pedidos antiguos que no tenían createdAt), calcula la etapa actual y
   * el progreso (0-1) dentro de esa etapa.
   */
  function computeStage(order) {
    // Pedidos entregados manualmente (por ejemplo desde el panel admin)
    // siempre se respetan tal cual.
    if (order.status === "delivered" || order.statusText === "Entregado") {
      return { key: "delivered", progress: 1 };
    }

    // Pedidos legados sin createdAt: los tratamos como si ya llevaran un
    // buen tramo en tránsito, para no romper el historial existente.
    if (!order.createdAt) {
      return { key: "transit", progress: 0.5 };
    }

    const elapsed = Date.now() - order.createdAt;
    const wh = STAGE_DURATIONS.warehouse;
    const tr = STAGE_DURATIONS.transit;
    const de = STAGE_DURATIONS.delivering;

    if (elapsed < wh) {
      return { key: "warehouse", progress: elapsed / wh };
    }
    if (elapsed < wh + tr) {
      return { key: "transit", progress: (elapsed - wh) / tr };
    }
    if (elapsed < wh + tr + de) {
      return { key: "delivering", progress: (elapsed - wh - tr) / de };
    }
    return { key: "delivered", progress: 1 };
  }

  /**
   * Pinta la escena dentro del contenedor dado (un elemento con
   * id="tracking-scene" ya presente en el HTML).
   */
  function renderScene(container, order) {
    if (!container) return null;
    const stage = computeStage(order);
    const info = STAGE_INFO[stage.key];

    container.dataset.stage = stage.key;

    const caption = container.querySelector(".tracking-scene__caption");
    if (caption) caption.textContent = info.caption;

    const truck = container.querySelector(".tracking-scene__truck");
    const car = container.querySelector(".tracking-scene__car");
    const roadStart = 14; // % — justo saliendo de la bodega
    const roadEnd = 78; // % — justo antes de llegar a la casa

    if (stage.key === "transit" && truck) {
      const pct = roadStart + (roadEnd - roadStart) * Math.min(1, stage.progress);
      truck.style.left = `${pct}%`;
    } else if (truck) {
      truck.style.left = `${roadStart}%`;
    }

    if ((stage.key === "delivering" || stage.key === "delivered") && car) {
      const pct =
        stage.key === "delivered"
          ? roadEnd
          : roadEnd - 12 + 12 * Math.min(1, stage.progress);
      car.style.left = `${pct}%`;
    }

    return stage;
  }

  /**
   * Setea el texto/estilo del "pill" de estado (arriba de la escena).
   */
  function renderStatusPill(pillEl, stage) {
    if (!pillEl) return;
    const info = STAGE_INFO[stage.key];
    const textEl = pillEl.querySelector(".text") || pillEl;
    textEl.textContent = info.statusText;
    pillEl.classList.toggle("is-delivered", stage.key === "delivered");
  }

  /**
   * Arranca un ciclo de refresco automático (cada 4s) mientras el elemento
   * de escena siga en el DOM, para que el camión/carro avance solo, sin que
   * el usuario tenga que recargar la página.
   */
  function watchOrder(container, pillEl, order, onStageChange) {
    let lastKey = null;
    function tick() {
      if (!document.body.contains(container)) return; // se dejó de ver
      const stage = renderScene(container, order);
      renderStatusPill(pillEl, stage);
      if (stage.key !== lastKey) {
        lastKey = stage.key;
        if (typeof onStageChange === "function") onStageChange(stage);
      }
      if (stage.key !== "delivered") {
        window.setTimeout(tick, 4000);
      }
    }
    tick();
  }

  window.OrderTracking = {
    computeStage: computeStage,
    renderScene: renderScene,
    renderStatusPill: renderStatusPill,
    watchOrder: watchOrder,
    STAGE_INFO: STAGE_INFO,
  };
})();
