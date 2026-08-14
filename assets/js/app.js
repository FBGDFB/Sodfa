
                       
   

              
            
(function () {
"use strict";

var CONFIG = null;
var app = document.getElementById("app");
var sectionCache = {};
var sectionList = [];
var timers = [];
var countersObs = null;
var toastOn = true;

/* ─── أدوات مساعدة ─── */
function qs(sel, root) { return (root || document).querySelector(sel); }
function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function pad2(n) { return (n < 10 ? "0" : "") + n; }
function hexToRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c;}).join('');var n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255];}
function rgbToHex(r,g,b){return'#'+[r,g,b].map(function(v){return Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0');}).join('');}
function mix(a,b,t){var A=hexToRgb(a),B=hexToRgb(b);return rgbToHex(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t);}
function lighten(x,t){return mix(x,'#ffffff',t);}
function darken(x,t){return mix(x,'#000000',t);}

var STAR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4 5.8 21l1.6-7L2 9.3l7.1-.7z"/></svg>';
var CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>';

var ICONS = {
  cod: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 12h.01M18 12h.01"/></svg>',
  returns: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l2.5 2.5"/></svg>',
  truck: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
  shield: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>',
  droplet: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"/></svg>',
  sprout: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 21V9"/><path d="M12 9C12 5 9 3 5 3c0 4 3 6 7 6zM12 13c0-4 3-6 7-6 0 4-3 6-7 6z"/></svg>',
  sparkle: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/></svg>',
  sun: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>',
  leaf: '<svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 7.5 4.5 11.5 6.3 16c1.5 3.8 5.7 6 5.7 6s4.2-2.2 5.7-6c1.8-4.5-.2-8.5-5.7-14z"/></svg>'
};

function waLink(num, msg) { return "https://wa.me/" + num + (msg ? "?text=" + encodeURIComponent(msg) : ""); }
function HREFS(c) {
  return {
    waMain: waLink(c.site.whatsappMain, c.site.whatsappMessage),
    waStore: waLink(c.site.whatsappStore),
    tel: "tel:" + c.site.phoneTel,
    mail: "mailto:" + c.site.email,
    maps: c.site.mapsUrl,
    instagram: c.site.instagram,
    facebook: c.site.facebook,
    tiktok: c.site.tiktok
  };
}
function bindHrefs(root, c) {
  var map = HREFS(c);
  qsa("[data-href]", root).forEach(function (el) {
    var v = map[el.getAttribute("data-href")];
    if (v) el.setAttribute("href", v);
  });
}
function bindSiteTexts(root, c) {
  qsa("[data-t]", root).forEach(function (el) {
    var v = c.site[el.getAttribute("data-t")];
    if (v != null) el.textContent = v;
  });
}

/* ─── إشعارات ─── */
var toastEl = qs("#toast"), toastTxt = qs("#toastTxt"), toastT = null;
function showToast(msg) {
  if (!toastOn) return;
  toastTxt.textContent = msg;
  toastEl.classList.add("show");
  if (toastT) clearTimeout(toastT);
  toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
}

/* ─── Loading Skeletons ─── */
function skeletonFor(id) {
  if (id === "hero") return '<div class="sk-wrap"><div class="sk-col"><div class="sk" style="height:26px;width:40%"></div><div class="sk" style="height:56px;width:92%"></div><div class="sk" style="height:18px;width:80%"></div><div class="sk" style="height:48px;width:60%"></div></div><div class="sk sk-arch"></div></div>';
  if (id === "stats" || id === "trust" || id === "benefits" || id === "store") return '<div class="sk-band"><div class="sk" style="height:110px"></div></div>';
  if (id === "footer") return '<div class="sk-band" style="margin:0;border-radius:0"><div class="sk" style="height:220px"></div></div>';
  var cards = { oils: 4, flash: 2, cases: 2, products: 3, reviews: 3, faq: 4, order: 4 }[id] || 4;
  var cols = (id === "products" || id === "reviews" || id === "order") ? "repeat(3,1fr)" : "repeat(2,1fr)";
  var h = (id === "cases" || id === "products") ? 320 : 190;
  var items = "";
  for (var i = 0; i < cards; i++) items += '<div class="sk" style="height:' + h + 'px"></div>';
  return '<div class="wrap" style="padding:4rem 22px"><div class="sk" style="height:42px;width:55%;margin:0 auto 26px"></div><div class="sk-grid" style="grid-template-columns:' + cols + '">' + items + "</div></div>";
}

/* ─── تحميل ملف قسم مع التخزين المؤقت ─── */
function fetchSection(s) {
  if (sectionCache[s.id]) return Promise.resolve(sectionCache[s.id]);
  return fetch(s.file).then(function (res) {
    if (!res.ok) throw new Error(s.id);
    return res.text();
  }).then(function (txt) {
    sectionCache[s.id] = txt;
    return txt;
  });
}

/* ─── بناء الصفحة: يحمّل فقط الأقسام المفعّلة وبترتيبها ─── */
function clearTimers() { timers.forEach(function (t) { clearInterval(t); }); timers = []; }

function buildApp() {
  clearTimers();
  if (countersObs) countersObs.disconnect();
  app.innerHTML = "";
  var chain = Promise.resolve();
  sectionList.forEach(function (s) {
    if (!s.enabled) return; /* القسم غير المفعّل لا يتم تحميله إطلاقاً */
    var mount = document.createElement(s.id === "hero" ? "div" : "section");
    mount.setAttribute("data-section", s.id);
    mount.id = s.id;
    if (s.id === "stats" || s.id === "trust") mount.classList.add("band-wrap");
    mount.innerHTML = skeletonFor(s.id);
    app.appendChild(mount);
    chain = chain.then(function () {
      return fetchSection(s).then(function (html) {
        mount.innerHTML = html;
        if (RENDER[s.id]) RENDER[s.id](mount, CONFIG);
        bindHrefs(mount, CONFIG);
        if (INIT[s.id]) INIT[s.id](mount, CONFIG);
        revealIn(mount);
        markImagesLoaded(mount);
      }).catch(function () {
        mount.innerHTML = '<div class="load-error">تعذر تحميل هذا القسم<br><button class="retry-btn" data-retry="' + s.id + '">إعادة المحاولة</button></div>';
      });
    });
  });
  chain.then(function () {
    applyPageSettings();
    applyButtonSettings();
    bindGlobalUI();
  });
}

app.addEventListener("click", function (e) {
  var btn = e.target.closest("[data-retry]");
  if (btn) buildApp();
});

/* ─── Reveal ─── */
function revealIn(root) {
  qsa(".rv", root).forEach(function (el) {
    var d = parseInt(el.getAttribute("data-d") || "0", 10);
    setTimeout(function () { el.classList.add("in"); }, d + 60);
  });
}

/* ─── ظهور الصور بعد التحميل ─── */
document.addEventListener("load", function (e) {
  var img = e.target;
  if (img && img.tagName === "IMG") img.classList.add("img-loaded");
}, true);
function markImagesLoaded(root) {
  qsa("img", root).forEach(function (img) {
    if (img.complete) img.classList.add("img-loaded");
  });
}

/* ─── عدادات الأرقام ─── */
function initCounters(root) {
  if (countersObs) countersObs.disconnect();
  var fmt = function (n) { return n.toLocaleString("en-US"); };
  countersObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var target = parseInt(el.getAttribute("data-count"), 10);
      var pre = el.getAttribute("data-pre") || "";
      var suf = el.getAttribute("data-suf") || "";
      var t0 = null, dur = 1600;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + fmt(Math.round(target * e)) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countersObs.unobserve(el);
    });
  }, { threshold: .6 });
  qsa("[data-count]", root).forEach(function (el) { countersObs.observe(el); });
}

