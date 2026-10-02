// 모바일 메뉴, QUICK 메뉴, 맨 위로, 긴 목록 "더 보기"
(function () {
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
  }

  var quickBtn = document.querySelector("[data-quick-toggle]");
  var quickPanel = document.querySelector("[data-quick-panel]");
  if (quickBtn && quickPanel) {
    quickBtn.addEventListener("click", function () {
      var open = quickBtn.getAttribute("aria-expanded") === "true";
      quickBtn.setAttribute("aria-expanded", String(!open));
      quickPanel.hidden = open;
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (quickBtn && quickBtn.getAttribute("aria-expanded") === "true") { quickBtn.click(); quickBtn.focus(); }
    if (navToggle && navToggle.getAttribute("aria-expanded") === "true") { navToggle.click(); navToggle.focus(); }
  });

  var topBtn = document.querySelector("[data-top]");
  if (topBtn) {
    var onScroll = function () { topBtn.classList.toggle("is-visible", window.scrollY > 400); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  document.querySelectorAll("[data-collapsible]").forEach(function (list) {
    list.classList.add("is-collapsed");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "more-toggle";
    btn.setAttribute("aria-expanded", "false");
    var MORE = document.body.dataset.more || "더 보기 +", LESS = document.body.dataset.less || "접기 −";
    btn.textContent = MORE;
    btn.addEventListener("click", function () {
      var collapsed = list.classList.toggle("is-collapsed");
      btn.setAttribute("aria-expanded", String(!collapsed));
      btn.textContent = collapsed ? MORE : LESS;
    });
    list.after(btn);
  });
})();
