(function () {
    // Footer year
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // Mobile menu
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");

    function setMenu(open) {
        toggle.setAttribute("aria-expanded", String(open));
        links.classList.toggle("open", open);
    }

    if (toggle && links) {
        toggle.addEventListener("click", function () {
            setMenu(toggle.getAttribute("aria-expanded") !== "true");
        });
        links.addEventListener("click", function (e) {
            if (e.target.closest("a")) setMenu(false);
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") setMenu(false);
        });
    }

    // Highlight the nav link for the section in view
    var navAnchors = Array.prototype.slice.call(
        document.querySelectorAll('.nav-links a[href^="#"]')
    );
    var sections = navAnchors
        .map(function (a) { return document.querySelector(a.getAttribute("href")); })
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navAnchors.forEach(function (a) {
                    var match = a.getAttribute("href") === "#" + entry.target.id;
                    if (match) a.setAttribute("aria-current", "true");
                    else a.removeAttribute("aria-current");
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        sections.forEach(function (s) { observer.observe(s); });
    }
})();