/* ─── RENDER: تعبئة البيانات من config.json ─── */
var RENDER = {
  hero: function (h, c) {
    var d = c.hero;
    qs('[data-el="badge"]', h).textContent = d.badge;
    qs('[data-el="title"]', h).innerHTML = d.h1a + ' <span class="grad">' + d.hl + "</span> " + d.h1b;
    qs('[data-el="lead"]', h).textContent = d.lead;
    qs('[data-el="rate"]', h).textContent = d.rate;
    qs('[data-el="trustNote"]', h).textContent = d.trustNote;
    var stars = "";
    for (var i = 0; i < 5; i++) stars += STAR;
    qs('[data-el="stars"]', h).innerHTML = stars;
    qs('[data-el="heroImg"]', h).src = d.img;
  },
  stats: function (h, c) {
    var list = qs("[data-list]", h);
    list.innerHTML = c.stats.map(function (s) {
      return '<div class="stat"><div class="num"><span data-count="' + s.count + '" data-pre="' + (s.pre || "") + '" data-suf="' + (s.suf || "") + '">0</span></div><div class="lbl">' + s.label + "</div></div>";
    }).join("");
  },
  trust: function (h, c) {
    var list = qs("[data-list]", h);
    list.innerHTML = c.trust.map(function (t) {
      return '<div class="tb-item"><span class="tb-ic">' + (ICONS[t.icon] || ICONS.leaf) + "</span><div><b>" + t.title + "</b><small>" + t.desc + "</small></div></div>";
    }).join("");
  },
  flash: function (h, c) {
    var list = qs("[data-list]", h);
    list.innerHTML = c.flash.products.map(function (p) {
      return '<div class="fs-card"><div class="fs-img"><span class="fs-disc">' + p.discount + '</span><img loading="lazy" src="' + p.img + '" alt="' + p.title + '"></div>' +
        '<div class="fs-body"><div><h3>' + p.title + '</h3><div class="fs-rate"><b>' + p.rating + "</b>" + STAR + "<span>(" + p.reviews + " تقييم)</span></div></div>" +
        '<div><div class="fs-price"><b>' + p.price + "</b>" + (p.oldPrice ? "<s>" + p.oldPrice + "</s>" : "") + "</div>" +
        '<button class="fs-add" data-add="' + p.title + '">أضف إلى السلة</button></div></div></div>';
    }).join("");
  },
  oils: function (h, c) {
    var list = qs("[data-list]", h);
    list.innerHTML = c.oils.map(function (o) {
      return '<article class="oil-card"><div class="oil-img"><span class="oil-num">' + o.num + '</span><img loading="lazy" src="' + o.img + '" alt="' + o.name + '"></div>' +
        '<div class="oil-body"><h3>' + o.name + " <small>" + o.latin + "</small></h3><ul>" +
        o.points.map(function (pt) { return "<li>" + CHECK + pt + "</li>"; }).join("") +
        '</ul><span class="oil-tag">' + o.tag + "</span></div></article>";
    }).join("");
  },
  benefits: function (h, c) {
    var list = qs("[data-list]", h);
    list.innerHTML = c.benefits.map(function (b, i) {
      return '<div class="ben w' + b.span + '"><span class="ghost">' + pad2(i + 1) + '</span><div class="ic">' + (ICONS[b.icon] || ICONS.leaf) + "</div><h3>" + b.title + "</h3><p>" + b.desc + "</p></div>";
    }).join("");
    var vid = qs("#benefitsVideo", h);
    if (vid && c.site.benefitsVideoUrl) {
      vid.src = c.site.benefitsVideoUrl;
      vid.addEventListener("canplay", function () { vid.classList.add("ready"); vid.play().catch(function(){}); });
      vid.addEventListener("error", function () { vid.style.display = "none"; });
    } else if (vid) vid.style.display = "none";
  },
  video: function (h, c) {
    var img = qs('[data-el="poster"]', h);
    if (img) img.src = c.hero.img;
  },
  cases: function (h, c) {
    var list = qs("[data-list]", h);
    list.innerHTML = c.cases.map(function (cs) {
      return '<article class="case"><div class="ba" data-ba>' +
        '<img class="after" src="' + cs.after + '" alt="بعد - ' + cs.name + '">' +
        '<img class="before" src="' + cs.before + '" alt="قبل - ' + cs.name + '">' +
        '<span class="tag b">' + cs.beforeTag + '</span><span class="tag a">' + cs.afterTag + "</span>" +
        '<div class="handle"><div class="knob" tabindex="0" aria-label="اسحب للمقارنة"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg></div></div>' +
        '<span class="hint"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>اسحب للمقارنة</span>' +
        '</div><div class="case-body"><div class="who"><h3>' + cs.name + "</h3><span>" + cs.period + "</span></div>" +
        '<blockquote>"' + cs.quote + '"</div><div class="case-body-stars" style="padding:0 1.6rem 1.6rem">' + STAR + STAR + STAR + STAR + STAR + "</div></div></article>";
    }).join("");
  },
  about: function (h, c) {
    var d = c.about;
    qs('[data-el="aboutImg"]', h).src = d.img;
    qs('[data-el="badge"]', h).textContent = d.badge;
    qs('[data-el="eyebrow"]', h).textContent = d.eyebrow;
    qs('[data-el="title"]', h).textContent = d.title;
    qs('[data-el="p1"]', h).innerHTML = d.p1.replace(/كريمة/, "<b>كريمة</b>");
    qs('[data-el="p2"]', h).innerHTML = d.p2.replace(/الدفع عند الاستلام/, "<b>الدفع عند الاستلام</b>").replace(/إمكانية الإرجاع/, "<b>إمكانية الإرجاع</b>");
    qs('[data-el="sig"]', h).textContent = d.sig;
  },
  products: function (h, c) {
    var list = qs("[data-list]", h);
    list.innerHTML = c.products.map(function (p) {
      return '<div class="pd-card"><div class="pd-img"><span class="pd-label">' + p.label + '</span><img loading="lazy" src="' + p.img + '" alt="' + p.title + '"></div>' +
        '<div class="pd-body"><h3>' + p.title + "</h3><p>" + p.desc + '</p><div class="pd-price">' + p.price + "</div>" +
        '<button class="pd-btn" data-order="' + p.title + '">اطلبي الآن</button></div></div>';
    }).join("");
  },
  reviews: function (h, c) {
    var list = qs("[data-list]", h);
    list.innerHTML = c.testimonials.map(function (t) {
      var stars = "";
      for (var i = 0; i < t.stars; i++) stars += STAR;
      return '<div class="tst-slide"><div class="tst-card"><span class="quote">”</span><div class="tst-stars">' + stars + "</div><p>" + t.text + "</p>" +
        '<div class="tst-who"><span class="av">' + t.initial + '</span><div><b class="nm">' + t.name + '</b><span class="loc"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + t.city + "</span></div></div></div></div>";
    }).join("");
  },
  faq: function (h, c) {
    var list = qs("[data-list]", h);
    list.innerHTML = c.faq.map(function (f) {
      return '<div class="faq-item"><button class="faq-q">' + f.q + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button><div class="faq-a"><p>' + f.a + "</p></div></div>";
    }).join("");
  },
  order: function (h, c) {
    var list = qs("[data-list]", h);
    list.innerHTML = c.orderSteps.map(function (s) {
      return '<div class="step-card"><div class="step-num">' + s.num + "</div><h3>" + s.title + "</h3><p>" + s.desc + '</p><span class="mini">' + s.mini + "</span></div>";
    }).join("");
  },
  cta: function (h) { },
  store: function (h, c) {
    bindSiteTexts(h, c);
    var frame = qs("#mapFrame", h);
    if (frame) frame.src = c.site.mapsEmbed;
  },
  footer: function (h, c) {
    bindSiteTexts(h, c);
  }
};

