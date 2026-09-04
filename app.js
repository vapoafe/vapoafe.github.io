/* -----------------------------------------------
/* CircuitParticles.js Configuration & Translation
/* Customized by Vasileios Apostolidis-Afentoulis
/* ----------------------------------------------- */

var circuitInstance = null;

var lightConfig = {
  particles: {
    number: {
      value: 10,
      density: { enable: true, value_area: 900 }
    },
    color: {
      value: ["#012169", "#5a2aad", "#035f42", "#d97706", "#841515"]
    },
    shape: {
      type: ["via", "chip", "circle", "hex", "resistor"],
      stroke: { width: 1.5, color: "#012169" }
    },
    opacity: {
      value: 0.85,
      random: true,
      anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false }
    },
    size: {
      value: 10,
      random: true,
      anim: { enable: true, speed: 1.2, size_min: 2 }
    },
    move: {
      enable: true,
      speed: 0.2,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "bounce"
    }
  },
  traces: {
    enable: true,
    distance: 140,
    color: "#012169",
    opacity: 0.45,
    width: 1.6,
    style: "chamfer45",
    chamferSize: 12,
    maxConnections: 3
  },
  signals: {
    enable: true,
    speed: 0.5,
    frequency: 0.85,
    length: 18,
    size: 2.5,
    color: "#FFC20A",
    tailColor: "#012169",
    glow: 6,
    burstOnClick: true
  },
  glow: {
    enable: true,
    intensity: 8,
    color: "#012169",
    nodeGlow: true,
    traceGlow: false,
    signalGlow: true,
    compositeMode: "source-over"
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "breaker" },
      onclick: { enable: true, mode: "pulse_burst" },
      resize: true
    },
    modes: {
      probe: { radius: 150, traceColor: "#FFC20A", maxConnections: 4 },
      voltage_surge: { radius: 160, speedMultiplier: 2.5, sparkCount: 5 },
      breaker: { radius: 180, force: 5 },
      magnet: { radius: 160, speed: 2 },
      pulse_burst: { count: 6, speed: 5 },
      emp_blast: { radius: 220, ringSpeed: 4, disableDuration: 1500 }
    }
  },
  background: {
    color: "#f8fafc",
    grid: { enable: true, type: "dots", size: 30, opacity: 0.3, color: "#012169" },
    pcbMarks: { enable: true, labels: true, opacity: 0.3 }
  },
  retina_detect: true,
  fps_limit: 60
};

var darkConfig = {
  particles: {
    number: {
      value: 10,
      density: { enable: true, value_area: 900 }
    },
    color: {
      value: ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#f43f5e"]
    },
    shape: {
      type: ["via", "chip", "circle", "hex", "resistor"],
      stroke: { width: 1.5, color: "#38bdf8" }
    },
    opacity: {
      value: 0.85,
      random: true,
      anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false }
    },
    size: {
      value: 10,
      random: true,
      anim: { enable: true, speed: 1.2, size_min: 2 }
    },
    move: {
      enable: true,
      speed: 0.2,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "bounce"
    }
  },
  traces: {
    enable: true,
    distance: 140,
    color: "#38bdf8",
    opacity: 0.45,
    width: 1.6,
    style: "chamfer45",
    chamferSize: 12,
    maxConnections: 3
  },
  signals: {
    enable: true,
    speed: 0.5,
    frequency: 0.85,
    length: 18,
    size: 2.5,
    color: "#fbbf24",
    tailColor: "#38bdf8",
    glow: 6,
    burstOnClick: true
  },
  glow: {
    enable: true,
    intensity: 8,
    color: "#38bdf8",
    nodeGlow: true,
    traceGlow: false,
    signalGlow: true,
    compositeMode: "source-over"
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "magnet" },
      onclick: { enable: true, mode: "pulse_burst" },
      resize: true
    },
    modes: {
      probe: { radius: 150, traceColor: "#fbbf24", maxConnections: 4 },
      voltage_surge: { radius: 160, speedMultiplier: 2.5, sparkCount: 5 },
      breaker: { radius: 180, force: 5 },
      magnet: { radius: 160, speed: 2 },
      pulse_burst: { count: 6, speed: 5 },
      emp_blast: { radius: 220, ringSpeed: 4, disableDuration: 1500 }
    }
  },
  background: {
    color: "#080d1a",
    grid: { enable: true, type: "dots", size: 30, opacity: 0.3, color: "#38bdf8" },
    pcbMarks: { enable: true, labels: true, opacity: 0.3 }
  },
  retina_detect: true,
  fps_limit: 60
};

