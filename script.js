(function () {
  // 1. Scroll progress bar & active section spy
  const progressBar = document.getElementById("scrollProgress");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll(".section-block"));

  function updateScrollState() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    if (progressBar) {
      progressBar.style.width = `${pct}%`;
    }

    let currentId = sections[0]?.id;
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top;
      if (top <= 160) {
        currentId = sec.id;
      }
    }

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === currentId);
    });
  }

  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  // 2. Project category filtering
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const projectRows = Array.from(document.querySelectorAll(".project-row"));

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.toggle("active", b === btn));

      projectRows.forEach((row) => {
        const tags = (row.dataset.tags || "").split(/\s+/);
        const show = filter === "all" || tags.includes(filter);
        row.classList.toggle("hidden", !show);
      });
    });
  });

  // 3. Interactive WLC Accommodation Allocation Playground (50:30:20 default)
  const wDistInput = document.getElementById("wDist");
  const wDispInput = document.getElementById("wDisp");
  const wCapInput = document.getElementById("wCap");
  const wDistVal = document.getElementById("wDistVal");
  const wDispVal = document.getElementById("wDispVal");
  const wCapVal = document.getElementById("wCapVal");
  const resetBtn = document.getElementById("resetWeightsBtn");
  const resultsContainer = document.getElementById("allocationResults");

  // Illustrative normalized candidate scores (0..100 scale, higher = better)
  const candidates = [
    {
      name: "Cluster A — Multi-Property Pair (Koramangala + HSR)",
      dist: 91,
      disp: 84,
      cap: 78
    },
    {
      name: "Cluster B — Single Flagship Property (Indiranagar)",
      dist: 85,
      disp: 62,
      cap: 92
    },
    {
      name: "Cluster C — Distributed 3-Unit Split",
      dist: 76,
      disp: 94,
      cap: 74
    }
  ];

  function renderAllocations() {
    if (!wDistInput || !wDispInput || !wCapInput || !resultsContainer) return;

    const rawD = Number(wDistInput.value);
    const rawP = Number(wDispInput.value);
    const rawC = Number(wCapInput.value);
    const sum = rawD + rawP + rawC || 1;

    const normD = rawD / sum;
    const normP = rawP / sum;
    const normC = rawC / sum;

    wDistVal.textContent = `${Math.round(normD * 100)}%`;
    wDispVal.textContent = `${Math.round(normP * 100)}%`;
    wCapVal.textContent = `${Math.round(normC * 100)}%`;

    const ranked = candidates
      .map((c) => {
        const wlc = normD * c.dist + normP * c.disp + normC * c.cap;
        return { ...c, wlc };
      })
      .sort((a, b) => b.wlc - a.wlc);

    resultsContainer.innerHTML = ranked
      .map(
        (item, idx) => `
        <div class="alloc-card">
          <div class="alloc-top">
            <span><strong>#${idx + 1}</strong> ${item.name}</span>
            <span class="alloc-score">WLC ${item.wlc.toFixed(1)}</span>
          </div>
          <div class="alloc-bar-track">
            <div class="alloc-bar-fill" style="width: ${Math.min(100, item.wlc)}%"></div>
          </div>
          <div class="alloc-detail">
            Dist: ${item.dist} • Dispersion: ${item.disp} • Capacity-Fit: ${item.cap}
          </div>
        </div>
      `
      )
      .join("");
  }

  [wDistInput, wDispInput, wCapInput].forEach((input) => {
    input?.addEventListener("input", renderAllocations);
  });

  resetBtn?.addEventListener("click", () => {
    wDistInput.value = "50";
    wDispInput.value = "30";
    wCapInput.value = "20";
    renderAllocations();
  });

  renderAllocations();
})();