/* ─── INIT: تفعيل التفاعلات داخل كل قسم ─── */
var INIT = {
  hero: function (h) {
    /* أوراق متساقطة */
    var fz = qs("#fallZone", h);
    if (fz && !document.body.classList.contains("no-leaves")) {
      for (var i = 0; i < 14; i++) {
        var el = document.createElement("span");
        var flower = i % 4 === 3;
        el.className = "faller" + (flower ? " flower" : "");
        var sz = flower ? 12 + Math.random() * 8 : 14 + Math.random() * 14;
        el.style.width = sz + "px"; el.style.height = sz + "px";
        el.style.right = (2 + Math.random() * 96) + "%";
        el.style.opacity = (flower ? .35 + Math.random() * .25 : .22 + Math.random() * .28).toFixed(2);
        var dur = 9 + Math.random() * 9;
        el.style.animationDuration = dur + "s";
        el.style.animationDelay = (-Math.random() * dur) + "s";
        el.innerHTML = flower ? ICONS.leaf.replace("21", "21") : ICONS.leaf;
        fz.appendChild(el);
      }
    }
    /* ميلان الصورة */
    var tilt = qs("#heroTilt", h);
    if (tilt && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      var sec = h;
      sec.addEventListener("mousemove", function (e) {
        var r = sec.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - .5) * -7;
        var ry = ((e.clientX - r.left) / r.width - .5) * 7;
        tilt.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      sec.addEventListener("mouseleave", function () { tilt.style.transform = "rotateX(0deg) rotateY(0deg)"; });
    }
  },
  stats: function (h) { initCounters(h); },
  flash: function (h, c) {
    var target = Date.now() + (c.flash.hours || 60) * 3600 * 1000;
    var d = qs('[data-fs="d"]', h), hh = qs('[data-fs="h"]', h), m = qs('[data-fs="m"]', h), s = qs('[data-fs="s"]', h);
    function tick() {
      var diff = Math.max(0, target - Date.now());
      d.textContent = pad2(Math.floor(diff / 86400000));
      hh.textContent = pad2(Math.floor(diff % 86400000 / 3600000));
      m.textContent = pad2(Math.floor(diff % 3600000 / 60000));
      s.textContent = pad2(Math.floor(diff % 60000 / 1000));
    }
    tick(); timers.push(setInterval(tick, 1000));
    qsa(".fs-add", h).forEach(function (b) {
      b.addEventListener("click", function () { showToast('تمت إضافة "' + b.getAttribute("data-add") + '" إلى السلة ✓'); });
    });
  },
  cases: function (h) {
    qsa("[data-ba]", h).forEach(function (sl) {
      var dragging = false;
      var setFromX = function (x) {
        var r = sl.getBoundingClientRect();
        var p = ((x - r.left) / r.width) * 100;
        p = Math.max(6, Math.min(94, p));
        sl.style.setProperty("--pos", p + "%");
        sl.classList.add("used");
      };
      sl.addEventListener("pointerdown", function (e) { dragging = true; sl.setPointerCapture(e.pointerId); setFromX(e.clientX); });
      sl.addEventListener("pointermove", function (e) { if (dragging) setFromX(e.clientX); });
      ["pointerup", "pointercancel"].forEach(function (ev) { sl.addEventListener(ev, function () { dragging = false; }); });
      var knob = qs(".knob", sl);
      knob.addEventListener("keydown", function (e) {
        var cur = parseFloat(getComputedStyle(sl).getPropertyValue("--pos")) || 50;
        if (e.key === "ArrowLeft") { sl.style.setProperty("--pos", Math.max(6, cur - 4) + "%"); e.preventDefault(); }
        if (e.key === "ArrowRight") { sl.style.setProperty("--pos", Math.min(94, cur + 4) + "%"); e.preventDefault(); }
        sl.classList.add("used");
      });
    });
  },
  products: function (h) {
    qsa(".pd-btn", h).forEach(function (b) {
      b.addEventListener("click", function () {
        window.open(waLink(CONFIG.site.whatsappMain, "أريد طلب: " + b.getAttribute("data-order")), "_blank");
      });
    });
  },
  reviews: function (h) {
    var track = qs("#tstTrack", h), viewport = qs("#tstViewport", h);
    var prev = qs("#tstPrev", h), next = qs("#tstNext", h);
    var orig = track.children.length;
    track.innerHTML += track.innerHTML;
    var idx = 0, timer = null;
    function perView() { return window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 640 ? 2 : 1); }
    function apply(anim) {
      if (anim === false) track.classList.add("noanim");
      track.style.transform = "translateX(" + (idx * (100 / perView())) + "%)";
      if (anim === false) { void track.offsetWidth; track.classList.remove("noanim"); }
    }
    function resetTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { idx++; apply(); }, 4000);
      timers.push(timer);
    }
    track.addEventListener("transitionend", function () {
      if (idx >= orig) { idx = idx - orig; apply(false); }
    });
    next.addEventListener("click", function () { idx++; apply(); resetTimer(); });
    prev.addEventListener("click", function () { idx = (idx - 1 + orig * 2) % orig; apply(); resetTimer(); });
    viewport.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    viewport.addEventListener("mouseleave", function () { resetTimer(); });
    resetTimer();
    window.addEventListener("resize", function () { idx = 0; apply(false); });
    apply(false);
  },
  faq: function (h) {
    qsa(".faq-item", h).forEach(function (item) {
      var q = qs(".faq-q", item), a = qs(".faq-a", item);
      q.addEventListener("click", function () {
        var open = item.classList.contains("open");
        qsa(".faq-item.open", h).forEach(function (o) { o.classList.remove("open"); qs(".faq-a", o).style.maxHeight = null; });
        if (!open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
      });
    });
  },
  video: function (h) {
    var player = qs("#player", h);
    player.addEventListener("click", function () { openVideoModal(); });
    player.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openVideoModal(); } });
  },
  cta: function (h) {
    var hh = qs('[data-cd="h"]', h), m = qs('[data-cd="m"]', h), s = qs('[data-cd="s"]', h);
    function tick() {
      var now = new Date(), end = new Date();
      end.setHours(23, 59, 59, 999);
      var diff = Math.max(0, end - now);
      hh.textContent = pad2(Math.floor(diff / 3600000));
      m.textContent = pad2(Math.floor(diff % 3600000 / 60000));
      s.textContent = pad2(Math.floor(diff % 60000 / 1000));
    }
    tick(); timers.push(setInterval(tick, 1000));
  },
  footer: function (h) {
    var form = qs('[data-form="newsletter"]', h);
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = qs('[data-el="nlEmail"]', h), btn = qs('[data-el="nlBtn"]', h);
      if (!input.value) return;
      btn.textContent = "✓ تم الاشتراك";
      showToast("تم اشتراكك في النشرة البريدية بنجاح 🌿");
      setTimeout(function () { btn.textContent = "اشتركي الآن"; input.value = ""; }, 3000);
    });
    qsa("[data-legal]", h).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var d = CONFIG.legal[btn.getAttribute("data-legal")];
        if (!d || !pageOn("legalModal")) return;
        qs("#legalTitle").textContent = d.title;
        qs("#legalBody").innerHTML = d.body;
        qs("#legalModal").classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
  }
};