function initCircuit(theme) {
  var particlesContainer = document.getElementById("particles-js");
  if (!particlesContainer) return;

  if (circuitInstance) {
    circuitInstance.destroy();
    circuitInstance = null;
  }

  var config = (theme === "dark") ? darkConfig : lightConfig;
  circuitInstance = circuitParticlesJS("particles-js", config);
}

function updateThemeUI(theme) {
  var toggleBtn = document.getElementById("theme-toggle");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Switch to light mode");
  } else {
    document.body.classList.remove("dark-mode");
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Switch to dark mode");
  }
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
  updateThemeUI(theme);
  initCircuit(theme);
}

function toggleTheme() {
  var isDark = document.body.classList.contains("dark-mode");
  setTheme(isDark ? "light" : "dark");
}

/* -----------------------------------------------
/* Shared String Constants
/* ----------------------------------------------- */
var str_epal = "1st Vocational High School of Kalamaria";
var str_teacher = "Electronics Engineering Vocational High School Teacher";
var str_uom_dai = "University of Macedonia ‑ Department of Applied Informatics";
var str_foodsmart_org = str_uom_dai + " + Institut Lyfe - Research & Innovation Center";
var str_foodsmart_sub = "Shaping Smarter Consumer Behaviour and Food Choice ‑ FOODSMART, Horizon 2020 Marie Sklodowska‑Curie Research and Innovation Staff Exchange";
var str_foodsmart_dev = "Developer of the FOODSMART application";
var str_researcher = "Researcher";
var str_ihu_diie = "International Hellenic University - Department of Information and Electronic Engineering";

var str_epal_el = "1ο Επαγγελματικό Λύκειο Καλαμαριάς";
var str_teacher_el = "Εκπαιδευτικός Ηλεκτρονικών Δευτεροβάθμιας Εκπαίδευσης";
var str_uom_dai_el = "Πανεπιστήμιο Μακεδονίας ‑ Τμήμα Εφαρμοσμένης Πληροφορικής";
var str_foodsmart_org_el = str_uom_dai_el + " + Ινστιτούτο Lyfe - Κέντρο Έρευνας και Καινοτομίας";
var str_foodsmart_sub_el = "Διαμόρφωση Εξυπνότερης Καταναλωτικής Συμπεριφοράς και Διατροφικών Επιλογών ‑ FOODSMART, Horizon 2020 Marie Sklodowska‑Curie Ανταλλαγή Προσωπικού Έρευνας και Καινοτομίας";
var str_foodsmart_dev_el = "Προγραμματιστής της εφαρμογής FOODSMART";
var str_researcher_el = "Ερευνητής";
var str_ihu_diie_el = "Διεθνές Πανεπιστήμιο της Ελλάδος - Τμήμα Μηχανικών Πληροφορικής και Ηλεκτρονικών Συστημάτων";

/* -----------------------------------------------
/* Bilingual Translation (English / Greek)
/* ----------------------------------------------- */

