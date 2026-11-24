(function () {
  const progressBar = document.getElementById("progressBar");
  const links = Array.from(document.querySelectorAll(".side-link"));
  const blocks = Array.from(document.querySelectorAll(".block"));

  function onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
    }

    let activeId = blocks[0]?.id;
    for (const b of blocks) {
      if (b.getBoundingClientRect().top <= 170) {
        activeId = b.id;
      }
    }
    links.forEach((l) => l.classList.toggle("active", l.dataset.target === activeId));
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const filterBtns = Array.from(document.querySelectorAll(".f-btn"));
  const projCards = Array.from(document.querySelectorAll(".proj-card"));

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
      projCards.forEach((card) => {
        const tags = (card.dataset.tags || "").split(/\s+/);
        card.classList.toggle("hidden", tag !== "all" && !tags.includes(tag));
      });
    });
  });

  const sDist = document.getElementById("sDist");
  const sDisp = document.getElementById("sDisp");
  const sCap = document.getElementById("sCap");
  const vDist = document.getElementById("vDist");
  const vDisp = document.getElementById("vDisp");
  const vCap = document.getElementById("vCap");
  const resetBtn = document.getElementById("resetBtn");
  const rankList = document.getElementById("rankList");

  const options = [
    { label: "Multi-Unit Cluster A", d: 91, p: 84, c: 78 },
    { label: "Single Property B", d: 85, p: 62, c: 92 },
    { label: "Split Allocation C", d: 76, p: 94, c: 74 }
  ];

  function updateWLC() {
    if (!sDist || !sDisp || !sCap || !rankList) return;
    const dRaw = Number(sDist.value);
    const pRaw = Number(sDisp.value);
    const cRaw = Number(sCap.value);
    const total = dRaw + pRaw + cRaw || 1;

    const wd = dRaw / total;
    const wp = pRaw / total;
    const wc = cRaw / total;

    vDist.textContent = `${Math.round(wd * 100)}%`;
    vDisp.textContent = `${Math.round(wp * 100)}%`;
    vCap.textContent = `${Math.round(wc * 100)}%`;

    const ranked = options
      .map((o) => ({ ...o, score: wd * o.d + wp * o.p + wc * o.c }))
      .sort((a, b) => b.score - a.score);

    rankList.innerHTML = ranked
      .map(
        (item, i) => `
        <div class="rank-item">
          <div class="rank-row">
            <span><strong>#${i + 1}</strong> ${item.label}</span>
            <span class="rank-val">${item.score.toFixed(1)}</span>
          </div>
          <div class="bar-bg">
            <div class="bar-fill" style="width:${Math.min(100, item.score)}%"></div>
          </div>
          <div class="rank-sub">D:${item.d} · P:${item.p} · C:${item.c}</div>
        </div>
      `
      )
      .join("");
  }

  [sDist, sDisp, sCap].forEach((el) => el?.addEventListener("input", updateWLC));
  resetBtn?.addEventListener("click", () => {
    sDist.value = "50";
    sDisp.value = "30";
    sCap.value = "20";
    updateWLC();
  });

  updateWLC();
})();