/* ─── نوافذ عامة ─── */
function openVideoModal() {
  if (!pageOn("videoModal")) return;
  var modal = qs("#videoModal");
  var holder = qs("#videoHolder"), sub = qs("#vmSub"), steps = qs("#vmSteps"), title = qs("#vmTitle");
  if (CONFIG.site.videoUrl && CONFIG.site.videoUrl.trim() !== "") {
    title.textContent = "الفيديو التوضيحي";
    sub.style.display = "none"; steps.style.display = "none";
    holder.style.display = "block";
    holder.innerHTML = '<video src="' + CONFIG.site.videoUrl + '" controls autoplay playsinline></video>';
  } else {
    title.textContent = "كيف تعمل تركيبة SODFA؟";
    sub.style.display = ""; steps.style.display = "";
    holder.style.display = "none"; holder.innerHTML = "";
  }
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeVideoModal() { qs("#videoModal").classList.remove("open"); document.body.style.overflow = ""; qs("#videoHolder").innerHTML = ""; }
qsa('#videoModal [data-close]').forEach(function (c) { c.addEventListener("click", closeVideoModal); });

function openContact() {
  if (!pageOn("contactModal")) return;
  qs("#contactModal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeContact() { qs("#contactModal").classList.remove("open"); document.body.style.overflow = ""; }
qsa('[data-close-contact]').forEach(function (c) { c.addEventListener("click", closeContact); });
qsa("#legalModal [data-close-legal]").forEach(function (c) { c.addEventListener("click", function () { qs("#legalModal").classList.remove("open"); document.body.style.overflow = ""; }); });

/* ─── إعدادات الأقسام / العناصر / الأزرار ─── */
var PAGE_SETTINGS_DEFAULT = [
  { id: "newsletter", name: "النشرة البريدية", enabled: true },
  { id: "contact", name: "عمود التواصل (فوتر)", enabled: true },
  { id: "map", name: "خريطة الموقع", enabled: true },
  { id: "legal", name: "روابط الخصوصية / الشروط", enabled: true },
  { id: "socialIcons", name: "أيقونات التواصل الاجتماعي", enabled: true },
  { id: "leaves", name: "الأوراق المتساقطة", enabled: true },
  { id: "videoModal", name: "نافذة الفيديو", enabled: true },
  { id: "contactModal", name: "نافذة التواصل", enabled: true },
  { id: "legalModal", name: "نافذة الخصوصية / الشروط", enabled: true },
  { id: "toast", name: "رسائل الإشعارات", enabled: true },
  { id: "preloader", name: "شاشة التحميل", enabled: true },
  { id: "scrollProgress", name: "شريط تقدم التمرير", enabled: true }
];
var BUTTONS_SETTINGS_DEFAULT = [
  { id: "waFab", name: "زر الواتساب العائم", position: "right", enabled: true },
  { id: "scrollTop", name: "زر العودة للأعلى", position: "left", enabled: true },
  { id: "bell", name: "زر الجرس (الإعدادات)", position: "right", enabled: true },
  { id: "theme", name: "استوديو الألوان", position: "right", enabled: true }
];
var pageState = loadState("sodfaPage", PAGE_SETTINGS_DEFAULT);
var btnState = loadState("sodfaButtons", BUTTONS_SETTINGS_DEFAULT);

function loadState(key, defaults) {
  try {
    var saved = JSON.parse(localStorage.getItem(key));
    if (saved && saved.length) return saved;
  } catch (e) {}
  return defaults.map(function (s) { var o = {}; for (var k in s) o[k] = s[k]; return o; });
}
function saveState(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

function pageOn(id) {
  for (var i = 0; i < pageState.length; i++) if (pageState[i].id === id) return pageState[i].enabled;
  return true;
}

function applyPageSettings() {
  pageState.forEach(function (s) {
    var on = s.enabled;
    switch (s.id) {
      case "leaves":
        document.body.classList.toggle("no-leaves", !on);
        var fz = qs("#fallZone");
        if (fz) fz.style.display = on ? "" : "none";
        break;
      case "scrollProgress": qs("#progress").style.display = on ? "" : "none"; break;
      case "map":
        var sb = qs("#storeBand");
        if (sb) sb.classList.toggle("map-off", !on);
        break;
      case "toast": toastOn = on; break;
      case "preloader": qs("#preloader").style.display = on ? "" : "none"; break;
      default:
        qsa('[data-page="' + s.id + '"]').forEach(function (el) { el.style.display = on ? "" : "none"; });
    }
  });
}

function applyButtonSettings() {
  var sides = { left: [], right: [] };
  var bottomMap = {};
  qsa(".fbtn").forEach(function (el) { el.style.display = "none"; });
  btnState.forEach(function (s) {
    var el = qs('.fbtn[data-btn="' + s.id + '"]');
    if (!el || !s.enabled) return;
    var side = s.position === "left" ? "left" : "right";
    sides[side].push({ el: el, id: s.id });
  });
  ["left", "right"].forEach(function (side) {
    var other = side === "left" ? "right" : "left";
    sides[side].forEach(function (item, i) {
      var bot = 22 + i * 74;
      item.el.style.display = "";
      item.el.style[side] = "22px";
      item.el.style[other] = "auto";
      item.el.style.bottom = bot + "px";
      bottomMap[item.id] = bot;
    });
  });
  [["theme", qs("#tPanel")], ["bell", qs("#bellPanel")]].forEach(function (p) {
    var st = null;
    btnState.forEach(function (s) { if (s.id === p[0]) st = s; });
    var panel = p[1]; if (!panel) return;
    if (!st || !st.enabled) return;
    var side = st.position === "left" ? "left" : "right";
    var other = side === "left" ? "right" : "left";
    panel.style[side] = "22px"; panel.style[other] = "auto";
    var b = bottomMap[st.id];
    if (b != null) panel.style.bottom = (b + 70) + "px";
  });
}

/* ─── واجهة لوحة الجرس ─── */
function renderSecMgr() {
  var mgr = qs("#secMgr");
  if (!mgr) return;
  mgr.innerHTML = "";
  sectionList.forEach(function (item, idx) {
    var row = document.createElement("div");
    row.className = "sec-row" + (item.enabled ? "" : " off");
    row.innerHTML = '<input type="checkbox" ' + (item.enabled ? "checked" : "") + ' aria-label="تفعيل ' + item.id + '">' +
      '<span class="s-name">' + sectionName(item.id) + "</span>" +
      '<span class="s-ord">' +
      '<button data-mv="-1" aria-label="تحريك لأعلى"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg></button>' +
      '<button data-mv="1" aria-label="تحريك لأسفل"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>' +
      "</span>";
    qs("input", row).addEventListener("change", function (e) {
      sectionList[idx].enabled = e.target.checked;
      saveState("sodfaSections", sectionList);
      buildApp();
      renderSecMgr();
    });
    qsa("[data-mv]", row).forEach(function (b) {
      b.addEventListener("click", function () {
        var dir = parseInt(b.getAttribute("data-mv"), 10);
        var ni = idx + dir;
        if (ni < 0 || ni >= sectionList.length) return;
        var t = sectionList[idx]; sectionList[idx] = sectionList[ni]; sectionList[ni] = t;
        saveState("sodfaSections", sectionList);
        buildApp();
        renderSecMgr();
      });
    });
    mgr.appendChild(row);
  });
}
function sectionName(id) {
  var names = { hero: "الواجهة الرئيسية", stats: "شريط الإحصائيات", trust: "شارات الثقة", flash: "التخفيضات السريعة", oils: "المكونات (الزيوت)", benefits: "مميزات السيروم", video: "الفيديو", cases: "النتائج قبل/بعد", about: "من نحن (قصتنا)", products: "منتجاتنا (المتجر)", reviews: "آراء الزبونات", faq: "الأسئلة الشائعة", order: "طريقة الطلب", cta: "العرض النهائي", store: "زيارة المتجر", footer: "تذييل الصفحة" };
  return names[id] || id;
}
function renderPageMgr() {
  var mgr = qs("#pageMgr");
  if (!mgr) return;
  mgr.innerHTML = "";
  pageState.forEach(function (item, idx) {
    var row = document.createElement("div");
    row.className = "sec-row" + (item.enabled ? "" : " off");
    row.innerHTML = '<input type="checkbox" ' + (item.enabled ? "checked" : "") + ' aria-label="تفعيل ' + item.id + '">' + '<span class="s-name">' + item.name + "</span>";
    qs("input", row).addEventListener("change", function (e) {
      pageState[idx].enabled = e.target.checked;
      saveState("sodfaPage", pageState);
      applyPageSettings();
      renderPageMgr();
    });
    mgr.appendChild(row);
  });
}
function renderBtnMgr() {
  var mgr = qs("#btnMgr");
  if (!mgr) return;
  mgr.innerHTML = "";
  btnState.forEach(function (item, idx) {
    var row = document.createElement("div");
    row.className = "sec-row" + (item.enabled ? "" : " off");
    row.innerHTML = '<input type="checkbox" ' + (item.enabled ? "checked" : "") + ' aria-label="تفعيل ' + item.id + '">' +
      '<span class="s-name">' + item.name + "</span>" +
      '<span class="pos-seg">' +
      '<button data-pos="right" class="' + (item.position !== "left" ? "active" : "") + '">يمين</button>' +
      '<button data-pos="left" class="' + (item.position === "left" ? "active" : "") + '">يسار</button>' +
      "</span>";
    qs("input", row).addEventListener("change", function (e) {
      btnState[idx].enabled = e.target.checked;
      saveState("sodfaButtons", btnState);
      applyButtonSettings();
      renderBtnMgr();
    });
    qsa("[data-pos]", row).forEach(function (b) {
      b.addEventListener("click", function () {
        btnState[idx].position = b.getAttribute("data-pos");
        saveState("sodfaButtons", btnState);
        applyButtonSettings();
        renderBtnMgr();
      });
    });
    mgr.appendChild(row);
  });
}

var bellFab = qs("#bellFab"), bellPanel = qs("#bellPanel");
var tFab = qs("#tFab"), tPanel = qs("#tPanel");
bellFab.addEventListener("click", function () { bellPanel.classList.toggle("open"); tPanel.classList.remove("open"); });
qs("#bellClose").addEventListener("click", function () { bellPanel.classList.remove("open"); });
qs("#openThemeFromBell").addEventListener("click", function () { bellPanel.classList.remove("open"); tPanel.classList.add("open"); });
qs("#resetAll").addEventListener("click", function () {
  sectionList = CONFIG.sections.map(function (s) { return { id: s.id, file: s.file, enabled: s.enabled }; });
  pageState = PAGE_SETTINGS_DEFAULT.map(function (s) { var o = {}; for (var k in s) o[k] = s[k]; return o; });
  btnState = BUTTONS_SETTINGS_DEFAULT.map(function (s) { return { id: s.id, name: s.name, position: s.position, enabled: s.enabled }; });
  saveState("sodfaSections", sectionList);
  saveState("sodfaPage", pageState);
  saveState("sodfaButtons", btnState);
  buildApp();
  renderSecMgr(); renderPageMgr(); renderBtnMgr();
  showToast("تمت استعادة جميع الإعدادات الافتراضية");
});

/* ─── استوديو الألوان ─── */
var THEME_PRESETS = [
  { name: "زمردي فاخر", p: "#1E7A57", a: "#C6A15B", b: "#F7F3E8" },
  { name: "غابة عميقة", p: "#0F5132", a: "#D4AF37", b: "#F1F5EC" },
  { name: "نعناعي منعش", p: "#3BA98C", a: "#E0B06B", b: "#F0FAF5" },
  { name: "زيتوني دافئ", p: "#7A8450", a: "#C9A15B", b: "#F7F4EA" },
  { name: "تيل ملكي", p: "#0E7C7B", a: "#E3BE6C", b: "#EFF7F6" },
  { name: "وردي فاخر", p: "#D4627F", a: "#C6A15B", b: "#FDF2F5" }
];
var curTheme = null;
var rootS = document.documentElement.style;
var colP = qs("#colP"), colA = qs("#colA"), colB = qs("#colB");
var valP = qs("#valP"), valA = qs("#valA"), valB = qs("#valB");
var presetsWrap = qs("#tpPresets");
function applyTheme(t, save) {
  curTheme = t;
  var p = t.p, a = t.a, b = t.b;
  rootS.setProperty("--brand", p);
  rootS.setProperty("--brand-deep", mix(p, "#04140e", .86));
  rootS.setProperty("--brand-deep2", mix(p, "#04140e", .68));
  rootS.setProperty("--brand-soft", lighten(p, .72));
  rootS.setProperty("--brand-tint", mix(b, lighten(p, .85), .5));
  var pr = hexToRgb(p); rootS.setProperty("--brand-glow", "rgba(" + pr[0] + "," + pr[1] + "," + pr[2] + ",0.3)");
  rootS.setProperty("--accent", a);
  rootS.setProperty("--accent-soft", lighten(a, .38));
  rootS.setProperty("--accent-deep", darken(a, .3));
  rootS.setProperty("--bg", b);
  rootS.setProperty("--bg2", mix(b, lighten(p, .55), .38));
  rootS.setProperty("--card", mix(b, "#ffffff", .72));
  rootS.setProperty("--ink", mix(p, "#06140e", .86));
  rootS.setProperty("--muted", mix(p, "#5a6b5f", .55));
  var lr = hexToRgb(mix(p, "#17402f", .5));
  rootS.setProperty("--line", "rgba(" + lr[0] + "," + lr[1] + "," + lr[2] + ",0.15)");
  colP.value = p; colA.value = a; colB.value = b;
  valP.textContent = p; valA.textContent = a; valB.textContent = b;
  qsa(".tp-preset", presetsWrap).forEach(function (btn) {
    var i = +btn.getAttribute("data-i"), ps = THEME_PRESETS[i];
    btn.classList.toggle("active", ps.p === curTheme.p && ps.a === curTheme.a && ps.b === curTheme.b);
  });
  if (save) { try { localStorage.setItem("sodfaTheme", JSON.stringify(t)); } catch (e) {} }
}
THEME_PRESETS.forEach(function (ps, i) {
  var btn = document.createElement("button");
  btn.className = "tp-preset"; btn.setAttribute("data-i", i);
  btn.innerHTML = '<i style="background:linear-gradient(135deg,' + ps.p + " 55%," + ps.a + ' 55%)"></i>' + ps.name;
  btn.addEventListener("click", function () { applyTheme({ p: ps.p, a: ps.a, b: ps.b }, true); });
  presetsWrap.appendChild(btn);
});
colP.addEventListener("input", function () { applyTheme({ p: colP.value, a: curTheme.a, b: curTheme.b }, false); });
colA.addEventListener("input", function () { applyTheme({ p: curTheme.p, a: colA.value, b: curTheme.b }, false); });
colB.addEventListener("input", function () { applyTheme({ p: curTheme.p, a: curTheme.a, b: colB.value }, false); });
[colP, colA, colB].forEach(function (inp) { inp.addEventListener("change", function () { try { localStorage.setItem("sodfaTheme", JSON.stringify(curTheme)); } catch (e) {} }); });
qs("#tpReset").addEventListener("click", function () { applyTheme({ p: THEME_PRESETS[0].p, a: THEME_PRESETS[0].a, b: THEME_PRESETS[0].b }, true); });
tFab.addEventListener("click", function () { tPanel.classList.toggle("open"); bellPanel.classList.remove("open"); });
qs("#tpClose").addEventListener("click", function () { tPanel.classList.remove("open"); });
var savedTheme = null; try { savedTheme = JSON.parse(localStorage.getItem("sodfaTheme")); } catch (e) {}
applyTheme(savedTheme && savedTheme.p ? savedTheme : { p: THEME_PRESETS[0].p, a: THEME_PRESETS[0].a, b: THEME_PRESETS[0].b }, false);

/* ─── ربط عناصر الواجهة الثابتة ─── */
function bindGlobalUI() {
  bindHrefs(document, CONFIG);
  bindSiteTexts(qs("#contactModal"), CONFIG);
  /* زر فتح التواصل في كل الصفحة */
  qsa("[data-open-contact]").forEach(function (b) {
    if (b._bound) return;
    b._bound = true;
    b.addEventListener("click", function (e) { e.preventDefault(); openContact(); });
  });
  /* نموذج التواصل */
  var cForm = qs("#cForm");
  if (cForm && !cForm._bound) {
    cForm._bound = true;
    var cfSend = qs("#cfSend"), cfOrig = cfSend.innerHTML;
    cForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!cForm.checkValidity()) { cForm.reportValidity(); return; }
      cfSend.disabled = true;
      cfSend.textContent = "جارٍ الإرسال...";
      setTimeout(function () {
        cfSend.classList.add("sent");
        cfSend.innerHTML = "✓ تم إرسال رسالتك بنجاح";
        showToast("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
        cForm.reset();
        setTimeout(function () { cfSend.classList.remove("sent"); cfSend.innerHTML = cfOrig; cfSend.disabled = false; closeContact(); }, 1800);
      }, 900);
    });
  }
}

/* ─── التنقل والقوائم ─── */
var navEl = qs("#nav"), prog = qs("#progress"), topBtn = qs("#topBtn");
function onScroll() {
  navEl.classList.toggle("scrolled", window.scrollY > 10);
  var max = document.documentElement.scrollHeight - window.innerHeight;
  if (prog) prog.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  if (topBtn) topBtn.classList.toggle("show", window.scrollY > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
var burger = qs("#burger"), mMenu = qs("#mMenu");
burger.addEventListener("click", function () { burger.classList.toggle("open"); mMenu.classList.toggle("open"); });
qsa("a,button", mMenu).forEach(function (a) { a.addEventListener("click", function () { burger.classList.remove("open"); mMenu.classList.remove("open"); }); });

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeVideoModal(); closeContact();
    qs("#legalModal").classList.remove("open"); document.body.style.overflow = "";
    tPanel.classList.remove("open"); bellPanel.classList.remove("open");
  }
});

/* ─── SEO من config.json ─── */
function applySeo() {
  var s = CONFIG.seo;
  if (!s) return;
  document.title = s.title;
  function meta(attr, key, val) {
    if (!val) return;
    var el = document.head.querySelector("meta[" + attr + '="' + key + '"]');
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", val);
  }
  meta("name", "description", s.description);
  meta("name", "keywords", s.keywords);
  meta("property", "og:title", s.title);
  meta("property", "og:description", s.description);
  meta("property", "og:image", s.ogImage);
  meta("property", "og:url", s.siteUrl);
  meta("property", "og:type", "website");
  var can = document.head.querySelector('link[rel="canonical"]');
  if (!can) { can = document.createElement("link"); can.rel = "canonical"; document.head.appendChild(can); }
  can.href = s.siteUrl;
}

/* ─── الإقلاع ─── */
fetch("./assets/json/config.json").then(function (res) {
  if (!res.ok) throw new Error("config");
  return res.json();
}).then(function (cfg) {
  CONFIG = cfg;
  applySeo();
  /* ترتيب الأقسام المحفوظ */
  var savedSections = null;
  try { savedSections = JSON.parse(localStorage.getItem("sodfaSections")); } catch (e) {}
  if (savedSections && savedSections.length) {
    var map = {};
    savedSections.forEach(function (s) { map[s.id] = s; });
    var ordered = [];
    savedSections.forEach(function (s) {
      var f = CONFIG.sections.find(function (x) { return x.id === s.id; });
      if (f) ordered.push({ id: f.id, file: f.file, enabled: s.enabled !== false });
    });
    CONFIG.sections.forEach(function (f) {
      if (!ordered.find(function (o) { return o.id === f.id; })) ordered.push({ id: f.id, file: f.file, enabled: f.enabled });
    });
    sectionList = ordered;
  } else {
    sectionList = CONFIG.sections.map(function (s) { return { id: s.id, file: s.file, enabled: s.enabled }; });
  }
  buildApp();
  renderSecMgr();
  renderPageMgr();
  renderBtnMgr();
  /* إخفاء شاشة التحميل */
  setTimeout(function () { qs("#preloader").classList.add("done"); }, 500);
}).catch(function () {
  app.innerHTML = '<div class="load-error" style="padding:6rem 1rem">تعذر تحميل ملف الإعدادات config.json<br>تأكدي من تشغيل الصفحة عبر خادم محلي<br><small style="color:#999">مثال: python -m http.server أو Live Server في VS Code</small></div>';
  qs("#preloader").classList.add("done");
});
})();
 


              
                    