var translations = {
  en: {
    pageTitle: "Vasileios Apostolidis-Afentoulis CV",
    pageDesc: "Academic and professional CV of Vasileios Apostolidis-Afentoulis",
    headerTitle: "Vasileios Apostolidis-Afentoulis CV",
    headerBio: "I am Vasileios Apostolidis-Afentoulis, an independent Researcher and Vocational High School Teacher specialised in Electronics Engineering.",
    skillsTitle: "Skills",
    skillsExpHeading: "Experience with",
    skillsLangHeading: "Languages",
    langGreek: "Greek - Native speaker C2",
    langEnglish: "English - Proficient C2",
    eduTitle: "Education",
    edu4_school: "Hellenic Open University - Department of Computer Science",
    edu4_desc: "Bachelor of Science in Informatics (In progress)",
    edu3_school: "University of Macedonia - Department of Educational & Social Policy",
    edu3_desc: "Master of Education in Educational Sciences: Information and Communications Technology (ICT) Implementation in Education and Lifelong Learning",
    edu2_school: str_ihu_diie,
    edu2_desc: "Master of Science in Web Intelligence",
    edu1_school: str_ihu_diie,
    edu1_desc: "Bachelor of Science in Electronic Engineering",
    expTitle: "Experience",
    exp9_org: str_epal,
    exp9_pos: str_teacher,
    exp8_org: str_epal,
    exp8_pos: str_teacher,
    exp7_org: str_uom_dai,
    exp7_sub: "Computational Methodologies & Operations Research Laboratory (CMOR Lab)",
    exp7_pos: str_researcher,
    exp6_org: "University of Macedonia - Department of Educational & Social Policy",
    exp6_sub: "Autism Inclusion in Distance Learning - ASD‑IncluDi, Erasmus+ Programme",
    exp6_pos: "Utilization of ICT and IoT Technologies in Education",
    exp5_org: str_foodsmart_org,
    exp5_sub: str_foodsmart_sub,
    exp5_pos: str_foodsmart_dev,
    exp4_org: str_foodsmart_org,
    exp4_sub: str_foodsmart_sub,
    exp4_pos: str_foodsmart_dev,
    exp3_org: str_uom_dai,
    exp3_sub: "Multimedia, Security and Networking Laboratory (MSN Lab)",
    exp3_pos: str_researcher,
    exp2_org: "Evernote Corporation",
    exp2_pos: "Evernote Community Leader (Intern)",
    exp1_org: "International Hellenic University - Department of Library, Archival & Information Studies",
    exp1_pos: "Computer Network Manager (Intern)",
    pubTitle: "Publications",
    pub7_inst: "Independent Researcher - Petmeza Language School - Primary School of Limenaria",
    pub6_inst: str_uom_dai,
    pub5_inst: str_uom_dai,
    pub4_inst: str_uom_dai,
    pub3_inst: "University of Thessaly & University of Macedonia ‑ Department of Applied Informatics",
    pub2_inst: str_uom_dai,
    pub1_inst: str_ihu_diie,
    posLabel: "Position:",
    footerText: 'Created by: <a href="https://github.com/ritaly" target="_blank" rel="noopener noreferrer" aria-label="Visit ritaly\'s website who is the creator of this template">@ritaly</a> / Customized by: <a href="https://github.com/vapoafe" target="_blank" rel="noopener noreferrer" aria-label="Visit vapoafe\'s website who customized the original template">@vapoafe</a> / 2018 - Present',
    btnFlagSrc: "./img/gr.svg",
    btnFlagAlt: "Greek Flag",
    btnAria: "Μετάβαση στα Ελληνικά",
    btnTitle: "Switch language to Greek / Μετάβαση στα Ελληνικά"
  },
  el: {
    pageTitle: "Βιογραφικό Βασιλείου Αποστολίδη-Αφεντούλη",
    pageDesc: "Ακαδημαϊκό και επαγγελματικό βιογραφικό σημείωμα του Βασιλείου Αποστολίδη-Αφεντούλη",
    headerTitle: "Βιογραφικό Βασιλείου Αποστολίδη-Αφεντούλη",
    headerBio: "Είμαι ο Βασίλειος Αποστολίδης-Αφεντούλης, ανεξάρτητος Ακαδημαϊκός Ερευνητής και Εκπαιδευτικός Ηλεκτρονικών Δευτεροβάθμιας Εκπαίδευσης.",
    skillsTitle: "Δεξιότητες",
    skillsExpHeading: "Εμπειρία σε",
    skillsLangHeading: "Γλώσσες",
    langGreek: "Ελληνικά - Μητρική γλώσσα C2",
    langEnglish: "Αγγλικά - Άριστη γνώση C2",
    eduTitle: "Εκπαίδευση",
    edu4_school: "Ελληνικό Ανοικτό Πανεπιστήμιο - Τμήμα Πληροφορικής",
    edu4_desc: "Πτυχίο Πληροφορικής (Σε εξέλιξη)",
    edu3_school: "Πανεπιστήμιο Μακεδονίας - Τμήμα Εκπαιδευτικής & Κοινωνικής Πολιτικής",
    edu3_desc: "Μεταπτυχιακό Δίπλωμα Ειδίκευσης στις Επιστήμες της Αγωγής: Εφαρμογές Τεχνολογιών Πληροφορίας και Επικοινωνιών (ΤΠΕ) στην Εκπαίδευση και τη Δια Βίου Μάθηση",
    edu2_school: str_ihu_diie_el,
    edu2_desc: "Μεταπτυχιακό Δίπλωμα Ειδίκευσης στις Ευφυείς Τεχνολογίες Διαδικτύου (Web Intelligence)",
    edu1_school: str_ihu_diie_el,
    edu1_desc: "Πτυχίο Ηλεκτρονικού Μηχανικού",
    expTitle: "Επαγγελματική Εμπειρία",
    exp9_org: str_epal_el,
    exp9_pos: str_teacher_el,
    exp8_org: str_epal_el,
    exp8_pos: str_teacher_el,
    exp7_org: str_uom_dai_el,
    exp7_sub: "Εργαστήριο Υπολογιστικών Μεθοδολογιών & Επιχειρησιακής Έρευνας (CMOR Lab)",
    exp7_pos: str_researcher_el,
    exp6_org: "Πανεπιστήμιο Μακεδονίας - Τμήμα Εκπαιδευτικής & Κοινωνικής Πολιτικής",
    exp6_sub: "Συμπερίληψη του Αυτισμού στην Εξ Αποστάσεως Εκπαίδευση - ASD‑IncluDi, Πρόγραμμα Erasmus+",
    exp6_pos: "Αξιοποίηση Τεχνολογιών ΤΠΕ και IoT στην Εκπαίδευση",
    exp5_org: str_foodsmart_org_el,
    exp5_sub: str_foodsmart_sub_el,
    exp5_pos: str_foodsmart_dev_el,
    exp4_org: str_foodsmart_org_el,
    exp4_sub: str_foodsmart_sub_el,
    exp4_pos: str_foodsmart_dev_el,
    exp3_org: str_uom_dai_el,
    exp3_sub: "Εργαστήριο Πολυμέσων, Ασφάλειας και Δικτύωσης (MSN Lab)",
    exp3_pos: str_researcher_el,
    exp2_org: "Evernote Corporation",
    exp2_pos: "Evernote Community Leader (Πρακτική άσκηση)",
    exp1_org: "Διεθνές Πανεπιστήμιο της Ελλάδος - Τμήμα Βιβλιοθηκονομίας, Αρχειονομίας και Συστημάτων Πληροφόρησης",
    exp1_pos: "Διαχειριστής Δικτύων Υπολογιστών (Πρακτική άσκηση)",
    pubTitle: "Δημοσιεύσεις",
    pub7_inst: "Ανεξάρτητος Ερευνητής - Κέντρο Ξένων Γλωσσών Πετμεζά - Δημοτικό Σχολείο Λιμεναρίων",
    pub6_inst: str_uom_dai_el,
    pub5_inst: str_uom_dai_el,
    pub4_inst: str_uom_dai_el,
    pub3_inst: "Πανεπιστήμιο Θεσσαλίας & Πανεπιστήμιο Μακεδονίας ‑ Τμήμα Εφαρμοσμένης Πληροφορικής",
    pub2_inst: str_uom_dai_el,
    pub1_inst: str_ihu_diie_el,
    posLabel: "Θέση:",
    footerText: 'Δημιουργήθηκε από: <a href="https://github.com/ritaly" target="_blank" rel="noopener noreferrer" aria-label="Επισκεφτείτε την ιστοσελίδα της ritaly">@ritaly</a> / Διαμορφώθηκε από: <a href="https://github.com/vapoafe" target="_blank" rel="noopener noreferrer" aria-label="Επισκεφτείτε την ιστοσελίδα του vapoafe">@vapoafe</a> / 2018 - Σήμερα',
    btnFlagSrc: "./img/uk.svg",
    btnFlagAlt: "United Kingdom Flag",
    btnAria: "Switch language to English",
    btnTitle: "Switch language to English / Αλλαγή σε Αγγλικά"
  }
};

