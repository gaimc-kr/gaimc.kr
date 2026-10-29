// 모바일 메뉴, QUICK 메뉴, 맨 위로, 긴 목록 "더 보기", 사진 크게 보기
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
  // 사진 크게 보기(라이트박스): [data-lightbox] 안의 표지·본문·활동 사진을 화면 가득 보고 좌우로 넘김
  var lbRoot = document.querySelector("[data-lightbox]");
  var lbImgs = lbRoot ? Array.prototype.slice.call(lbRoot.querySelectorAll(".cover img, .gallery img, .prose img")) : [];
  if (lbImgs.length) {
    var B = document.body.dataset;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML =
      '<button type="button" class="lb-close" aria-label="' + (B.lbClose || "닫기") + '">&times;</button>' +
      '<button type="button" class="lb-prev" aria-label="' + (B.lbPrev || "이전 사진") + '">&#8249;</button>' +
      '<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-caption"></figcaption></figure>' +
      '<button type="button" class="lb-next" aria-label="' + (B.lbNext || "다음 사진") + '">&#8250;</button>' +
      '<p class="lb-count" aria-live="polite"></p>';
    document.body.appendChild(box);
    var lbImg = box.querySelector(".lb-img"), lbCap = box.querySelector(".lb-caption"), lbCount = box.querySelector(".lb-count");
    var cur = 0, opener = null;
    var captionOf = function (img) {
      var fig = img.closest("figure");
      var fc = fig && !fig.classList.contains("cover") ? fig.querySelector("figcaption") : null;
      return fc ? fc.textContent : img.alt;
    };
    var show = function (i) {
      cur = (i + lbImgs.length) % lbImgs.length;
      var img = lbImgs[cur];
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = captionOf(img);
      lbCount.textContent = (cur + 1) + " / " + lbImgs.length;
      var next = lbImgs[(cur + 1) % lbImgs.length];
      if (next) { var pre = new Image(); pre.src = next.currentSrc || next.src; }
    };
    var openLb = function (i) {
      opener = document.activeElement;
      show(i);
      box.hidden = false;
      document.documentElement.classList.add("lb-open");
      box.querySelector(".lb-close").focus();
    };
    var closeLb = function () {
      box.hidden = true;
      document.documentElement.classList.remove("lb-open");
      lbImg.removeAttribute("src");
      if (opener && opener.focus) opener.focus();
    };
    var single = lbImgs.length < 2;
    box.querySelector(".lb-prev").hidden = single;
    box.querySelector(".lb-next").hidden = single;
    lbImgs.forEach(function (img, i) {
      img.classList.add("lb-thumb");
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", (B.lbOpen || "사진 크게 보기") + ": " + (img.alt || ""));
      img.addEventListener("click", function () { openLb(i); });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(i); }
      });
    });
    box.querySelector(".lb-close").addEventListener("click", closeLb);
    box.querySelector(".lb-prev").addEventListener("click", function () { show(cur - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(cur + 1); });
    box.addEventListener("click", function (e) { if (e.target === box || e.target.classList.contains("lb-figure")) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft" && !single) show(cur - 1);
      else if (e.key === "ArrowRight" && !single) show(cur + 1);
      else if (e.key === "Tab") {
        var f = Array.prototype.filter.call(box.querySelectorAll("button"), function (b) { return !b.hidden; });
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var tx = null, ty = null;
    box.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (tx === null || single) return;
      var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
      tx = ty = null;
    });
  }
})();
