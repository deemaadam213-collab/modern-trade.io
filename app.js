/* ECUMT 3-01 — shared UI: theme, language, session nav, exam answer persistence */
import { readSession, clearSession, api } from "./api-client.js";

(async function () {
  "use strict";

  var I18N = {
    ar: {
      brand_title: "المفاهيم الأساسية لبيئة التجارة الحديثة",
      nav_outcomes: "النواتج",
      nav_login: "دخول",
      nav_signup: "حساب جديد",
      nav_profile: "حسابي",
      nav_admin: "لوحة المعلم",
      footer_made: 'صُنع بواسطة <span class="footer__name">آدم محمد</span>',
      footer_super: "تحت إشراف ميس نسمة، ميس يارا وميس نرمين",
      hero_chip: "وحدة دراسية — الصف الأول / فني تجارة حديثة",
      hero_title: "المفاهيم الأساسية لبيئة التجارة الحديثة",
      hero_sub: "نواتج التعلم من الجدارة ECUMT 3-01 — ادرس كل ناتج في صفحته الخاصة من المحتوى المأخوذ من الكتاب، وحل اختبار الناتج في آخر الصفحة. سجّل حسابك لتحفظ إجاباتك ومتابعة درجاتك.",
      hero_cta1: "استعرض النواتج",
      hero_cta2: "ابدأ الدراسة والاختبار",
      out_kicker: "نواتج التعلم",
      out_title: "نواتج التعلم في الوحدة",
      out_lede: "لكل ناتج صفحة خاصة: الشرح الكامل من الكتاب ثم «متطلبات الدليل والإثبات» واختبار التقويم الذاتي في نهاية الصفحة.",
      req_title: "متطلبات الدليل والإثبات",
      card_go: "افتح صفحة الناتج",
      o1_title: "يتعرف على تقسيمات قطاع التجارة الحديثة",
      o1_r1: "يتعرَّف على مختلف القطاعات الفرعية ضمن صناعة البيع بالتجزة الحديثة وفقًا لمفهوم الهياكل التنظيمية في المؤسسات.",
      o1_r2: "يُطابق القطاعات الفرعية بما يناسب منظومة العمل في قطاع التجارة الحديثة.",
      o1_r3: "يتعرف على الأقسام الوظيفية التشغيلية المختلفة في متجر البيع بالتجزئة الحديثة جنبًا إلى جنب مع الغرض الرئيسي من كل منها.",
      o1_r4: "يتعرَّف على الإدارات الداعمة ووظائفها طبقًا لمفهوم الهياكل التنظيمية في المؤسسات والقواعد الأساسية بالعمل بالمتجر.",
      o1_r5: "يتعرَّف على أصحاب المصلحة بالمؤسسة وفقًا لآليات التعامل بهذه الصناعة.",
      o2_title: "يحدد طبيعة السوق المستهدف للمتجر",
      o2_r1: "يصف أنواع العملاء وفقًا لأساسيات التعريف بالعميل وعادات الشراء.",
      o2_r2: "يتعرف على أنماط التسوق الاستهلاكية بالتجارة الحديثة وفقًا لتحليل أنماط التسوق وخصائص المتسوِّقين.",
      o2_r3: "يتعرف على السوق المستهدف للمتجر وفقًا لشريحة سوق المؤسسة.",
      o2_r4: "يلمّ بالسوق المستهدف وفقًا لاستراتيجية التسويق الخاصة بالمؤسسة.",
      o3_title: "ينفذ عملية متابعة تدفُّق المخزون والمبيعات من خلال عمليات التجارة الحديثة",
      o3_r1: "يستعلم عن تدفق المخزون من خلال البرامج المتخصصة.",
      o3_r2: "يتعرف على تأثير الوظيفة على الآخرين في المؤسسة من حيث الأنظمة الأساسية والأنظمة الفرعية.",
      op1_kicker: "الناتج الأول",
      op2_kicker: "الناتج الثاني",
      op3_kicker: "الناتج الثالث",
      op_req_lede: "متطلبات الدليل والإثبات لهذا الناتج:",
      exam_kicker: "اختبار الناتج",
      exam_title: "اختبار التقويم الذاتي",
      exam_sub: "أجب عن أسئلة هذا الناتج في مكان الحل؛ الإجابة تُحفظ تلقائيًا في حسابك، ويعرضها المعلم لتقييمها.",
      meter_open: "أسئلة هذا الناتج المُجابة",
      print_btn: "طباعة إجاباتي",
      ph_answer: "اكتب إجابتك هنا...",
      save_note_guest: "إجاباتك تُحفظ في هذا المتصفح فقط — سجّل حسابك لتحفظها وتُقيَّم من المعلم.",
      save_note_saved: "تم حفظ إجاباتك في حسابك.",
      save_note_saving: "جارٍ حفظ إجاباتك...",
      save_note_error: "تعذّر الحفظ في السيرفر — سيُعاد المحاولة مع الكتابة القادمة.",
      q1: "1) ما معنى التجارة الحديثة؟",
      q2: "2) اذكر تقسيمات الشركات التجارية؟",
      q3: "3) اذكر أنواع تجارة التجزئة وفقًا لطبيعة المتجر؟",
      q4: "1) وضّح أهمية تشكيل الهيكل الوظيفي؟",
      q5: "2) من هم أصحاب المصلحة في تجارة التجزئة؟ اذكر ثلاثة منهم؟",
      q6: "1) من هم العملاء الأوفياء؟",
      q7: "2) ما أثر الاهتمام بالعملاء الأوفياء والتواصل معهم والاستماع إلى ملاحظاتهم؟",
      q8: "3) قارن بين شرائح العملاء؟",
      q9: "4) كيف يمكن التعامل مع العميل الثرثار والعميل المتشكك؟",
      q10: "1) اكتب ما تعرفه عن عناصر البيع السبعة 7Ps؟",
      q11: "2) اذكر تأثير عناصر البيع الأربعة على التسويق للمنظومة؟",
      q12: "3) اذكر تأثير الموظف في زيادة البيع وخفض قيمة المشتريات؟",
      print_h1: "إجاباتي — المفاهيم الأساسية لبيئة التجارة الحديثة ECUMT 3-01",
      print_open: "الأسئلة المفتوحة",
      print_empty: "(لم تُكتب إجابة بعد)",
      print_your: "إجابتك:"
    },
    en: {
      brand_title: "Basic Concepts of the Modern Commerce Environment",
      nav_outcomes: "Outcomes",
      nav_login: "Log in",
      nav_signup: "Sign up",
      nav_profile: "My account",
      nav_admin: "Teacher panel",
      footer_made: 'Made by <span class="footer__name">Adam Mohamed</span>',
      footer_super: "Under the supervision of Ms. Nesma, Ms. Yara & Ms. Nermin",
      hero_chip: "Study unit — Grade 1 / Modern Commerce Technician",
      hero_title: "Basic Concepts of the Modern Commerce Environment",
      hero_sub: "The learning outcomes of unit ECUMT 3-01 — study each outcome on its own page with content from the book, then take the outcome's self-assessment exam at the end. Sign up to save your answers and track your grades.",
      hero_cta1: "Browse the outcomes",
      hero_cta2: "Start studying & testing",
      out_kicker: "Learning outcomes",
      out_title: "The unit's learning outcomes",
      out_lede: "Each outcome has its own page: the full explanation from the book, the evidence requirements, and the self-assessment exam at the end of the page.",
      req_title: "Evidence requirements",
      card_go: "Open the outcome page",
      o1_title: "Recognizes the divisions of the modern commerce sector",
      o1_r1: "Identifies the different sub-sectors within the modern commerce retail industry according to the concept of organizational structures in institutions.",
      o1_r2: "Matches sub-sectors to the work system of the modern commerce sector.",
      o1_r3: "Recognizes the different operational departments of a modern commerce store together with the main purpose of each.",
      o1_r4: "Recognizes supporting departments and their functions according to organizational structures and basic in-store work rules.",
      o1_r5: "Recognizes the stakeholders of the institution according to the dealing mechanisms of this industry.",
      o2_title: "Determines the nature of the store's target market",
      o2_r1: "Describes customer types according to the basics of identifying customers and their buying habits.",
      o2_r2: "Recognizes consumer shopping patterns in modern commerce through analyzing shopping patterns and shopper characteristics.",
      o2_r3: "Recognizes the store's target market according to the organization's market segment.",
      o2_r4: "Reviews the target market according to the organization's marketing strategy.",
      o3_title: "Tracks the flow of inventory and sales through modern commerce operations",
      o3_r1: "Queries inventory flow through specialized software.",
      o3_r2: "Recognizes the effect of each function on others in the organization in terms of core systems and subsystems.",
      op1_kicker: "Outcome 1",
      op2_kicker: "Outcome 2",
      op3_kicker: "Outcome 3",
      op_req_lede: "Evidence requirements for this outcome:",
      exam_kicker: "Outcome exam",
      exam_title: "Self-assessment exam",
      exam_sub: "Answer this outcome's questions below; answers are saved automatically to your account so your teacher can review and grade them.",
      meter_open: "Questions answered in this outcome",
      print_btn: "Print my answers",
      ph_answer: "Write your answer here...",
      save_note_guest: "Answers are saved in this browser only — sign up to save them to your account and have them graded.",
      save_note_saved: "Your answers were saved to your account.",
      save_note_saving: "Saving your answers...",
      save_note_error: "Could not reach the server — will retry on your next edit.",
      q1: "1) What is the meaning of modern commerce?",
      q2: "2) State the classifications of commercial companies.",
      q3: "3) State the types of retail trade according to the nature of the store.",
      q4: "1) Explain the importance of forming the functional structure.",
      q5: "2) Who are the stakeholders in retail trade? Mention three of them.",
      q6: "1) Who are the loyal customers?",
      q7: "2) What is the effect of caring for loyal customers, communicating with them, and listening to their feedback?",
      q8: "3) Compare between customer segments.",
      q9: "4) How can you deal with the talkative customer and the skeptical customer?",
      q10: "1) Write what you know about the seven selling elements (7Ps).",
      q11: "2) State the effect of the four selling elements on marketing the system.",
      q12: "3) State the effect of the employee on increasing sales and reducing the value of purchases.",
      print_h1: "My Answers — ECUMT 3-01 Basic Concepts of Modern Commerce",
      print_open: "Open questions",
      print_empty: "(no answer written yet)",
      print_your: "Your answer:"
    }
  };

  var root = document.documentElement;
  var lang = root.getAttribute("lang") === "en" ? "en" : "ar";

  function t(key) {
    return (I18N[lang] && I18N[lang][key]) || I18N.ar[key] || key;
  }

  function applyLang() {
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key);
      if (key === "footer_made") el.innerHTML = val;
      else el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    var langBtn = document.getElementById("langBtn");
    if (langBtn) langBtn.textContent = lang === "ar" ? "EN" : "عربي";
    try { localStorage.setItem("ecumt-lang", lang); } catch (e) {}
    updateMeter();
    if (lastSaveState) setSaveNote(lastSaveState);
  }

  var lastSaveState = null;

  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ecumt-theme", next); } catch (e) {}
    });
  }

  var langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      lang = lang === "ar" ? "en" : "ar";
      applyLang();
    });
  }

  /* ---------- session-aware topbar ---------- */
  var session = readSession();
  if (session) {
    document.querySelectorAll("[data-student-name]").forEach(function (el) { el.textContent = session.user.username; });
    document.querySelectorAll("[data-account-nav], [data-logout]").forEach(function (el) { el.hidden = false; });
    document.querySelectorAll("[data-guest-nav]").forEach(function (el) { el.hidden = true; });
    if (session.user.role === "teacher") {
      document.querySelectorAll("[data-admin-nav]").forEach(function (el) { el.hidden = false; });
    }
  }

  document.querySelectorAll("[data-logout]").forEach(function (button) {
    button.addEventListener("click", async function () {
      button.disabled = true;
      try { await api.logOut(); } catch (e) {}
      clearSession();
      window.location.href = "index.html";
    });
  });

  /* ---------- exam answer persistence ---------- */
  var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-store]"));
  var STORE_KEY = "ecumt-answers" + (session ? ":" + session.user.id : "");
  var store = {};
  try { store = JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch (e) { store = {}; }

  var saveNote = document.querySelector("[data-save-note]");
  var meterFill = document.getElementById("openFill");
  var openCount = document.getElementById("openCount");

  function setSaveNote(state) {
    if (!saveNote) return;
    lastSaveState = state;
    var key = session ? "save_note_" + state : "save_note_guest";
    saveNote.textContent = t(key);
    saveNote.dataset.type = state;
  }

  function pageEntries() {
    var answers = {};
    inputs.forEach(function (el) {
      answers[el.getAttribute("data-store")] = el.value.slice(0, 4000);
    });
    return answers;
  }

  function persistProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {}
    setSaveNote("saved");
    if (!session) return;
    setSaveNote("saving");
    window.clearTimeout(persistProgress.timer);
    persistProgress.timer = window.setTimeout(function () {
      api.saveAnswers(pageEntries()).then(function () {
        setSaveNote("saved");
      }).catch(function () {
        setSaveNote("error");
      });
    }, 700);
  }

  function updateMeter() {
    if (!meterFill || !openCount) return;
    var total = inputs.length;
    var done = inputs.filter(function (el) { return el.value.trim().length > 0; }).length;
    openCount.textContent = done + "/" + total;
    meterFill.style.width = total ? (done / total * 100) + "%" : "0%";
  }

  inputs.forEach(function (el) {
    var id = el.getAttribute("data-store");
    if (store[id] && !el.value) el.value = store[id];
    el.addEventListener("input", function () {
      if (el.value.trim().length > 0) store[id] = el.value;
      else delete store[id];
      persistProgress();
      updateMeter();
    });
  });

  if (session && inputs.length > 0) {
    try {
      var remote = await api.answers();
      if (remote && remote.answers) {
        var loaded = 0;
        inputs.forEach(function (el) {
          var id = el.getAttribute("data-store");
          if (remote.answers[id] && !el.value) {
            el.value = remote.answers[id];
            store[id] = remote.answers[id];
            loaded++;
          }
        });
        if (loaded > 0) {
          try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {}
          updateMeter();
        }
      }
    } catch (e) {}
  }

  setSaveNote("guest");

  /* ---------- print ---------- */
  var printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      var area = document.getElementById("printArea");
      var html = "<h1>" + t("print_h1") + "</h1>";
      html += "<h2>" + t("print_open") + "</h2>";
      inputs.forEach(function (el) {
        var id = el.getAttribute("data-store");
        var qEl = document.querySelector('.q[data-q="' + id + '"] .q__text');
        var qText = qEl ? qEl.textContent : id;
        var ans = el.value.trim() || t("print_empty");
        html += "<h3>" + esc(qText) + "</h3>";
        html += "<p><strong>" + t("print_your") + "</strong></p>";
        html += '<div class="ans">' + esc(ans) + "</div>";
      });
      area.innerHTML = html;
      window.print();
    });
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  updateMeter();
  applyLang();
})();