function updateLanguageUI(lang) {
  var t = translations[lang] || translations.en;

  document.documentElement.lang = lang;
  document.title = t.pageTitle;

  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", t.pageDesc);

  // Update button
  var langBtn = document.getElementById("lang-toggle");
  var langFlag = document.getElementById("lang-flag-img");

  if (langBtn) {
    langBtn.setAttribute("aria-label", t.btnAria);
    langBtn.setAttribute("title", t.btnTitle);
  }

  if (langFlag) {
    langFlag.src = t.btnFlagSrc;
    langFlag.alt = t.btnFlagAlt;
  }

  // Update elements with data-i18n attribute
  var i18nElements = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < i18nElements.length; i++) {
    var el = i18nElements[i];
    var key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      if (el.getAttribute("data-i18n-html") === "true") {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  }
}

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  updateLanguageUI(lang);
}

function toggleLanguage() {
  var currentLang = localStorage.getItem("lang") || "en";
  var nextLang = (currentLang === "en") ? "el" : "en";
  setLanguage(nextLang);
}

document.addEventListener("DOMContentLoaded", function () {
  // Theme initialization
  var savedTheme = localStorage.getItem("theme") || "light";
  updateThemeUI(savedTheme);
  initCircuit(savedTheme);

  var themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Language initialization
  var savedLang = localStorage.getItem("lang") || "en";
  updateLanguageUI(savedLang);

  var langToggleBtn = document.getElementById("lang-toggle");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", toggleLanguage);
  }
});

document.addEventListener("visibilitychange", function() {
  if (circuitInstance) {
    if (document.hidden) {
      circuitInstance.isPlaying = false;
    } else {
      circuitInstance.isPlaying = true;
    }
  }
});