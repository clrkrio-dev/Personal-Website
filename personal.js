(function () {
  "use strict";

  /* =========================================================
     THEME TOGGLE
     ========================================================= */

  var toggle = document.getElementById("themeToggle");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var isDark =
        document.documentElement.getAttribute("data-theme") === "dark";

      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });

    // Load saved theme
    var savedTheme = localStorage.getItem("theme");

    var theme =
      savedTheme ||
      (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  /* =========================================================
     CERTIFICATION CAROUSEL
     ========================================================= */

  var wrap = document.getElementById("certWrap");
  var track = document.getElementById("certTrack");
  var dotsEl = document.getElementById("certDots");
  var prevBtn = document.getElementById("certPrev");
  var nextBtn = document.getElementById("certNext");

  // Stop if the certification carousel does not exist
  if (!wrap || !track) {
    return;
  }

  var slides = Array.prototype.slice.call(track.children);
  var current = 0;

  if (slides.length === 0) {
    return;
  }

  /* =========================================================
     BUILD DOTS
     ========================================================= */

  var dots = [];

  if (dotsEl) {
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");

      dot.className = "cert-dot" + (i === 0 ? " active" : "");

      dot.setAttribute("aria-label", "Go to certificate " + (i + 1));

      dot.addEventListener("click", function () {
        goTo(i);
      });

      dotsEl.appendChild(dot);
    });

    dots = Array.prototype.slice.call(dotsEl.children);
  }

  /* =========================================================
     SET ACTIVE SLIDE
     ========================================================= */

  function setActive(i) {
    current = i;

    slides.forEach(function (slide, index) {
      slide.classList.toggle("active", index === i);
    });

    dots.forEach(function (dot, index) {
      dot.classList.toggle("active", index === i);
    });
  }

  /* =========================================================
     MOVE TO SLIDE
     ========================================================= */

  function goTo(i) {
    if (slides.length === 0) {
      return;
    }

    // Loop carousel
    i = (i + slides.length) % slides.length;

    slides[i].scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    setActive(i);
  }

  /* =========================================================
     DETECT CENTER SLIDE WHILE SCROLLING
     ========================================================= */

  var scrollTimeout;

  wrap.addEventListener(
    "scroll",
    function () {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(function () {
        var wrapRect = wrap.getBoundingClientRect();

        var center = wrapRect.left + wrapRect.width / 2;

        var closest = 0;
        var closestDist = Infinity;

        slides.forEach(function (slide, index) {
          var rect = slide.getBoundingClientRect();

          var slideCenter = rect.left + rect.width / 2;

          var distance = Math.abs(slideCenter - center);

          if (distance < closestDist) {
            closestDist = distance;
            closest = index;
          }
        });

        setActive(closest);
      }, 80);
    },
    {
      passive: true,
    },
  );

  /* =========================================================
     PREVIOUS BUTTON
     ========================================================= */

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      goTo(current - 1);
    });
  }

  /* =========================================================
     NEXT BUTTON
     ========================================================= */

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      goTo(current + 1);
    });
  }

  /* =========================================================
     KEYBOARD CONTROL
     ========================================================= */

  document.addEventListener("keydown", function (event) {
    // Only control carousel when it is visible
    var rect = wrap.getBoundingClientRect();

    var isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

    if (!isVisible) {
      return;
    }

    if (event.key === "ArrowLeft") {
      goTo(current - 1);
    }

    if (event.key === "ArrowRight") {
      goTo(current + 1);
    }
  });

  /* =========================================================
     INITIAL STATE
     ========================================================= */

  setActive(0);
})();
